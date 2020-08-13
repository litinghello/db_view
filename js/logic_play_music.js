/**
 * Created by xh on 2018-01-30.
 */

//初始化播放区域功能按键
function init_music_play_tag_event(){
    $("#music_play_play").click(function () {
        if(get_select_host_status().data.app_status.playing === true){
            //get_upload_device_status(select_host_list_class,select_host_list_name,"pause");//进行暂停
            //get_play_music_commands("pause");
            get_play_music_commands("pausing_keep_force key_down_event 112");//p
        }else{
            if(select_host_list_class === "" || select_host_list_name === ""){
                layer.alert("请选择治疗方案！");
                return ;
            }
            //get_upload_device_status(select_host_list_class,select_host_list_name,"play");
            /*let sine_time = select_host_list_name.match(/\((.*?)\)/);//匹配到指定数据
            if(sine_time) {
                get_play_music_file(select_host_list_class,select_host_list_name,parseInt(sine_time[1]));//进行播放
            }else{
                get_play_music_file(select_host_list_class,select_host_list_name,-1);//进行播放
            }*/
            get_play_music_file(select_host_list_class,select_host_list_name,-1);//进行播放
        }
    });
    $("#music_play_prev").click(function () {
        if(get_select_host_status().data.app_status.playing === true){
            get_play_music_commands("seek -120");
        }
    });
    $("#music_play_next").click(function () {
        if(get_select_host_status().data.app_status.playing === true){
            get_play_music_commands("seek +120");
        }
    });

    $("#music_play_stop").click(function () {
        if(get_select_host_status().data.app_status.playing === true){
            get_play_music_commands("pausing_keep_force key_down_event 113");//q
        }
    });
    //点击链接网络摄像头
    $("#device_camera_open").click(function () {
        let video_url = "http://" + select_host_addr + ":8080/?action=stream";
        get_streamer_control(true);//开启摄像机
        $("#device_camera_div").html(`<img id=\"device_camera_video\" src=\"${video_url}" style="width:100%;height:100%;top:0%;" alt=\"\"/>`);//设置源地址
    });

    $("#music_play_set_volume").click(function(){
      let slider_volume_val = get_select_host_status().data.system.d_volume;
      layui.use('slider', function(){
        var slider = layui.slider;
        slider.render({elem: '#device_set_volume_ch1',min: 0,max: 100,input: true ,value:slider_volume_val[0],change: function(value){slider_volume_val[0] = value;}});
        slider.render({elem: '#device_set_volume_ch2',min: 0,max: 100,input: true ,value:slider_volume_val[1],change: function(value){slider_volume_val[1] = value;}});
        slider.render({elem: '#device_set_volume_ch3',min: 0,max: 100,input: true ,value:slider_volume_val[2],change: function(value){slider_volume_val[2] = value;}});
        slider.render({elem: '#device_set_volume_ch4',min: 0,max: 100,input: true ,value:slider_volume_val[3],change: function(value){slider_volume_val[3] = value;}});
        slider.render({elem: '#device_set_volume_ch5',min: 0,max: 100,input: true ,value:slider_volume_val[4],change: function(value){slider_volume_val[4] = value;}});
        slider.render({elem: '#device_set_volume_ch6',min: 0,max: 100,input: true ,value:slider_volume_val[5],change: function(value){slider_volume_val[5] = value;}});
        slider.render({elem: '#device_set_volume_ch7',min: 0,max: 100,input: true ,value:slider_volume_val[6],change: function(value){slider_volume_val[6] = value;}});
        slider.render({elem: '#device_set_volume_ch8',min: 0,max: 100,input: true ,value:slider_volume_val[7],change: function(value){slider_volume_val[7] = value;}});
      });
        let display_area;
        if(device_is_phone()) {
            display_area=["90%","85%"];
        }else{
            display_area=["50%","60%"];
        }
        layer.open({
            title: "音量控制",
            type: 1,
            closeBtn: false,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                get_upload_device_volume(slider_volume_val[0],slider_volume_val[1],slider_volume_val[2],slider_volume_val[3],slider_volume_val[4],slider_volume_val[5],slider_volume_val[6],slider_volume_val[7]);
                layer.close(index);
            }, btn2: function (index, layero) {
                //按钮【按钮2】的回调
            },
            area: display_area,
            shift: 2,
            shadeClose: true,
            content: $("#device_set_volume_area")
        });
    });

    $("#music_play_area").mouseenter(function () {
        $("#showCtlBtnBox").show(200);
    }).mouseleave(function () {
        $("#showCtlBtnBox").hide(200);
    });
}

//音乐操作成功事件
function music_play_control_success(list_class,list_name,command) {
    //这里需要保存list_class,list_name,command
    //console.log(list_class,list_name,command,window.localStorage.number);
    if(user_init_load_config().control_user === 0){ // 未载入用户  退出
        return false;
    }else{
        user_database_write_music_infor({
            "music_type": list_class,//播放音乐类别
            "music_title": list_name,//播放音乐标题
            "music_value": command,//播放音乐标题 操作状态
            "music_result": ""
        },function () {

        });
    }

}
