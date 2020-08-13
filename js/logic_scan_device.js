/**
 * Created by xh on 2018-01-30.
 */

let device_list_array = [];//放置设备列表信息
let device_list_max_count = 0;

//初始化设备扫描相关按键
function init_scan_management_device() {
    create_device_list_html();//创建设备列表
    //扫描设备
    $("#device_list_scan").click(function(){
        clean_device_list_of_array();//清空列表
        if(device_is_phone()){
            //networkinterface.getCarrierIPAddress( onSuccess, onError );//获取移动网络ip地址
            networkinterface.getWiFiIPAddress( function (ipInformation) {
                scan_device_use_ipaddr(ipInformation.ip);//扫描设备
            }, function(error){
                system_prompt_display("获取本地IP失败，请连接WIFI再试。");
            });
        }else{
            getUserIP(scan_device_use_ipaddr);//windows
        }
    });
    //添加设备列表按钮点击事件
    $("#device_list_add").click(function () {
        layer.prompt({title: "请输入设备地址"}, function (value, index) {
            add_device_list_to_array(value, value, true);//添加设备
            update_device_list_display();
            layer.close(index);
        });
        // if(device_is_phone()) {
        //     layer.open({
        //         title:["请输入设备地址", 'background-color: #eee;color: #797979;'],
        //         content: '<label for="layer_input_value"></label><input id="layer_input_value" type="text" style="border: 0.01rem solid #797979;box-sizing : border-box ;height:28px;width: 80%;"/>'
        //         ,btn: ['确定', '取消']
        //         ,yes: function(index){
        //             let ip_value = $("#layer_input_value").val();
        //             add_device_list_to_array(ip_value, ip_value, true);//添加设备
        //             console.log(device_list_array);
        //             update_device_list_display();
        //             layer.close(index);
        //         }
        //     });
        //     document.getElementById("layer_input_value").focus();
        // }else{
        //     layer.prompt({title: "请输入设备地址"}, function (value, index) {
        //         add_device_list_to_array(value, value, true);//添加设备
        //         update_device_list_display();
        //         layer.close(index);
        //     });
        // }
    });
    //重启关机
    $("#device_power_restart").click(function () {
        layer.confirm('确定要重启？', {
            btn: ['重启', '取消']
        }, function (index) {
            get_device_reboot();
            layer.close(index);
        }, function (index) {
        })
    });
    $("#device_power_shutdown").click(function () {
        layer.confirm('确定要关机？', {
            btn: ['关机', '取消']
        }, function (index) {
            get_device_poweroff();
            layer.close(index);
        }, function (index) {
        })
    });
    //设备详情按钮点击事件
    $("#device_infor_display").click(function () {
        get_update_device_status();//更新一下设备信息
        layer.open({
            title: "设备详情",
            type: 1,
            closeBtn: false,
            btn: ['退出'],
            area: ['70%', '60%'],
            shift: 2,
            shadeClose: true,
            content: $("#device_system_infor_area")
        });
    });
    //显示设备列表按钮
    $(".device_list_area").mouseenter(function(){
        $("#device_list_button_area").show(100)
    }).mouseleave(function(){
        $("#device_list_button_area").hide(100)
    });
    //显示设备操作按钮
    $(".device_infor_status_area").mouseenter(function () {
        $("#device_power_button").show();
        $("#device_user_button").show();
        $("#device_infor_area").show();
    }).mouseleave(function () {
        $("#device_power_button").hide();
        $("#device_user_button").hide();
        $("#device_infor_area").hide();
    });
}
//获取本地ip
/**
 * Get the user IP throught the webkitRTCPeerConnection
 * @param onNewIP {Function} listener function to expose the IP locally
 * @return undefined
 */
function getUserIP(callback) { //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    let myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    let pc = new myPeerConnection({
            iceServers: []
        }),
        noop = function() {},
        localIPs = {},
        ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
        key;
    function iterateIP(ip) {
        if (!localIPs[ip]) {
            callback(ip)
        }
        localIPs[ip] = true;
    }
    //create a bogus data channel
    pc.createDataChannel("");
    // create offer and set local description
    pc.createOffer().then(function(sdp) {
        sdp.sdp.split('\n').forEach(function(line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });
        pc.setLocalDescription(sdp, noop, noop);
    }).catch(function(reason) {
        // An error occurred, so handle the failure to connect
    });
    //listen for candidate events
    pc.onicecandidate = function(ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}

//给定ip进行状态监测
function scan_device_list_display(ip_addr) {
    let links = "http://"+ip_addr+":8000/download_device_status";
    //console.log(ip_addr);
    $.ajax({
        timeout:500,
        url: links,
        complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            if(status === "success"){//超时,status还有success,error等值的情况
                let result = XMLHttpRequest.responseJSON;
                if(result.status === 0) {
                    add_device_list_to_array(ip_addr, result.data.system.d_name, true);
                }else if(status === "error" || status === "timeout"){
                }
            }
        }
    })
}
function onSuccess( ipInformation ) {
    alert( "IP: " + ipInformation.ip + " subnet:" + ipInformation.subnet );
}
function onError( error ) {
    // Note: onError() will be called when an IP address can't be found. eg WiFi is disabled, no SIM card, Airplane mode etc.
    alert( error );
}

//扫描设备
function scan_device_use_ipaddr(host_addr) {
    let scan_count = 0;
    let max_scan_count = 255;
    let ip_array = host_addr.split(".");
    system_message_display("扫描设备");
    let sacan_timer = setInterval(function () {
        let ip_addr = ip_array[0]+"."+ip_array[1]+"."+ip_array[2]+"."+scan_count;
        scan_device_list_display(ip_addr);
        if(++scan_count >= max_scan_count){
            system_message_close();
            system_prompt_display("扫描完成，扫描到"+device_list_array.length+"个设备。");
            clearInterval(sacan_timer);
        }else {
            $("#progress").text("扫描进度:"+Math.floor(scan_count*100/max_scan_count)+"%");
            system_message_update("进度:"+Math.floor(scan_count*100/max_scan_count)+"%");
        }
    },100);
}
//添加一个设备到数组
function add_device_list_to_array(ip_addr,d_name,status) {
    if(!isValidIP(ip_addr)){
        system_prompt_display("地址格式有误！");
        return false;
    }
    if(device_list_array.length < device_list_max_count){
        for(let index in device_list_array){
            if(ip_addr === device_list_array[index].ip){
                device_list_array[index].name = d_name;
                device_list_array[index].status = status;
                return true;
            }
        }
        device_list_array.push({ip:ip_addr,name:d_name,status:status,user_number:null});
        return true;
    }
    return false;
}
//获取选中的ip地址
function get_select_host_addr() {
    return select_host_addr;
}
//绑定设备与用户信息
function bound_device_to_auth(ip_addr,user_number){
    if(!isValidIP(ip_addr)){
        system_prompt_display("地址格式有误！");
        return false;
    }
    if(device_list_array.length < device_list_max_count){
        for(let index in device_list_array){
            if(ip_addr === device_list_array[index].ip){
                device_list_array[index].user_number = user_number;
                system_prompt_display("载入用户成功！");//
                return true;
            }
        }
        //用户信息未找到 请重选选中
        return false;
    }
    return false;
}
//清除元素
function clean_device_list_of_array() {
    device_list_array.splice(0,device_list_array.length);
    update_device_list_display();
}
//获取一个元素
function get_device_list_of_array(index) {
    if(index < device_list_array.length){
        return device_list_array[index];
    }else{
        return null;
    }
}
//删除一个设备
function delete_device_list_of_array(index) {
    if(index < device_list_max_count){
        device_list_array.splice(index,1);
    }
    update_device_list_display();
}

//给定ip进行状态监测
function refresh_device_list_display(ip_addr) {
    let links = "http://"+ip_addr+":"+select_host_port+"/download_device_status";
    $.ajax({
        timeout:1000,
        url: links,
        complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            if(status === "success"){//超时,status还有success,error等值的情况
                let result = XMLHttpRequest.responseJSON;
                if(result.status === 0) {
                    add_device_list_to_array(ip_addr, result.data.system.d_name, true);
                }
            }else if(status === "error" || status === "timeout"){
                add_device_list_to_array(ip_addr, "", false);
            }
        }
    })
}
//创建显示设备的列表
function create_device_list_html(){
    let device_list ="";
    let reserver = $("#device_list_area").html();//读取预留的信息
    device_list_max_count = get_config_infor("soft_config_connect_count");//读取连接数
    for(let index = 0;index < device_list_max_count;index++) {
        device_list += reserver.replace("device_li_list0","device_li_list"+index);
    }
    $("#device_list_area").html(device_list);
}
//初始化设备列表信息
function init_device_list_display() {
    for(let index = 0;index < device_list_max_count;index++){
        let li_tag = $("#device_li_list" + index);
        //let li_tag = $("#device_li_list"+(index % 10));
        li_tag.css("color", "#797979");
        li_tag.find(".device_list_index").text("");
        li_tag.find(".device_list_name").text("");
        li_tag.find(".device_list_status_image").attr("src","./image/u173.png");
        li_tag.click((event)=> {
            let current_tag = event.currentTarget;
            let select_device_index = $(current_tag).find(".device_list_index").text();
            $("#device_list_area").find("span").css("color", "#797979");//清除所有选中
            $(current_tag).find(".device_list_name").css("color", "#ffffff");
            //$(current_tag).css("border","1px solid transparent");
            //$(current_tag).css("background","#797979");
            if(device_list_array[select_device_index].ip){
                select_host_addr = device_list_array[select_device_index].ip;
                select_host_class_sync = false;//设置为未同步
                //PC版本支持
                if(!device_is_phone()) {
                    if (device_list_array[select_device_index].user_number == null) {
                        //提示用户需要绑定用户
                        system_prompt_display("请绑定用户，选择登记或者载入等方式！");//
                        $('#user_name').text("");
                        $('#user_age').text("");
                        $('#user_remarks').text("");
                    } else {
                        user_set_control_user(device_list_array[select_device_index].user_number);
                        logic_user_load_info();
                    }
                }
                //PC版本支持
            }
        });
        li_tag.dblclick((event)=>{
            let current_tag = event.currentTarget;
            layer.prompt({value:$(current_tag).find(".device_list_name").text(),title: "修改设备名称"}, function (value, index) {
                get_device_rename(value);//
                layer.close(index);
            });
            // if(device_is_phone()) {
            //     layer.open({
            //         title:["修改设备名称", 'background-color: #eee;color: #797979;'],
            //         content: '<label for="layer_input_value"></label><input id="layer_input_value" type="text" style="border: 0.01rem solid #797979;box-sizing : border-box ;height:28px;width: 80%;" autofocus/>'
            //         ,btn: ['确定', '取消']
            //         ,yes: function(index){
            //             let device_name = $("#layer_input_value").val();
            //             get_device_rename(device_name);//
            //             layer.close(index);
            //         }
            //     });
            //     document.getElementById("layer_input_value").focus();
            // }else{
            //     layer.prompt({value:$(current_tag).find(".device_list_name").text(),title: "修改设备名称"}, function (value, index) {
            //         get_device_rename(value);//
            //         layer.close(index);
            //     });
            // }
        });
        li_tag.mousedown(function(event){
            if(event.which === 3){//alert();// 1 = 鼠标左键 left; 2 = 鼠标中键; 3 = 鼠标右键
                let current_tag = event.currentTarget;
                let select_device_index = $(current_tag).find(".device_list_index").text();
                layer.confirm("你确定要删除["+ $(current_tag).find(".device_list_name").text() +"]设备？", {icon: 3, title:"删除设备"}, function(index){
                    delete_device_list_of_array(select_device_index);
                    layer.close(index);
                });
                // if(device_is_phone()) {
                //     //底部对话框
                //     layer.open({
                //         content: "你确定要删除["+ $(current_tag).find(".device_list_name").text() +"]设备？"
                //         ,btn: ['删除', '取消']
                //         ,skin: 'footer'
                //         ,yes: function(index){
                //             delete_device_list_of_array(select_device_index);
                //             layer.close(index);
                //         }
                //     });
                // }else{
                //     layer.confirm("你确定要删除["+ $(current_tag).find(".device_list_name").text() +"]设备？", {icon: 3, title:"删除设备"}, function(index){
                //         delete_device_list_of_array(select_device_index);
                //         layer.close(index);
                //     });
                // }
            }
            //return false;//阻止链接跳转
        });
        //移动端长按触摸
        li_tag.bind("taphold",function(event){
            let current_tag = event.currentTarget;
            let select_device_index = $(current_tag).find(".device_list_index").text();
            layer.confirm("你确定要删除["+ $(current_tag).find(".device_list_name").text() +"]设备？", {icon: 3, title:"删除设备"}, function(index){
                delete_device_list_of_array(select_device_index);
                layer.close(index);
            });
            // if(device_is_phone()) {
            //     //底部对话框
            //     layer.open({
            //         content: "你确定要删除["+ $(current_tag).find(".device_list_name").text() +"]设备？"
            //         ,btn: ['删除', '取消']
            //         ,skin: 'footer'
            //         ,yes: function(index){
            //             delete_device_list_of_array(select_device_index);
            //             layer.close(index);
            //         }
            //     });
            // }else{
            //     layer.confirm("你确定要删除["+ $(current_tag).find(".device_list_name").text() +"]设备？", {icon: 3, title:"删除设备"}, function(index){
            //         delete_device_list_of_array(select_device_index);
            //         layer.close(index);
            //     });
            // }
            //return false;//阻止链接跳转
        });
        li_tag.hide();
    }
}
//添加设备列表
function update_device_list_display() {
    for(let index = 0;index < device_list_max_count;index++){
        let li_tag = $("#device_li_list"+ index );
        //let li_tag = $("#device_li_list"+(index % 10));
        if(index < device_list_array.length){
            li_tag.css("color", "#797979");
            li_tag.find(".device_list_index").text(index);
            li_tag.find(".device_list_name").text(device_list_array[index].status?device_list_array[index].name:"default");
            li_tag.find(".layui-icon").css("color",device_list_array[index].status?"#34475E":"#E60012");
            li_tag.find(".layui-icon").html(device_list_array[index].status?"&#xe64c;":"&#xe64d;");
            li_tag.show();
        }else{
            li_tag.hide();
        }
    }
    set_config_infor("device_list_array",JSON.stringify(device_list_array));//保存已存在设备列表
}

function isValidIP(ip) {
    let reg =  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    return reg.test(ip);
}

/*
       let ip_array = ip_addr.split(".");
       let ip_port = 8000;
       let ip_path = "/download_device_status";
       let index = system_prompt_display("", {
           time:100000,
           icon: 16,
           id:"progress_msg",
           content: '<p id="progress" style="color:#000">扫描进度:0%</p>'
       });
       let sacan_timer = setInterval(function () {
           let host = ip_array[0]+"."+ip_array[1]+"."+ip_array[2]+"."+scan_count;
           let url = "http://"+ip_array[0]+"."+ip_array[1]+"."+ip_array[2]+"."+scan_count+":"+ip_port+ip_path;
           if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
               xmlhttp=new XMLHttpRequest();
           }else{// code for IE6, IE5
               xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
           }
           xmlhttp.open("GET",url,true);//异步请求
           xmlhttp.send();
           xmlhttp.onreadystatechange=function(){
               //console.log("echo::"+xmlhttp.readyState+" : "+xmlhttp.status+ip_array[3]);
               result_count++;
               if(result_count > max_scan_count){
                   layer.close(index);
                   result_count = max_scan_count;
                   update_device_list_display();
               }else {
                   document.getElementById("progress").innerHTML  = "扫描进度:"+Math.floor(result_count*100/max_scan_count)+"%";
               }
               if (xmlhttp.readyState === 4 && xmlhttp.status === 200){
                   let result = JSON.parse(xmlhttp.responseText);
                   add_device_list_to_array(host,result.data.system.d_name === "default"?host:result.data.system.d_name,true);//添加设备
               }
           };
           if(++scan_count > max_scan_count){
               clearInterval(sacan_timer);
           }
       },100);
*/