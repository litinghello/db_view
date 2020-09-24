function conversion_report_format(input,output){
	let replace_str=replace_object();
	console.log(replace_str);
	const fs = require('fs');
	fs.readFile(input,'binary',function(err,files){
		result = files;
		for(key in replace_str){
			// <class ...>str<...> => <class ...><span lang=EN-US id="key"></span><...>
			result = result.replace(new RegExp(">"+replace_str[key]+"<",'g'), `><span lang=EN-US id="${key}"></span><`);
		}
		fs.writeFile(output,result, 'binary', function (err) {//utf8, ucs2, ascii, binary, base64, hex
				 if (err) return console.log(err);
		});
	})
}
conversion_report_format("export.htm","export_format.html");

function replace_object(){
	let list_vaule={};
	for(let i=0;i<20;i++){
		list_vaule[`data_id${i}`]=`XH${i}`;
		list_vaule[`data_parameter_1_${i}`]=`XH${i}_CS1`;
		list_vaule[`data_time_1_${i}`]=`XH${i}_SC1`;
		list_vaule[`data_parameter_2_${i}`]=`XH${i}_CS2`;
		list_vaule[`data_time_2_${i}`]=`XH${i}_SC2`;
		list_vaule[`data_parameter_3_${i}`]=`XH${i}_CS3`;
		list_vaule[`data_time_3_${i}`]=`XH${i}_SC3`;
		list_vaule[`data_time_total_${i}`]=`XH${i}_ZSC`;
		list_vaule[`data_time_record_${i}`]=`XH${i}_ZLSJ`;
	}
	let fixed_vaule={
		//"gb2312":"utf-8",//编码
		"set_hospital_name":"YYMC",//医院名称
		"set_department_name":"KSMC",//科室名称
		"set_hospitalized_id":"ZYH",//住院号
		"set_sickbed_name":"BCH",//病床号
		
		
		"user_id":"HZZJHM",//用户证件号码
		"user_name":"HZXM",//用户名称
		"user_gender":"HZXB",//用户性别
		"user_age":"HZNL",//用户年龄
		"user_remarks":"HZBZXX",//用户备注

		"set_operator_remark":"BZXX",//备注信息
		"set_operator_name":"CZZMZ",//操作人
		
		//"update_time_yy":"PGN",//评估时间年
		//"update_time_mm":"PGY",//评估时间月
		//"update_time_dd":"PGR"//评估时间日
	};
	return Object.assign(fixed_vaule,list_vaule);
}

