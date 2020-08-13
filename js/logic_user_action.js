
function logic_user_load_info() {
    user_database_read_user_infor({"user_number":user_init_load_config().control_user},function (len,data) {
        if(len == 0){
          layer.msg('还没有用户，请先创建！');
          return ;
        }
        $('#user_name').text(data[0].user_name);
        $('#user_age').text(data[0].user_age);
        $('#user_remarks').text(data[0].user_remarks);
    });
}
//添加用户
$('#device_user_add').on('click',function(){
    const {BrowserWindow} = require('electron').remote;
    let win = new BrowserWindow({width: 1080, height: 720,show: true ,resizable:false,autoHideMenuBar: true,useContentSize :true,webPreferences:{nodeIntegration: true}});
    // win.loadURL('data:text/html;charset=utf-8,<p>11</p>');
    // win.openDevTools();//开启调试工具
    win.loadFile('./html/register.html');
    win.on('closed',function(){
        // console.log(get_select_host_addr());
        bound_device_to_auth(get_select_host_addr(),user_init_load_config().control_user);
        logic_user_load_info();
        win = null;
    });
});
//载入用户
$('#device_user_load').on('click',function(){
    const {BrowserWindow} = require('electron').remote;
    let win = new BrowserWindow({width: 1080, height: 720,show: true,resizable:false,autoHideMenuBar: true,useContentSize :true,webPreferences:{nodeIntegration: true}});
    win.loadFile('./html/load.html');
    win.on('closed',function(){
        // console.log(get_select_host_addr());
        bound_device_to_auth(get_select_host_addr(),user_init_load_config().control_user);
        logic_user_load_info();
        win = null;
    });
});
//操作记录
$('#device_user_infor').on('click',function(){
    const {BrowserWindow, dialog} = require('electron').remote;
    let win = new BrowserWindow({width: 1080, height: 720,show: true ,resizable:false,autoHideMenuBar: true,useContentSize :true,webPreferences:{nodeIntegration: true}});
    // win.loadURL('data:text/html;charset=utf-8,<p>11</p>');
    // win.openDevTools();//开启调试工具
    win.loadFile('./html/record.html');
    win.on('closed',function(){
        logic_user_load_info();
        win = null;
    });
});
