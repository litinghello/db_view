//loading file
// user_cs_load_js("./js/user_storage.js");//载入存储模块
// user_cs_load_js("./js/user_crypto.js");//载入加密模块

function user_api_init_app() {
    let con_json = user_init_load_config();
    let file_json = user_cs_file_read(user_ac_get_roaming_path(con_json.user_uuid),'utf-8');//读取配置文件
    let cBrowserWindow = require('electron').remote.getCurrentWindow();//获取当前窗口
    cBrowserWindow.maximize();//设置最大化
    if(file_json === null){
        // user_system_set_password(function (password) {
            user_cs_file_write(user_ac_get_roaming_path(con_json.user_uuid),{
                "user_uuid":con_json.user_uuid,
                "user_pass":"",
                "auth_type":0,//授权类型
                "auth_time":0,//授权时间
                "database":{//数据库配置
                    "database":"default_db",
                    "version":"0.1",
                    "information":"null",
                    "size":-1
                }
            });
            // user_cs_goto_view('auth.html');//跳转授权页面
        // });//设置密码
    }else{
        // user_system_confirm_password(function () {//校队密码
        //     if(file_json.user_uuid !== con_json.user_uuid){
        //         layer.alert('系统授权错误，请联系厂商！');
        //     }else{
        //         if(file_json.auth_time > 0 || file_json.auth_time === -1){
        //             user_database_init();//初始化数据库
        //             // user_cs_goto_view('home.html');
        //             user_cs_goto_view('login.html');
        //         }else{
        //             user_cs_goto_view('auth.html');//跳转授权页面
        //         }
        //     }
        // });
    }
    user_database_init();//初始化数据库
}
//获取授权类型
function user_get_auth_type() {
    let data = user_cs_file_read(user_ac_get_roaming_path(user_init_load_config().user_uuid));
    if(data === null){
        return null;
    }else{
        return data.auth_type;
    }
}
//获取时间
function user_get_auth_time() {
    let data = user_cs_file_read(user_ac_get_roaming_path(user_init_load_config().user_uuid));
    if(data === null){
        return null;
    }else{
        return data.auth_time;
    }

}
//更新时间
function user_set_auth_time(time) {
    user_cs_file_update(user_ac_get_roaming_path(user_init_load_config().user_uuid),{"auth_time":time});
}

function user_database_init() {
    user_ac_database_open_database(user_cs_file_read(user_ac_get_roaming_path(user_init_load_config().user_uuid),'utf-8').database);//加载数据库
    user_ac_database_create_table("user_info_table",{
        "user_number": "int primary key",
        "user_name": "varchar(255)",
        "user_address": "varchar(255)",
        "user_age": "varchar(255)",
        "user_idcard": "varchar(255)",
        "user_degree": "varchar(255)",
        "user_gender": "varchar(255)",
        "user_height": "varchar(255)",
        "user_national": "varchar(255)",
        "user_remarks": "varchar(1024)",
        "user_tel": "varchar(255)",
        "user_weight": "varchar(255)",
        // "create_time":"varchar(255)",//系统自带
        // "update_time":"varchar(255)",//系统自带
    },function () {
    });
    user_ac_database_create_table("user_score_table",{
        "score_number": "int primary key",//分值主键
        "score_title": "varchar(255)",//答题标题
        "score_type": "varchar(255)",//答题类型
        "score_value": "varchar(255)",//答题得分
        "score_answer": "varchar(2048)",//答题信息
        "score_result":"varchar(255)",//答题结果文本
        "user_number": "int",//所属用户
        // "create_time":"varchar(255)",//系统自带
        // "update_time":"varchar(255)",//系统自带
    },function () {
    });
    user_ac_database_create_table("user_music_table",{
        "music_number": "int primary key",//音乐操作表主键
        "music_type": "varchar(255)",//播放音乐类别
        "music_title": "varchar(255)",//播放音乐标题
        "music_value": "varchar(255)",//播放音乐标题 操作状态
        "music_result": "varchar(255)",//播放音乐结果信息
        "user_number": "int",//所属用户
        // "create_time":"varchar(255)",//系统自带
        // "update_time":"varchar(255)",//系统自带
    },function () {
    });
}
function user_database_max_user_number(callback) {
    user_ac_database_open_database(user_cs_file_read(user_ac_get_roaming_path(user_init_load_config().user_uuid),'utf-8').database);//加载数据库
    user_ac_database_max_table("user_number","user_info_table",function (len,data) {
        callback(parseInt(data[0]['MAX(user_number)'] == null ? 0:data[0]['MAX(user_number)']));//返回最大值
    });
}
function user_database_write_user_infor(data,callback) {
    user_ac_database_open_database(user_cs_file_read(user_ac_get_roaming_path(user_init_load_config().user_uuid),'utf-8').database);//加载数据库
    user_ac_database_write("user_info_table",data,callback);
}
function user_database_update_user_infor(target,data,callback) {
    user_ac_database_open_database(user_cs_file_read(user_ac_get_roaming_path(user_init_load_config().user_uuid),'utf-8').database);//加载数据库
    user_ac_database_update("user_info_table",target,data,callback);
}
function user_database_read_user_infor(data,callback) {
    user_ac_database_open_database(user_cs_file_read(user_ac_get_roaming_path(user_init_load_config().user_uuid),'utf-8').database);//加载数据库
    user_ac_database_read("user_info_table",data,callback);
}
function user_database_delete_user_infor(data,callback) {
    user_ac_database_open_database(user_cs_file_read(user_ac_get_roaming_path(user_init_load_config().user_uuid),'utf-8').database);//加载数据库
    user_ac_database_delete("user_info_table",data,callback);
}

//得分数据操作
function user_database_max_score_number(callback) {
    user_ac_database_open_database(user_cs_file_read(user_ac_get_roaming_path(user_init_load_config().user_uuid),'utf-8').database);//加载数据库
    user_ac_database_max_table("score_number","user_score_table",function (len,data) {
        callback(parseInt(data[0]['MAX(score_number)'] == null ? 0:data[0]['MAX(score_number)']));//返回最大值
    });
}
function user_database_write_score_infor(data,callback) {
    user_ac_database_open_database(user_cs_file_read(user_ac_get_roaming_path(user_init_load_config().user_uuid),'utf-8').database);//加载数据库
    data['user_number'] = user_init_load_config().default_user;//设置默认当前选中的用户
    user_database_max_score_number(function (index) {//获取最大的指数
        data['score_number'] = index + 1;
        user_ac_database_write("user_score_table",data,callback);
    });
}
function user_database_update_score_infor(target,data,callback) {
    user_ac_database_open_database(user_cs_file_read(user_ac_get_roaming_path(user_init_load_config().user_uuid),'utf-8').database);//加载数据库
    data['user_number'] = user_init_load_config().default_user;//设置默认当前选中的用户
    user_ac_database_update("user_score_table",target,data,callback);
}
function user_database_read_score_infor(data,callback) {
    user_ac_database_open_database(user_cs_file_read(user_ac_get_roaming_path(user_init_load_config().user_uuid),'utf-8').database);//加载数据库
    data['user_number'] = user_init_load_config().default_user;//设置默认当前选中的用户
    user_ac_database_read("user_score_table",data,callback);
}
function user_database_delete_score_infor(data,callback) {
    user_ac_database_open_database(user_cs_file_read(user_ac_get_roaming_path(user_init_load_config().user_uuid),'utf-8').database);//加载数据库
    data['user_number'] = user_init_load_config().default_user;//设置默认当前选中的用户
    user_ac_database_delete("user_score_table",data,callback);
}
function user_database_delete_score_info_atwill(data,callback) {
    user_ac_database_open_database(user_cs_file_read(user_ac_get_roaming_path(user_init_load_config().user_uuid),'utf-8').database);//加载数据库
    user_ac_database_delete("user_score_table",data,callback);
}
function user_database_read_score_infor_all(data,callback) {
    user_ac_database_open_database(user_cs_file_read(user_ac_get_roaming_path(user_init_load_config().user_uuid),'utf-8').database);//加载数据库
    user_ac_database_read("user_score_table",data,callback);
}

function user_database_read_score_and_user_infor_all(data,callback) {
    user_ac_database_open_database(user_cs_file_read(user_ac_get_roaming_path(user_init_load_config().user_uuid),'utf-8').database);//加载数据库
    user_ac_database_read_inner("user_score_table","user_info_table","user_number","user_score_table",data,callback);
}

//音乐操作记录数据
function user_database_max_music_number(callback) {
    user_ac_database_open_database(user_cs_file_read(user_ac_get_roaming_path(user_init_load_config().user_uuid),'utf-8').database);//加载数据库
    user_ac_database_max_table("music_number","user_music_table",function (len,data) {
        callback(parseInt(data[0]['MAX(music_number)'] == null ? 0:data[0]['MAX(music_number)']));//返回最大值
    });
}
function user_database_write_music_infor(data,callback) {
    user_ac_database_open_database(user_cs_file_read(user_ac_get_roaming_path(user_init_load_config().user_uuid),'utf-8').database);//加载数据库
    data['user_number'] = user_init_load_config().control_user;//设置默认当前选中的用户
    user_database_max_music_number(function (index) {//获取最大的指数
        data['music_number'] = index + 1;
        user_ac_database_write("user_music_table",data,callback);
    });
}
function user_database_update_music_infor(target,data,callback) {
    user_ac_database_open_database(user_cs_file_read(user_ac_get_roaming_path(user_init_load_config().user_uuid),'utf-8').database);//加载数据库
    data['user_number'] = user_init_load_config().control_user;//设置默认当前选中的用户
    user_ac_database_update("user_music_table",target,data,callback);
}
function user_database_read_music_infor(data,callback) {
    user_ac_database_open_database(user_cs_file_read(user_ac_get_roaming_path(user_init_load_config().user_uuid),'utf-8').database);//加载数据库
    data['user_number'] = user_init_load_config().control_user;//设置默认当前选中的用户
    user_ac_database_read("user_music_table",data,callback);
}

function user_system_set_password(callback) {
    layer.prompt({title: '设置密码，并确认', formType: 1}, function(first_pass, index){
        layer.close(index);
        if(!/[0-9a-zA-Z]/g.test(first_pass)){
            layer.msg('密码含有非法字符，请重新设置',function(){
                user_system_set_password(callback);
            });
        }
        layer.prompt({title: '确认密码', formType: 1}, function(second_pass, index){
            layer.close(index);
            if(first_pass !== second_pass){
                layer.msg('两次输入密码不一致，请重新设置',function(){
                    user_system_set_password(callback);
                });
            }else{
                callback(first_pass);
            }
        });
    });
}
function user_system_confirm_password(callback) {
    layer.prompt({title: '请输入密码登录软件', formType: 1}, function(first_pass, index){
        layer.close(index);
        if(first_pass !== user_cs_file_read(user_ac_get_roaming_path(user_init_load_config().user_uuid),'utf-8').user_pass){
            layer.msg("密码错误。");
            user_system_confirm_password(callback);
        }else{
            callback();
        }
    });
}

function user_post_score_online(data,callback){
    $.post("http://47.95.119.159:80/ai_evaluate",{inner:JSON.stringify(data)},function(result){
        callback(JSON.parse(result));
    });
}
