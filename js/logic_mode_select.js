/**
 * Created by xh on 2018-01-30.
 */

let update_firmware_file = null;
let update_firmware_html = "";
//初始化软件配置功能
function init_soft_config() {
    load_config_infor();
    $("#soft_config_save").click(()=>{
        save_config_infor();
    });
    $("#soft_config_reset").click(()=>{
        restart_config_infor();
        system_prompt_display("清除成功，请重启软件！");
    });
    $("#change_device_password").click(()=>{
        let old_password = "";//
        let new_password = "";//
        layer.prompt({formType: 1,value:"",title: "请输入原设备密码"}, function (value, index) {
            old_password = value;
            layer.close(index);
            layer.prompt({formType: 1,value:"",title: "请输入新密码"}, function (value, index) {
                new_password = value;
                layer.close(index);
                layer.prompt({formType: 1,value:"",title: "请再次输入新密码"}, function (value, index) {
                    layer.close(index);
                    if(new_password !== value){
                        system_prompt_display("两次输入新密码不一致。");
                    }else{
                        get_change_device_password(old_password,new_password);//修改密码
                    }
                });
            });
        });
    });
    $("#soft_config_password").click(()=>{
        let new_password = "";//
        layer.prompt({formType: 1,value:"",title: "请输入新密码"}, function (value, index) {
            new_password = value;
            layer.close(index);
            layer.prompt({formType: 1,value:"",title: "请再次输入新密码"}, function (value, index) {
                layer.close(index);
                if(new_password !== value){
                    system_prompt_display("两次输入新密码不一致。");
                }else{
                    $("#soft_config_soft_password").val(value);
                    set_config_infor("soft_config_soft_password",value);
                }
            });
        });
    });
    // $("#soft_config_userdata_path").click(()=>{
    //
    // });
    init_update_firmware_tag();//初始化更新固件的标签
    update_soft_userdata_path("#soft_config_userdata_path");//修改数据目录
}
//更新用户数据目录的数据
function update_soft_userdata_path(tag){
  const afs = require("fs");
  let config_path = user_init_load_config().execute_path+"\\soft_config";
  if(afs.existsSync(config_path)){
      $(tag).val(JSON.parse(afs.readFileSync(config_path)).userData);
      // return JSON.parse(crypto_aes_decryption("12:34:56:78:9a:bc",cs_fs.readFileSync(path,encoding)));
  }
  $(tag).on('click', function () {
    const {dialog,app} = require('electron').remote;
    let newpath = dialog.showOpenDialogSync({properties: ['openDirectory'],defaultPath:$(tag).val()});
    if(newpath !== undefined){
      newpath += "\\userData";//添加
      $(tag).val(newpath);
      layer.confirm(`新路径${newpath},需要重启生效,是否需要重启！`, {
        btn: ['重启软件','取消设置'], //按钮
        btn1:function (index) {
          const afs = require("fs");
          let conf = {userData:newpath,machine_id:user_init_load_config().machine_id};
          console.log(conf);
          afs.writeFileSync(user_init_load_config().execute_path+"\\soft_config",JSON.stringify(conf));//写入配置信息
          // user_cs_file_update(user_init_load_config().execute_path+"\\soft_config",{userData:newpath});
          layer.close(index);
          app.relaunch();
          app.exit(0);
        },
        btn2:function (index) {
            layer.close(index);
        },cancel:function () {
            return false;
        }
      })
    }
  })
}
//载入配置
function load_config_infor() {
    let config_storage = user_init_load_config();//载入
    if(config_storage.soft_config_status === true){
        $("#soft_config_theme").val(config_storage.soft_config_theme);//主题风格
        $("#soft_config_device_port").val(config_storage.soft_config_device_port);//设备端口
        $("#soft_config_server_url").val(config_storage.soft_config_server_url);//服务器地址
        $("#soft_config_server_sync").val(config_storage.soft_config_server_sync);//是否开启同步
        $("#soft_config_status_sync_time").val(config_storage.soft_config_status_sync_time);//状态同步时间
        $("#soft_config_reconnect_time").val(config_storage.soft_config_reconnect_time);//重连次数
        $("#soft_config_connect_count").val(config_storage.soft_config_connect_count);//重连次数
        $("#soft_config_userdata_path").val(user_init_load_config().roaming_path);//数据目录
        $("#soft_config_storage").val(config_storage.soft_config_storage);//音乐方案的存储介质
        $("#soft_config_soft_password").val(config_storage.soft_config_soft_password);//修改密码
        device_list_array = JSON.parse(config_storage.device_list_array);//加载已经存在列表
    }else{
        save_config_infor();//初始化值
    }

    set_soft_theme(parseInt(get_config_infor("soft_config_theme")));
    update_firmware_html = $("#soft_config_update_area").html();
}

//清除配置
function restart_config_infor() {
    user_set_default_set({soft_config_status:false});
}
//获取一个数据值
function get_config_infor(key) {
    return user_init_load_config()[key];
}
//设置一个数据值
function set_config_infor(key,value) {
    let data={};
    data[key]=value;
    user_set_default_set(data);
}

function init_update_firmware_tag(){
    update_firmware_file = null;//设置为空
    $("#soft_config_update_area").html(update_firmware_html);//重新初始化值
    $("#soft_config_update_firmware").change((event)=>{
        if(check_select_host_addr() === false){
            system_prompt_display("设备未选中，不能进行固件更新。");
        }else{
            update_firmware_file = document.getElementById("soft_config_update_firmware").files[0];
            $("#soft_config_update_firmware_name").text(update_firmware_file.name);
        }
    });
    $("#soft_config_update_firmware_name").text("选择固件");
}
//保持预设
function save_config_infor() {
    if(update_firmware_file !== null){
        post_upload_firmware(update_firmware_file.name,update_firmware_file);//上传固件
        init_update_firmware_tag();
    }else{
        user_set_default_set({
            soft_config_status     :true,
            soft_config_theme       : $("#soft_config_theme").val(),//
            soft_config_device_port : $("#soft_config_device_port").val(),//
            soft_config_server_url : $("#soft_config_server_url").val(),//
            soft_config_server_sync : $("#soft_config_server_sync").val(),//
            soft_config_status_sync_time : $("#soft_config_status_sync_time").val(),//
            soft_config_reconnect_time : $("#soft_config_reconnect_time").val(),//
            soft_config_connect_count : $("#soft_config_connect_count").val(),//
            soft_config_storage : $("#soft_config_storage").val(),//读取存储设备的值
            soft_config_soft_password : $("#soft_config_soft_password").val(),//读取密码值
        });
        if(get_config_infor("soft_config_storage")!== get_select_host_status().data.system.d_storage){
            get_select_storage_media(get_config_infor("soft_config_storage"));//设置存储设备
        }
    }
}
//设置软件主题色
function set_soft_theme(config) {
    if(config === 0){
        $("#logo").find("img").attr("src","./image/u4.png");//修改LOGO
        $("body").css({background:"#292929",color:"#bebebe"});//修改背景颜色和主题色
        $("ul,li,p,a").css("color","#bebebe");//修改列表的颜色
        $("section > div p > span").css("color","#ffffff");
        $("#treatmentList>ul>li,#customList>ul>li").css("color","#606266");

        $(".headerR2 span").css("color","#797979");
    }else{
        $("#logo").find("img").attr("src","./image/logo2.jpg");//修改LOGO
        $("body").css({background:"#d3d3d3",color:"#303133"});//修改背景颜色和主题色
        $("ul,li,p,a").css("color","#303133");//修改列表的颜色
        $("section > div p > span").css("color","#303133");
        $("#treatmentList>ul>li,#customList>ul>li").css("color","#606266");
        $("#treatmentList>ul>li>ul>li,#customList>ul>li>ul>li").css("color","#C0C4CC");

        $(".headerR2 span").css("color","#797979");
    }
}
//跳转页面
function page_goto_function_index(index){
    if(select_host_page_id === index){return;}
    switch (index){
        case 0://主页面
            if(check_select_host_addr() === false){break;}//校验是否选中设备
            $("#mainPage").show();
            $("#music_play_area").show();
            $("#list_infor_area").hide();
            $("#list_create_area").hide();
            $("#list_play_energy_area").show();
            $("#settingPage").hide();
            $("#jump_main_view").children().css("color", "#bebebe");
            $("#jump_create_view").children().css("color", "#797979");
            $("#jump_setting_view").children().css("color", "#797979");
            select_host_page_id = index;
            break;
        case 1://预览页面
            if(check_select_host_addr() === false){break;}//校验是否选中设备
            $("#mainPage").show();
            $("#music_play_area").hide();
            $("#list_infor_area").show();
            $("#list_create_area").show();
            $("#list_play_energy_area").hide();
            $("#settingPage").hide();
            $("#jump_main_view").children().css("color", "#797979");
            $("#jump_create_view").children().css("color", "#bebebe");
            $("#jump_setting_view").children().css("color", "#797979");
            select_host_page_id = index;
            break;
        case 2://设置页面
            //debug start
            // $("#mainPage").hide();
            // $("#settingPage").show();
            //
            // $("#jump_main_view").children().css("color", "#797979");
            // $("#jump_create_view").children().css("color", "#797979");
            // $("#jump_setting_view").children().css("color", "#bebebe");
            //
            // $("#soft_config_storage").val(get_select_host_status().data.system.d_storage);//音乐方案的存储介质//载入软件的存储介质
            //debug end

            layer.prompt({formType: 1,value:"",title: "请输入密码"}, function (value, index) {
                layer.close(index);
                if((value === get_config_infor("soft_config_soft_password")) || (get_config_infor("soft_config_soft_password") === null)){
                    $("#mainPage").hide();
                    $("#settingPage").show();

                    $("#jump_main_view").children().css("color", "#797979");
                    $("#jump_create_view").children().css("color", "#797979");
                    $("#jump_setting_view").children().css("color", "#bebebe");

                    $("#soft_config_storage").val(get_select_host_status().data.system.d_storage);//音乐方案的存储介质//载入软件的存储介质
                    select_host_page_id = index;
                }else{
                    system_prompt_display("密码错误！");
                }
            });

            break;
        default:
            break;
    }
}
