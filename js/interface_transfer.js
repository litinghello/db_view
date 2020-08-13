/**
 * Created by xh on 2018-01-30.
 */
function check_select_host_addr() {
    if(select_host_addr === null){
        system_prompt_display("请先选择设备才能进行，其他功能操作！");
        return false;
    }else{
        return true;
    }
}
//上传修改设备名称
function get_device_rename(rename) {
    let links = "http://"+select_host_addr+":"+select_host_port+"/device_rename?device_name=" + rename;
    $.ajax({
        url: links,
        success: function (result) {
            //console.log("=>"+links);
            if(result.status === 0) {
                system_prompt_display("新名称["+rename+"]修改成功。");
            }else{
                system_prompt_display("新名称["+rename+"]修改失败，请设置4至20文字之间！");
            }
        }
    })
}
//开关摄像头
function get_streamer_control(enable) {
    let links = "http://"+select_host_addr+":"+select_host_port+"/streamer_control?streamer_enable=" + enable;
    $.ajax({
        url: links,
        success: function (result) {
            //console.log("=>"+links);
            if(result.status === 0) {
                //console.log("get_streamer_control ok");
                //system_prompt_display("摄像头开启成功");
            }else{
                //system_prompt_display("摄像头开启失败");
            }
        }
    })
}
//控制播放
// xxx/play_music_file?music_class=class1/subclass1&music_name=test.ogg&play_loop=-1
function get_play_music_file(music_class,music_name,play_loop) {
    let links = "http://"+select_host_addr+":"+select_host_port+"/play_music_file?music_class=" + music_class + "&music_name=" + music_name.replace(/\+/g, "%2B").replace(/\&/g, "%26") + "&play_loop=" + play_loop;
    //let links = "http://"+select_host_addr+":"+select_host_port+"/play_music_file?music_class=" + music_class + "&music_name=" + music_name.replace(/\+/g, "%2B").replace(/\&/g, "%26") + "&play_loop=" + play_loop;
    //console.log(links);
    $.ajax({
        url: links,
        success: function (result) {
            //console.log("=>"+links);
            if(result.status === 0) {
                music_play_control_success(music_class,music_name,"启动治疗");
            }else if (result.status === 1){
                system_prompt_display("播放文件名称有错。");
            }else if(result.status === 2){
                system_prompt_display("播放文件不存在或者文件错误。");
            }else if(result.status === 3){
                //播放次数为零
                if(device_is_phone()) {
                    system_prompt_display("请使用PC版软件进行授权激活使用。");
                }else{
					get_get_device_lock();//下载设备码
                }
            }else{
            }
        }
    })
}
//控制播放
// xxx/play_music_commands?play_commands=string
function get_play_music_commands(play_commands) {
    //let old_status = get_select_host_status().data.app_status.play_status.ANS_pause;
    let links = "http://"+select_host_addr+":"+select_host_port+"/play_music_commands?play_commands=" + play_commands;
    $.ajax({
        url: links,
        success: function (result) {
            //console.log("=>"+links);
            if(result.status === 0) {
                /*if(play_commands === "pausing_keep_force key_down_event 112"){
                    if(old_status === "yes"){
                        music_play_control_success(select_host_list_class,select_host_list_name,"继续播放");
                    }else{
                        music_play_control_success(select_host_list_class,select_host_list_name,"暂停播放");
                    }
                }
                if(play_commands === "pausing_keep_force key_down_event 113"){
                    music_play_control_success(select_host_list_class,select_host_list_name,"停止播放");
                }
                if(play_commands === "seek -120"){
                    music_play_control_success(select_host_list_class,select_host_list_name,"播放退后两分钟");
                }
                if(play_commands === "seek +120"){
                    music_play_control_success(select_host_list_class,select_host_list_name,"播放前进两分钟");
                }*/
            }else if (result.status === 1){
                system_prompt_display("命令格式错误！");
            }else if(result.status === 2){
                system_prompt_display("操作错误，指令错误！");
            }else{

            }
        }
    })
}
//获取设备码
//get_device_lock
function get_get_device_lock() {
    let links = "http://"+select_host_addr+":"+select_host_port+"/get_device_lock";
    $.ajax({
        url: links,
        success: function (result) {
            if(result.status === 0) {
                let device_infor_copy = $("#input_device_infor_copy");
                let json_object={
                    s_mac:get_select_host_status().data.system.s_mac,
                    s_rcode:get_select_host_status().data.system.s_rcode
                };
                device_infor_copy.val(result.data);
                device_infor_copy.show().select();
                try{
                    document.execCommand('copy', true);
                    layer.alert('设备码已经复制，请直接通过粘贴文本方式发送至厂家，以获取激活码。若已经复制激活码点击确认按键，进行下一步操作。', {icon: 7},function(index){
                        layer.close(index);
                        device_infor_copy.show().select();//选中
                        document.execCommand('paste', true);//粘贴
                        device_infor_copy.hide();
                        layer.alert(device_infor_copy.val(),function(index){
                            layer.close(index);
                            get_update_play_count(device_infor_copy.val());//激活设备
                        });
                    });
                }catch (err){
                    system_prompt_display("复制失败！");
                }
                device_infor_copy.val("");
                device_infor_copy.hide();
            }else{
            }
        }
    })
}
//更新播放次数
// xxx/update_play_count?play_key=string
function get_update_play_count(string) {
    let links = "http://"+select_host_addr+":"+select_host_port+"/update_play_count?play_key=" + string;
    $.ajax({
        url: links,
        success: function (result) {
            if(result.status === 0) {
                system_prompt_display("更新次数成功，请再次启动播放。");
            }else if(result.status === 1){
                system_prompt_display("无效KEY");
            }else if(result.status === 2){
                system_prompt_display("错误KEY");
            }else{
            }
        }
    })
}
//修改密码
// xxx/change_device_password?password=password&new_password=password
function get_change_device_password(password,new_password) {
    let links = "http://"+select_host_addr+":"+select_host_port+"/change_device_password?password="+password+"&new_password="+new_password;
    //console.log(links);
    $.ajax({
        url: links,
        success: function (result) {
            if(result.status === 0) {
                system_prompt_display("设置密码成功！");
            }else if(result.status === 1){
                system_prompt_display("密码格式错误！");
            }else if(result.status === 2){
                system_prompt_display("原密码错误！");
            }else{
            }
        }
    })
}
//获取音乐信息
// xxx/get_music_infor?music_class=class1/subclass1&music_name=test.ogg
function get_get_music_infor(music_class,music_name) {
    let links = "http://"+select_host_addr+":"+select_host_port+"/get_music_infor?music_class=" + music_class+"&music_name=" + music_name.replace(/\+/g, "%2B").replace(/\&/g, "%26");
    $.ajax({
        url: links,
        success: function (result) {
            //console.log("=>"+links);
            if(result.status === 0) {
                //console.log(result.data);
                add_list_content_to_array(result.data);
                update_list_content_display(0);
            }
        }
    })
}
//删除音乐文件
// xxx/delete_music_file?music_class=class6/subclass1&music_name=test.ogg
function get_delete_music_file(music_class,music_name) {
    let links = "http://"+select_host_addr+":"+select_host_port+"/delete_music_file?music_class=" + music_class+"&music_name=" + music_name.replace(/\+/g, "%2B").replace(/\&/g, "%26");
    $.ajax({
        url: links,
        success: function (result) {
            //console.log("=>"+links);
            if(result.status === 0) {
                system_prompt_display("删除["+music_name+"]成功");
                sync_list_content_display(music_class);
            }
        }
    })
}
//更新设备信息
function get_update_device_status() {
    let links = "http://"+select_host_addr+":"+select_host_port+"/update_device_status";
    $.ajax({
        url: links,
        success: function (result) {
            //console.log("=>"+links);
            if(result.status === 0) {
                //console.log("upload ok");
            }
        }
    })
}

let device_host_reconnect_count = 0;
//下载是设备信息状态接口
function get_download_device_status() {
    let links = "http://"+select_host_addr+":"+select_host_port+"/download_device_status";
    if(select_host_addr === null){
        return ;
    }
    $.ajax({
        timeout:1000,
        url: links,
        complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            if(status === "success"){//超时,status还有success,error等值的情况
                let result = XMLHttpRequest.responseJSON;
                if(result.status === 0) {
                    device_host_reconnect_count = 0;
                    select_host_status = result;//设置设备信息
                    update_view_display(result);//更新页面
                    if(select_host_class_sync === false){
                        select_host_class_sync = true;
                        if(get_select_host_status().data.app_status.music_class !== ""){
                            select_host_list_class = get_select_host_status().data.app_status.music_class;
                            sync_list_content_display(select_host_list_class);//同步一下列表
                        }
                    }
                }
            }else if(status === "error" || status === "timeout"){
                //console.log(device_host_reconnect_count);
                //console.log(get_config_infor("soft_config_reconnect_time"));
                if(device_host_reconnect_count++ >= get_config_infor("soft_config_reconnect_time")){
                    device_host_reconnect_count = get_config_infor("soft_config_reconnect_time");
                    select_host_addr = null;
                    system_prompt_display("设备连接失败，请检查连接后，再次选择设备！");
                }
            }
        }
    })
}

//重启
function get_device_reboot() {
    let links = "http://"+select_host_addr+":"+select_host_port+"/device_reboot";
    $.ajax({
        url: links,
        success: function (result) {
            //console.log("=>"+links);
            if(result.status === 0) {
                //console.log("ok");
                system_prompt_display("重启成功");
            }else{
                system_prompt_display("重启失败");
            }
        }
    })
}
//关机
function get_device_poweroff() {
    let links = "http://"+select_host_addr+":"+select_host_port+"/device_poweroff";
    $.ajax({
        url: links,
        success: function (result) {
            //console.log("=>"+links);
            if(result.status === 0) {
                //console.log("ok");
                system_prompt_display("关机成功");
            }else{
                system_prompt_display("关机失败");
            }
        }
    })
}
//修改存储介质
///select_storage_media?storage_media=sd_disk
function get_select_storage_media(storage_media) {
    let links = "http://"+select_host_addr+":"+select_host_port+"/select_storage_media?storage_media="+storage_media;
    $.ajax({
        url: links,
        success: function (result) {
            //console.log("=>"+links);
            if(result.status === 0) {
                //console.log("ok");
                system_prompt_display("存储设备切换成功。");
            }else{
                //console.log(result.data);
                system_prompt_display("存储设备切换失败，请检查存储器是否安装正确。");
            }
        }
    })
}
//修改设备音量
///upload_device_volume?ch1=90&ch2=90&ch3=90&ch4=90&ch5=90&ch6=90&ch7=90&ch8=90
function get_upload_device_volume(ch1,ch2,ch3,ch4,ch5,ch6,ch7,ch8) {
    let links = "http://"+select_host_addr+":"+select_host_port+"/upload_device_volume?ch1="+ch1+"&ch2="+ch2+"&ch3="+ch3+"&ch4="+ch4+"&ch5="+ch5+"&ch6="+ch6+"&ch7="+ch7+"&ch8="+ch8;
    // console.log(links);
    $.ajax({
        url: links,
        success: function (result) {
            //console.log("=>"+links);
            if(result.status === 0) {
                //console.log("ok");
            }else{

            }
        }
    })
}
//上传频率文件
function get_upload_energy_file(music_class,music_name,music_time,music_energy) {
    let links = "http://"+select_host_addr+":"+select_host_port+"/upload_energy_file?music_class=" + music_class + "&music_name="+music_name.replace(/\+/g, "%2B").replace(/\&/g, "%26")+"&music_time="+music_time+"&music_energy="+music_energy;
    $.ajax({
        url: links,
        success: function (result) {
            //console.log("=>"+links);
            if(result.status === 0) {
                system_prompt_display("上传["+music_name+"]完成");
                sync_list_content_display(music_class);//同步一下列表
            }else{
                system_prompt_display("上传["+music_name+"]错误");
            }
        }
    })
}

//直接上传文件至设备
function upload_music_to_server(music_class,file_path,music_name){
    let links = "http://"+select_host_addr+":"+select_host_port+"/upload_music_file?music_class=" + music_class + "&music_name="+music_name.replace(/\+/g, "%2B").replace(/\&/g, "%26");
    system_message_display("上传中...");
    upload_file_to_server(links,file_path,music_name,function(){
        sync_list_content_display(music_class);//同步一下列表
        clear_list_create_file_music_infor();//清除文件信息
    });
}

//上传音乐文件至服务器
function post_upload_music_file(music_class,music_name,music_object) {
    let links = "http://"+select_host_addr+":"+select_host_port+"/upload_music_file?music_class="+music_class+"&music_name=" + music_name.replace(/\+/g, "%2B").replace(/\&/g, "%26");
    let fd = new FormData();
    system_message_display("上传");
    fd.append("music_file", music_object);
    let xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (evt)=>{
        if (evt.lengthComputable) {
            let percentComplete = Math.round(evt.loaded * 100 / evt.total);
            //console.log(percentComplete);
            $("#upload_music_process").html("上传"+percentComplete+"%");
            system_message_update("进度:"+percentComplete+"%");
        }
        else {
            //console.log("---");
        }
    }, false);
    xhr.addEventListener("load", (evt)=>{
        system_message_close();
        try{
            let result = JSON.parse(evt.target.response);
            if(result.status === 0){
                //console.log("上传完成");
                system_prompt_display("上传["+music_name+"]完成");
                sync_list_content_display(music_class);//同步一下列表
                clear_list_create_file_music_infor();//清除文件信息
            }else if(result.status === 4){
                system_prompt_display("文件["+music_name+"]已存在");
            }else{
                system_prompt_display("上传["+music_name+"]错误");
            }
        }catch(err){
            //alert("上传错误");
            system_prompt_display("上传["+file_name+"]音乐文件错误，请检查是否选中设备。");
        }
    }, false);
    xhr.addEventListener("error", (evt)=>{layer.close(upload_process);system_prompt_display("上传音乐文件时出错。");}, false);
    xhr.addEventListener("abort", (evt)=>{layer.close(upload_process);system_prompt_display("上传音乐文件已被用户取消或网络断开连接。");}, false);
    xhr.open("POST",links);
    xhr.send(fd);
}

//上传更新固件
function post_upload_firmware(firmware_name,firmware_object) {
    let links = "http://"+select_host_addr+":"+select_host_port+"/upload_firmware?firmware_name="+firmware_name;
    if(firmware_name !== "firmware.img"){
        system_prompt_display("请上传firmware.img文件");
        return false;
    }
    let fd = new FormData();
    fd.append("firmware_file", firmware_object);
    let xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (evt)=>{
        if (evt.lengthComputable) {
            let percentComplete = Math.round(evt.loaded * 100 / evt.total);
            //console.log(percentComplete);
        }else {
            //console.log("---");
        }
    }, false);
    xhr.addEventListener("load", (evt)=>{
        try{
            let result = JSON.parse(evt.target.response);
            if(result.status === 0){
                system_prompt_display("上传固件完成，设备会自动重启。");
            }else if(result.status === 3){
                system_prompt_display("请先切换至内部存储器在进行升级固件。");
            }else{
                system_prompt_display("系统错误");
            }
        }catch(err){
            system_prompt_display("上传固件错误，请检查是否选中设备。");
        }
    }, false);
    xhr.addEventListener("error", (evt)=>{system_prompt_display("尝试上传固件时出错。");}, false);
    xhr.addEventListener("abort", (evt)=>{system_prompt_display("上传固件已被用户取消或网络断开连接。");}, false);
    xhr.open("POST",links);
    xhr.send(fd);
}
//下载信息列表
function get_download_music_class(music_class) {
    let links = "http://"+select_host_addr+":"+select_host_port+"/download_music_class?music_class=" + music_class;
    $.ajax({
        url: links,
        success: function (result) {
            //console.log("=>"+links);
            if(result.status === 0){
                select_host_list_infor = result.data;
                update_class_list_display(0);//显示列表
            }
        }
    })
}
//获取信息数据 这里需要进行错误确认
function get_select_host_status() {
    if(select_host_status.status === undefined){
        return {"status":0,
            "data":
                {
                    "system":
                        {
                            "s_os":"",
                            "s_cpu":"",
                            "s_ram":"",
                            "s_load":[0,0,0],
                            "s_mac":"",
                            "s_rcode":"",//随机码
                            "s_error":0,
                            "d_name":"default",
                            "d_volume":[0,0,0,0,0,0,0,0],
                            "d_storage":"self_disk",
                            "d_disk_space":"0",
                            "p_count_down":"0",
                            "version":"2.1"},
                    "app_status":
                        {
                            "music_name":"",
                            "music_class":"",
                            "music_db":[0,0,0,0,0,0,0,0],
                            "play_status":{
                                "ANS_pause":"yes",
                                "ANS_path":"",
                                "ANS_filename":"",
                                "ANS_length":0,
                                "ANS_percent_pos":0,
                                "ANS_time_pos":0
                            },
                            "playing":false}
                }
        }
    }else{
        return select_host_status;
    }
}
