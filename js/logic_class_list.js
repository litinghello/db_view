/**
 * Created by xh on 2018-01-30.
 */
let class_list_max_type = 7;
let class_list_max_count = 10 ;
//初始化显示列表
function init_class_list_display() {
    for(let index = 0;index < class_list_max_count;index++){
        let li_tag = $("#class_li_list_id"+(index % class_list_max_count));
        li_tag.find(".class_list_index").html("");
        li_tag.find(".class_list_name").html("");
        li_tag.find(".class_list_time").html("");
        li_tag.click((event)=> {
            let current_tag = event.currentTarget;
            let select_list_index = $(current_tag).find(".class_list_index").html();
            select_host_list_name = get_class_list_to_array(select_list_index);
            get_get_music_infor(select_host_list_class,select_host_list_name);//请求详细信息
            $("#class_list_area").find("span").css("color", "#797979");//清除所有选中
            $(current_tag).find(".class_list_name").css("color", "#ffffff");
            //enable_list_create_area(false);//隐藏方案设置区域
        });
        li_tag.mousedown(function(event){
            if(select_host_page_id !== 1){
                return ;
            }
            if(event.which === 3){//alert();// 1 = 鼠标左键 left; 2 = 鼠标中键; 3 = 鼠标右键
                let current_tag = event.currentTarget;
                let select_list_index = $(current_tag).find(".class_list_index").html();
                layer.confirm("你确定要删除["+ get_class_list_to_array(select_list_index).split(".")[0] +"]方案？", {icon: 3, title:"删除设备"}, function(index){
                    delete_class_list_to_array(select_list_index);
                    layer.close(index);
                });
            }
            //return false;//阻止链接跳转
        });
        li_tag.hide();
    }
    $("#class_list_page_prev").click((event)=>{
        //上一页
        let total_page = $("#class_list_total_page").html();
        let current_page = $("#class_list_current_page").html();
        if(current_page-- > 1){
            update_class_list_display((current_page-1) * class_list_max_count);
        }
    });
    $("#class_list_page_next").click((event)=>{
        //下一页
        let total_page = $("#class_list_total_page").html();
        let current_page = $("#class_list_current_page").html();
        if(current_page++ < total_page){
            update_class_list_display((current_page-1) * class_list_max_count);
        }
    });
    //这里初始化按键监听事件
    for(let index = 0;index < list_content_max_count;index++){
        $("#list_content_delete"+index).click((event)=>{
            let current_tag = event.currentTarget;
            let id = parseInt((current_tag.id).charAt((current_tag.id).length - 1));
            let page = parseInt($("#list_content_current_page").html());
            delete_list_content_to_array((page - 1)*list_content_max_count + id);
            update_list_content_display(0);
        });
    }
    //点击不同治疗方案加载不同数据
    $("#treatmentList>ul>li,#customList>ul>li").each(function () {
        $(this).click(function () {
            $(this).siblings().removeClass("activeLi");
            $(this).children("ul").slideDown(150)
        }).mouseleave(function () {
            $(this).children("ul").slideUp(150)
        })
    });

    for(let index = 0;index < class_list_max_type;index++){
        $("#class_list_class"+index).click((event)=>{
            for(let index = 0;index < class_list_max_type;index++){
                $("#class_list_class"+index).css("background", "");
            }
            let current_tag = event.currentTarget;
            $(current_tag).css("background", "#404040");
        });
    }

}
//选择设备的列表分类
function select_device_list_class(main_class,sub_class) {
    select_host_list_class = main_class + "/" + sub_class;
    get_download_music_class(select_host_list_class);
    //console.log(select_host_list_class);
}
/*//点击治疗列表每一个subclass 主页和预览页通用
function onDeviceListClick(t, className, subclassName) {
    select_host_list_class = className + "/" + subclassName;
    get_download_music_class(select_host_list_class);
}*/
//删除信息
function delete_class_list_to_array(index) {
    //select_host_list_infor.splice(index,1);//删除内容
    get_delete_music_file(select_host_list_class,get_class_list_to_array(index));//删除列表
}
function get_class_list_to_array(index) {
    if(index < select_host_list_infor.length){
        return select_host_list_infor[index];
    }else{
        return null;
    }
}
//显示列表
function update_class_list_display(start_index) {
    let is_end = false;
    $("#class_list_area").find("span").css("color", "#797979");//清除所有选中
    $("#class_list_total_page").text(Math.ceil(select_host_list_infor.length / class_list_max_count));
    $("#class_list_current_page").text(Math.floor(start_index / class_list_max_count) + 1);
    for(let index = 0;index < class_list_max_count;index++){
        let li_tag = $("#class_li_list_id"+(start_index % class_list_max_count));
        if(start_index < select_host_list_infor.length){
            li_tag.find(".class_list_index").text(start_index);
            li_tag.find(".class_list_name").text(select_host_list_infor[start_index].slice(0,select_host_list_infor[start_index].lastIndexOf(".")));
            li_tag.find(".class_list_name").attr("title",select_host_list_infor[start_index].slice(0,select_host_list_infor[start_index].lastIndexOf(".")));
            li_tag.find(".class_list_time").text("--:--");
            li_tag.show();
        }else{
            li_tag.hide();
            is_end = true;
        }
        start_index++;
    }
    return is_end;
}

//显示列表内容列表
let list_content_max_count = 4 ;
function init_list_content_display() {
    $("#list_content_page_prev").click((event)=>{
        //上一页
        let total_page = $("#list_content_total_page").html();
        let current_page = $("#list_content_current_page").html();
        if(current_page-- > 1){
            update_list_content_display((current_page-1) * list_content_max_count);
        }
    });
    $("#list_content_page_next").click((event)=>{
        //下一页
        let total_page = $("#list_content_total_page").html();
        let current_page = $("#list_content_current_page").html();
        if(current_page++ < total_page){
            update_list_content_display((current_page-1) * list_content_max_count);
        }
    });
}

let music_infor_exp={
    duration:["时间","单位秒"],
    size:["大小","字节"],
    bit_rate:["速度","bps"],
    //format_name:["格式","无"],
};
//添加一个内容
function add_list_content_to_array(object) {
    if(object.format !== undefined){
        select_host_music_infor = object.format;
    }else{
        select_host_music_infor={};
    }
}
//清除内容显示
function clean_list_content_array() {
    for(let index in select_host_music_infor) {
        if(select_host_music_infor.hasOwnProperty(index)) {  // 建议加上判断,如果没有扩展对象属性可以不加
            select_host_music_infor[index]="";
        }
    }
    update_list_content_display(0);//更新显示
}
//显示列表详细方案
function update_list_content_display(start_index){
    let is_end = false;
    let count_start_index = 0;
    let index_count = 0;

   $("#list_content_infor").find("li").show();
    for(let index = 0;index < list_content_max_count;index++){
        $("#list_content_index"+index).hide();
        $("#list_content_name"+index).hide();
        $("#list_content_time"+index).hide();
        $("#list_content_delete"+index).text("").hide();
    }
    for(let index in music_infor_exp) {
        if(music_infor_exp.hasOwnProperty(index)) {  // 建议加上判断,如果没有扩展对象属性可以不加
            if(count_start_index >= start_index){
                if(index_count < list_content_max_count) {
                    if (select_host_music_infor.hasOwnProperty(index)) {
                        $("#list_content_index" + index_count).text(count_start_index).show();
                        $("#list_content_name" + index_count).text(music_infor_exp[index][0]).show();
                        $("#list_content_time" + index_count).text(select_host_music_infor[index]).show();
                        $("#list_content_time" + index_count).attr("title", select_host_music_infor[index]);
                        $("#list_content_delete" + index_count).text(music_infor_exp[index][1]).show();
                        index_count++;
                    } else {
                        is_end = true;
                    }
                }
            }
            count_start_index++;
        }
    }
    $("#list_content_total_page").text(Math.ceil(count_start_index / list_content_max_count));
    $("#list_content_current_page").text(Math.floor(start_index / list_content_max_count) + 1);

    return is_end;
}

function sync_list_content_display(music_class){
    get_download_music_class(music_class);//同步一下列表
}
