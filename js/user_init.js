

//载入js文件
function user_init_load_js(javascript) {
    let js = document.createElement("script");
    js.setAttribute("type","text/javascript");
    js.setAttribute("src",javascript);
    document.body.appendChild(js);
}
const config_file_name = "f1";
//读取配置文件
function user_init_load_config() {
    let user_app_s = require('electron').remote.app;//获取全局执行文件
    let user_uuid = crypto.createHash('md5').update(mac_address).digest('hex')+config_file_name;
    let app_data_path = user_app_s.getPath('userData');//目录路径
    let app_exe_path = user_app_s.getPath("exe");
    app_exe_path = app_exe_path.substr(0,app_exe_path.lastIndexOf("\\"));//获取可执行文件目录
    let exe_version = user_app_s.getVersion();//系统版本
    let app_con_path = app_data_path+"\\"+config_file_name;//配置文件路径
    let file_json = user_cs_file_read(app_con_path,'utf-8');//读取配置文件
    let machine_id = JSON.parse(require("fs").readFileSync(app_exe_path+"\\soft_config")).machine_id;
    if(file_json === null){
        let config ={
            "machine_id":machine_id,//机器码
            "roaming_path":app_data_path,//软件数据目录
            "execute_path":app_exe_path,//exe执行文件路径
            "exe_version":exe_version,//软件版本
            "user_uuid":user_uuid,//用户uuid
            "set_control_exe_path":"",//控制软件位置
            "set_reservation_url":"",//预约地址
            "set_hospital_name":"",//医院
            "set_department_name":"",//科室
            // "set_principal_name":"",//负责人
            // "user_pass":"",
            // "auth_type":0,//授权类型
            // "auth_time":0,//授权时间
            "default_user":1,//开机加载的默认用户数据

            //控制软件所用配置
            "control_user":1,//音乐控制软件所使用用户
            "soft_config_status":false,//配置状态
            "soft_config_theme":"",//软件主题
            "soft_config_device_port":"",//设备端口
            "soft_config_server_url":"",//服务器地址
            "soft_config_server_sync":"",//是否开启同步
            "soft_config_status_sync_time":"",//状态同步时间
            "soft_config_reconnect_time":"",//重连次数
            "soft_config_connect_count":"",//重连次数
            "soft_config_storage":"",//音乐方案的存储介质
            "soft_config_soft_password":"",//修改密码
            "device_list_array":""//已保存的列表
        };
        user_cs_file_write(app_con_path,config);//写入配置文件
        return config;
    }else{
        //这里需要校队所有配置是否有效
        return file_json;
    }
}
//更新设置信息
function user_set_default_set(data) {
    let user_app_s = require('electron').remote.app;//获取全局执行文件
    let app_data_path = user_app_s.getPath('userData');//目录路径
    let app_con_path = app_data_path+"\\"+config_file_name;//配置文件路径
    user_cs_file_update(app_con_path,data,"utf-8");
}
//更新当前操作用户ID
function user_set_default_user(user_number) {
    let user_app_s = require('electron').remote.app;//获取全局执行文件
    let app_data_path = user_app_s.getPath('userData');//目录路径
    let app_con_path = app_data_path+"\\"+config_file_name;//配置文件路径
    user_cs_file_update(app_con_path,{"default_user":parseInt(user_number)},'utf-8');
}
//更新当前操作用户ID
function user_set_control_user(user_number) {
    let user_app_s = require('electron').remote.app;//获取全局执行文件
    let app_data_path = user_app_s.getPath('userData');//目录路径
    let app_con_path = app_data_path+"\\"+config_file_name;//配置文件路径
    user_cs_file_update(app_con_path,{"control_user":parseInt(user_number)},'utf-8');
}
function user_init_copy_text(text) {
    navigator.clipboard.writeText(text).then(() => {
        layer.msg("授权码复制成功。");
    }).catch(err => {
        layer.msg("授权码复制失败。");
    });
}
