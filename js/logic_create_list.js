/**
 * Created by xh on 2018-01-30.
 */
let upload_list_file_array=[];
let upload_list_file_type=0;

function init_list_create_display() {
    $("#list_create_input_button").click(()=>{
        clean_list_content_array();//清除类容显示
        enable_list_create_area(true);//开始区域显示
    });
    //区别新增方案时是哪种音乐方式
    $("#list_create_file_is_energy").click((event)=>{
        if((upload_list_file_type & 1) === 1){
            upload_list_file_type &= 10;
            $(event.currentTarget).removeClass("selected_tag");
        }else{
            upload_list_file_type |= 1;
            $(event.currentTarget).addClass("selected_tag");
        }
        //console.log(upload_list_file_type);
    });
    $("#list_create_file_is_music").click((event)=>{
        if((upload_list_file_type & 10) === 10){
            upload_list_file_type &= 1;
            $(event.currentTarget).removeClass("selected_tag");
        }else{
            upload_list_file_type |= 10;
            $(event.currentTarget).addClass("selected_tag");
        }
        //console.log(upload_list_file_type);
    });
    $("#list_create_file_confirm").click((event)=>{//确认提交按钮
        let music_name = $("#list_create_music_name");
        if(music_name.val() === ""){
            system_prompt_display("请设置音乐名称！");
            return ;
        }
        if(select_host_list_class === ""){
            system_prompt_display("请选择要保存的列表!");
            return ;
        }
        if(upload_list_file_type === 1){//上传波形
            let file_time = $("#list_create_energy_time").val();
            let file_name = encodeURI(music_name.val(), "UTF-8");
            create_music_energy_file(select_host_list_class,44100,read_list_create_file_energy_value(),file_time - 1,file_name,function(error){
                if(error){
                console.log("error:"+error);
                }else{
                    upload_music_to_server(select_host_list_class,"./",file_name+".ogg");//上传音乐文件
                }
            });
        }else if(upload_list_file_type === 10){//上传音乐
            if(read_list_create_file_music_infor() === undefined){
                system_prompt_display("请选择正确的音乐文件");
            }else{
                post_upload_music_file(select_host_list_class,music_name.val(),read_list_create_file_music_infor());//上传音乐文件
            }
        }else if(upload_list_file_type === 11){//混合叠加音乐上传
            let file_name = encodeURI(music_name.val(), "UTF-8");//
            let file_time = get_music_time(read_list_create_file_music_infor().path);//
            if(isNaN(file_time)){
                system_prompt_display("请选择正确的音乐文件");
                return ;
            }
            if(file_name.indexOf(".") > 0){//处理文件名称
                file_name = file_name.split(".")[0];
            }
            create_music_energy_file(select_host_list_class,44100,read_list_create_file_energy_value(),get_music_time(read_list_create_file_music_infor().path),"sinew",function(error){
                if(error){
                    console.log("error:"+error);
                }else{
                    music_a_sinew_mixing(file_time,read_list_create_file_music_infor().path,"sinew.ogg","./"+file_name+".ogg",function(){//混合成新的名词
                        upload_music_to_server(select_host_list_class,"./",file_name+".ogg");//上传音乐文件
                    });//混合音乐
                }
            });
        }else{
            system_prompt_display("请选择制作方案类型");
        }
    });
    $("#list_create_input_file").change((event)=>{
        $("#list_create_music_name").val(read_list_create_file_music_infor().name);
    });
    $("#list_create_save_confirm").click((event)=>{//上传提交按钮
        console.log("保存按钮按下");
    });
    $("#list_create_energy_time").on('input',(event)=>{
        let energy_time = $("#list_create_energy_time");
        if(parseInt(energy_time.val()) > parseInt(energy_time.attr("max"))){
            energy_time.val(parseInt(energy_time.attr("max")));
        }
    });
}

//开关方案制定显示
function enable_list_create_area(enable) {
    if(enable){
        $("#list_create_area").show();
        $("#list_play_energy_area").hide();
        $("#list_create_button_area").hide();
        $("#list_create_file_area").show();
        $("#list_content_save").show();
    }else {
        //$("#list_create_area").hide();
        //$("#list_play_energy_area").show();
        $("#list_create_button_area").show();
        $("#list_create_file_area").hide();
        $("#list_content_save").hide();
    }
}
//获取波形数组
function read_list_create_file_energy_value() {
    let energy_array=[];
    /*$(".numSpan").each(function(index,element){
            energy_array.push($(element).val());//读取值
    });*/
	let object_list = [1,2,3,6,8,5,7,4];//交换通道 bug修复
	for(let i = 0;i < object_list.length;i++){
		let hz_ch = $("#list_hz_ch"+object_list[i]).val();
		let db_ch = $("#list_db_ch"+object_list[i]).val();
		energy_array.push(hz_ch);
		energy_array.push(db_ch);
	}
	//交换数据
    //console.log(energy_array);
    return energy_array;
}
//获取文件信息
function read_list_create_file_music_infor() {
    return document.getElementById("list_create_input_file").files[0];
}
function clear_list_create_file_music_infor(){
    document.getElementById("list_create_input_music").reset();
    $("#list_create_music_name").val("");
    $("#list_create_file_is_music").removeClass("activeNewBox");
    $("#list_create_file_is_energy").removeClass("activeNewBox");

    upload_list_file_type &= 0;
    clean_list_content_array();//清除类容显示
    enable_list_create_area(false);//开始区域显示
}
//添加元素至数组中
function add_list_create_file_for_type(type) {
    let music_name = $("#list_create_music_name");
    if(music_name.val() === ""){
        system_prompt_display("请设置音乐名称！");
        return ;
    }
    if(type === 0){
        //let file_time = document.getElementById("list_create_energy_time").valueAsNumber / 60000;
        let file_time = $("#list_create_energy_time").val();
        let file_name = music_name.val()+".wav";
        upload_list_file_array.push({type:type,name:file_name,data:read_list_create_file_energy_value(),time:file_time});
        add_list_content_to_array(file_name,file_time);
    }else{
        let file_name = music_name.val()+".wav";
        upload_list_file_array.push({type:type,name:file_name,data:read_list_create_file_music_infor(),time:0});
        add_list_content_to_array(file_name,0);
    }
}
//转化一个字符串
function get_upload_list_file_energy_str(array) {
    let array_str = array.toString();
    return "["+"\""+array_str.replace(/,/g,"\",\"")+"\""+"]";
}
