const electron = require('electron');
const app = electron.app;
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');//自动播放开启

app.on('ready',function(){//当 Electron 完成初始化时被触发。
    const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
    let window = new BrowserWindow({width:width,height:height,minWidth:width/4,minHeight:height/4,fullscreen:false,autoHideMenuBar:true,useContentSize:true,webPreferences:{devTools:true,nodeIntegration:true,nodeIntegrationInWorker:true}});
    // window.loadURL(`file://${__dirname}/html/index.html`);
    window.loadFile("./html/index.html");
    //window.openDevTools();//开启调试工具
	window.setMenu(null);
    window.on('closed',()=>{
        window = null;
    });
});

app.on('window-all-closed',function(){//当所有的窗口都被关闭时触发。
	app.quit();
});



ipcMain.on('download', (event, arg) => {
	//console.log(arg);
	download(arg,function(err){
		event.reply('message', err);
	});
})
ipcMain.on('upload', (event, arg) => {
	//console.log(arg);
	upload(arg,function(err){
		event.reply('message', err);
	});
})
ipcMain.on('update', (event, arg) => {
	//console.log(arg);
	update(arg,function(err){
		event.reply('message', err);
	});
})
ipcMain.on('sshexec', (event, arg) => {
	//console.log(arg);
	sshexec(arg,function(err){
		event.reply('message', err);
	});
})
function download(config,callback){
	var EasyFtp = require('easy-ftp');
	var ftp = new EasyFtp();
	ftp.connect(config);
	ftp.on('open', function(){
		ftp.download(config.file,config.savefile,function(err){
			callback({type:'download',msg:err});
			//ftp.close();
		});
	});
	ftp.on('close', function(){
		//callback({type:'download',msg:"close"});
	});
	ftp.on('error', function(){
		callback({type:'download',msg:"error"});
	});
}
function upload(config,callback){
	var EasyFtp = require('easy-ftp');
	var ftp = new EasyFtp();
	ftp.connect(config);
	ftp.on('open', function(){
		ftp.upload(config.file,config.savefile,function(err){
			callback({type:'upload',msg:err});
			//ftp.close();
		});
	});
	ftp.on('close', function(){
		//callback({type:'upload',msg:"close"});
	});
	ftp.on('error', function(){
		callback({type:'upload',msg:"error"});
	});
}
function update(config,callback){
	var EasyFtp = require('easy-ftp');
	var ftp = new EasyFtp();
	ftp.connect(config);
	ftp.on('open', function(){
		ftp.ls("/",function(list){
			callback({type:'update',msg:list});
		});
	});
	ftp.on('close', function(){
		//callback({type:'update',msg:"close"});
	});
	ftp.on('error', function(){
		callback({type:'update',msg:"error"});
	});
}

//远程执行命令
function sshexec(config,callback){
	var Client = require('ssh2').Client;
	var conn = new Client();
	console.log(config.exec);
	conn.on('ready', function() {
		console.log('Client :: ready');
		conn.exec(config.exec, function(err, stream) {
			if (err) throw err;
			stream.on('close', function(code, signal) {
				console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
				//callback({type:'sshexec',msg:signal});
				conn.end();
			}).on('data', function(data) {
				console.log('STDOUT: ' + data);
				callback({type:'sshexec',msg:data});
			}).stderr.on('data', function(data) {
				callback({type:'sshexec',msg:"error"});
			});
		});
	}).connect(config);	
}
