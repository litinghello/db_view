/**
 * Created by sam on 2017/12/6.
 */

(function () {
    document.addEventListener("DOMContentLoaded", function () {
        let display = document.documentElement;
        let window_width = display.clientWidth;
        // display.style.fontSize = window_width / 19.2 + "px";
        // display.style.fontSize = window_width / 308 + "rem";
        display.style.fontSize = window_width / 319 + "rem";
    });
})();
/*
 *全局变量
 */
let select_host_addr = null;//当前选中的设备地址
let select_host_port = 8000;//设备端口
let select_host_list_class = "";//选中的列表的分类
let select_host_list_name = "";//选中的列表名字
let select_host_music_infor = {};//选中的音乐文件信息
let select_host_list_infor = [];//选中列表的方案
let select_host_status = {};//当前主机状态信息
let select_host_page_id = 100;//选择的页面
let select_host_class_sync = false;//当选择成功设备进行class页面显示同步

//初始化入口
$(document).ready(function () {
    init_component_display();//初始化模块功能
    refresh_device_status();//刷新设备状态
    sync_device_status();//同步设备状态数据
    user_api_init_app();//初始化配置
    /*
    add_device_list_to_array("192.168.0.27","局域网",true);//添加设备
    add_device_list_to_array("47.95.119.159","云服务器",true);//添加设备
    //add_device_list_to_array("3","3",true);//添加设备
    //add_device_list_to_array("4","4",true);//添加设备
    //delete_device_list_of_array(0);
    //update_device_list_display();
    */
});
//界面初始化
function init_component_display() {
    init_soft_config();//初始化软件配置
    init_class_list_display();//初始化列表显示
    init_scan_management_device();//初始化设备扫描相关
    init_device_list_display();
    init_list_content_display();//初始化详细音乐显示
    init_music_play_tag_event();//初始化音乐播放事件
    init_list_create_display();

    //点击头部tab切换页面
    $("#jump_main_view").click(function () {
        page_goto_function_index(0);
    });
    $("#jump_create_view").click(() => {
        page_goto_function_index(1);
    });
    $("#jump_setting_view").click(function () {
        page_goto_function_index(2);
    });
}
//刷新设备状态
function refresh_device_status() {
    let select_device_index = 0;
    let select_current_device={};
    let monitor_timer = setInterval(function(){
        select_current_device = get_device_list_of_array(select_device_index++);//获取已存在的设备列表
        if(select_current_device !== null){//列表不是空进行列表请求
            refresh_device_list_display(select_current_device.ip);//更新ip的状态
        }else{
            select_device_index = 0;
        }
        update_device_list_display();//更新显示
    },parseInt(get_config_infor("soft_config_status_sync_time")) * 1000);
}
//同步设备状态数据
function sync_device_status() {
    let sync_timer = setInterval(function(){
        get_download_device_status();//获取当前设备状态
        //console.log("sync_device_status..");
    },1000);
}
let device_storage_type = {
    "usb_disk":"U盘",
    "mh_disk":"移动硬盘",
    "sd_disk":"microSD卡",
    "self_disk":"内部存储器"
};

//更新页面所有状态显示
function update_view_display(result) {
    if(result.status === 0){
        $("#device_system_type").text(result.data.system.s_os);//操作系统
        $("#device_cpu_type").text(result.data.system.s_cpu);//操作系统cpu
        $("#device_cpu_load").text(result.data.system.s_load);//cpu负荷
        $("#device_free_ram").text(result.data.system.s_ram+"%");//总内存
        $("#device_free_disk").text(result.data.system.d_disk_space+"%");//磁盘可用内存
        $("#device_storage_type").text(device_storage_type[result.data.system.d_storage]);//存储方式
        $("#device_last_connect_time").text((new Date()).toLocaleTimeString());//设备最后通信时间
        $("#device_infor_d_name").text(result.data.system.d_name);//设备名称
        $("#device_infor_d_type").text(result.data.system.s_os);//设备型号
        if(result.data.system.p_count_down === -1){
            $("#device_play_count").text("永久激活");//播放次数
        }else if(result.data.system.p_count_down === 0){
            $("#device_play_count").text("待激活");//播放次数
        }else if(result.data.system.p_count_down > 0){
            $("#device_play_count").text(result.data.system.p_count_down);//播放次数
        }else{
            $("#device_play_count").text("数据错误");//播放次数
        }

        $("#device_version").text("v"+result.data.system.version);//
        $("#device_infor_d_error").text(result.data.system.s_error);//
        $("#device_play_addr").text(select_host_addr+":"+select_host_port);//设备地址
        $("#device_play_mac").text(result.data.system.s_mac);//mac地址
        if(result.data.app_status.music_name.indexOf(".")){
            result.data.app_status.music_name = result.data.app_status.music_name.split(".")[0];
        }
        if (result.data.app_status.playing) {
            $("#device_infor_d_run").text("正在运行");
            $("#device_play_progress_list_class").text(result.data.app_status.music_name);//当前列表
            $("#device_play_progress").css('width', result.data.app_status.play_status["ANS_percent_pos"]+"%");//控制进度条
            $("#device_play_total_time").text(secondToDate(result.data.app_status.play_status["ANS_length"]));
            $("#device_play_progress_time").text(secondToDate(result.data.app_status.play_status["ANS_time_pos"]));
            if (result.data.app_status.play_status["ANS_pause"] === "no") {
                $("#device_infor_d_status").text("正在播放 " + result.data.app_status.music_name);
                $("#device_infor_d_status").attr("title",result.data.app_status.music_name);
                $("#music_play_play").html("&#xe651;");
                $("#music_play_stop").show();
                set_energy_diagram(true);
            } else if (result.data.app_status.play_status["ANS_pause"] === "yes") {
                $("#device_infor_d_status").text("暂停播放 " + result.data.app_status.music_name);
                $("#device_infor_d_status").attr("title",result.data.app_status.music_name);
                $("#music_play_play").html("&#xe652;");
                $("#music_play_stop").show();
                set_energy_diagram(false);
            }else{
            }
        } else {
            $("#device_play_progress_list_class").text("");//当前列表
            $("#device_infor_d_run").text("没有运行");
            $("#device_infor_d_status").text("停止播放 " + result.data.app_status.music_name);
            $("#device_infor_d_status").attr("title",result.data.app_status.music_name);
            $("#music_play_play").html("&#xe652;");
            $("#music_play_stop").hide();
            $("#device_play_progress").css('width', "0%");//控制进度条
            $("#device_play_total_time").text(secondToDate(0));
            $("#device_play_progress_time").text(secondToDate(0));
            set_energy_diagram(false);
        }
        //频率同步至右侧文本
        $("#list_play_energy0").text(result.data.app_status.music_db[0]);
        $("#list_play_energy1").text(result.data.app_status.music_db[1]);
        $("#list_play_energy2").text(result.data.app_status.music_db[2]);
        $("#list_play_energy3").text(result.data.app_status.music_db[3]);
        $("#list_play_energy4").text(result.data.app_status.music_db[4]);
        $("#list_play_energy5").text(result.data.app_status.music_db[5]);
        $("#list_play_energy6").text(result.data.app_status.music_db[6]);
        $("#list_play_energy7").text(result.data.app_status.music_db[7]);
    }else{
        //数据错误
    }
}

function set_energy_diagram(vaule) {
    if(vaule === true){
        $("#list_play_image_energy0").addClass("image_blink_speed1").css("visibility","visible");
        $("#list_play_image_energy1").addClass("image_blink_speed1").css("visibility","visible");
        $("#list_play_image_energy2").addClass("image_blink_speed2").css("visibility","visible");
        $("#list_play_image_energy3").addClass("image_blink_speed2").css("visibility","visible");
        $("#list_play_image_energy4").addClass("image_blink_speed3").css("visibility","visible");
        $("#list_play_image_energy5").addClass("image_blink_speed3").css("visibility","visible");
        $("#list_play_image_energy6").addClass("image_blink_speed4").css("visibility","visible");
        $("#list_play_image_energy7").addClass("image_blink_speed4").css("visibility","visible");
    }else{
        $("#list_play_image_energy0").removeClass("image_blink_speed1").css("visibility","hidden");
        $("#list_play_image_energy1").removeClass("image_blink_speed1").css("visibility","hidden");
        $("#list_play_image_energy2").removeClass("image_blink_speed2").css("visibility","hidden");
        $("#list_play_image_energy3").removeClass("image_blink_speed2").css("visibility","hidden");
        $("#list_play_image_energy4").removeClass("image_blink_speed3").css("visibility","hidden");
        $("#list_play_image_energy5").removeClass("image_blink_speed3").css("visibility","hidden");
        $("#list_play_image_energy6").removeClass("image_blink_speed4").css("visibility","hidden");
        $("#list_play_image_energy7").removeClass("image_blink_speed4").css("visibility","hidden");
    }
}

//时间转化
function secondToDate(result) {
    let h = Math.floor(result / 3600);
    let m = Math.floor((result / 60 % 60));
    let s = Math.floor((result % 60));
    return result = h + "时" + m + "分" + s +"秒";
}

let system_message_handle = null;
let system_message_text = null;
let system_device_type = null;

function device_is_phone(){
    if(system_device_type === null){
        system_device_type = layui.device();
    }
    return !!(system_device_type.android || system_device_type.ios);
}
function system_message_display(text){
    system_message_close();
    // if(device_is_phone()) {
    //     layer.open({
    //         content: '<div style="text-align: center;"><p id="system_message_process" style="color:#000"></p></div>',
    //         shadeClose: false,
    //         btn:[],
    //         cancel: function(){
    //             return false; //开启该代码可禁止点击该按钮关闭
    //         }
    //     });
    // }else{
    //     system_message_handle = layer.confirm( '<div style="text-align: center;"><p id="system_message_process" style="color:#000"></p></div>',{
    //         title:'执行',
    //         btn:[],
    //         cancel: function(){
    //             return false; //开启该代码可禁止点击该按钮关闭
    //         }
    //     });
    // }
    let message_content;
    if(device_is_phone()) {
        message_content = '<div style="text-align: center;"><p id="system_message_process" style="color:#000;font-size: 0.8rem;"></p></div>';
    }else{
        message_content = '<div style="text-align: center;"><p id="system_message_process" style="color:#000;"></p></div>';
    }
    system_message_handle = layer.confirm( message_content,{
        title:'执行',
        btn:[],
        cancel: function(){
            return false; //开启该代码可禁止点击该按钮关闭
        }
    });
    system_message_text = text;
    system_message_update("");
}
function system_message_update(text){
    $("#system_message_process").html(system_message_text+text);
}
function system_message_close(){
    if(system_message_handle !== null){
        layer.close(system_message_handle);
        system_message_handle = null;
    }
}
//显示系统消息
function system_prompt_display(text){
    // if(device_is_phone()) {
    //     layer.open({
    //         content: text,
    //         skin: 'msg',
    //         time: 3 //3秒后自动关闭
    //     });
    // }else{
    //     layer.msg(text);
    // }
    layer.msg(text);
}
