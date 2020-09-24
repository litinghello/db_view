











//载入模板
function load_export_template(tag){
	let export_template = user_init_load_config().set_export_model_path;
	if(export_template == undefined || export_template== "")export_template = './export/export.html';
	$(tag).load(export_template, (text) => {
		console.log(`load ${export_template}`);
	});
}
//清除模板下所有具有ID值的数据
function clean_export(tag){
	$(`${tag} [id]`).each(function(){
		//console.log($(this).attr('id'),$(this).html());
		$(this).html("");
	});
}
//打印数据
function console_export_data(tag){
	$(`${tag} [id]`).each(function(){
		console.log($(this).attr('id'),$(this).html());
	});
}
//加载数据
function load_export_data(tag,data){
	let config_set = user_init_load_config();
	if(config_set.set_hospital_name != undefined){
		$(`${tag} span [id=set_hospital_name]`).each(function(){$(this).html(config_set.set_hospital_name)});//医院名称
	}
	if(config_set.set_department_name != undefined){
		$(`${tag} span [id=set_department_name]`).each(function(){$(this).html(config_set.set_department_name)});//医院科室
	}
	if(config_set.set_principal_name != undefined){
		$(`${tag} span [id=set_operator_name]`).each(function(){$(this).html(config_set.set_principal_name)});//负责人
	}
	$(`${tag} span [id=set_hospitalized_id]`).each(function(){$(this).html("")});//住院号
	$(`${tag} span [id=set_sickbed_name]`).each(function(){$(this).html("")});//病床号

	$(`${tag} span [id=user_id]`).each(function(){$(this).html(data.user_id)});//用户证件号码
	$(`${tag} span [id=user_name]`).each(function(){$(this).html(data.user_name)});//用户信息
	$(`${tag} span [id=user_gender]`).each(function(){$(this).html(data.user_gender)});//性别
	$(`${tag} span [id=user_age]`).each(function(){$(this).html(data.user_age)});//年龄
	$(`${tag} span [id=user_remarks]`).each(function(){$(this).html(data.user_remarks)});//备注

	$(`${tag} span [id=set_operator_remark]`).each(function(){$(this).html("")});//备注信息

	for(let i=0;i < data.data_len;i++){
		$(`${tag} span [id=data_id${i}]`).each(function(){$(this).html(i+1)});
		$(`${tag} span [id=data_parameter_1_${i}]`).each(function(){$(this).html(data[`data_parameter_1_${i}`])});
		$(`${tag} span [id=data_time_1_${i}]`).each(function(){$(this).html(data[`data_time_1_${i}`])});
		$(`${tag} span [id=data_parameter_2_${i}]`).each(function(){$(this).html(data[`data_parameter_2_${i}`])});
		$(`${tag} span [id=data_time_2_${i}]`).each(function(){$(this).html(data[`data_time_2_${i}`])});
		$(`${tag} span [id=data_parameter_3_${i}]`).each(function(){$(this).html(data[`data_parameter_3_${i}`])});
		$(`${tag} span [id=data_time_3_${i}]`).each(function(){$(this).html(data[`data_time_3_${i}`])});
		$(`${tag} span [id=data_time_total_${i}]`).each(function(){$(this).html(data[`data_time_total_${i}`])});
		$(`${tag} span [id=data_time_record_${i}]`).each(function(){$(this).html(data[`data_time_record_${i}`])});
	}	
}
//导出pdf
function pdf_export_template(tag){
	const {BrowserWindow, dialog} = require('electron').remote;
	const save_fs = require('fs');
	let new_win = new BrowserWindow({width: 840, height: 1188,show: true,webPreferences:{nodeIntegration: true}});
	new_win.loadURL('data:text/html;charset=utf-8,' + $(tag).html());
	let contents = new_win.webContents;
	let path = dialog.showOpenDialogSync({properties: ['openDirectory']});
	if(path !== undefined){
	  contents.on('did-finish-load', () => {
		contents.printToPDF({pageSize: "A4"}).then(function (result) {
			save_fs.writeFile(`${path[0]}\\${data.user_name}_${data.score_title}.pdf`, result, (error) => {
			new_win.close();
		})
	  })
	  })
	}else{
	new_win.close();
	}	
}
//导出word
function word_export_template(tag,name){
	$(tag).wordExport(name);
}
//直接打印
function print_export_template(tag){
	const {BrowserWindow} = require('electron').remote;
	let win = new BrowserWindow({width: 840, height: 1188,show: true });
	win.loadURL('data:text/html;charset=utf-8,' + $(tag).html());
	let contents = win.webContents;
	contents.print({pageSize: "A4"}, function (err, data) {
	  // win.close();
	});
}
