


function select_report_type(tag,model,data){
  if(user_init_load_config().set_export_model_path === './export/export.html'){
      model +=  './export/export.html';
  }else{
    model = user_init_load_config().set_export_model_path;
  }
  console.log(model);
  layer.confirm('请选择导出资料格式,或者删除资料！',{icon: 0, title: '提示',btn: ['PDF文档','WORD文档','在线打印','删除文档']
      ,btn1:function (index) {
          layer.close(index);
          report_export("pdf", tag,model,data);
      },btn2:function (index) {
          layer.close(index);
          report_export("word",tag,model, data);
      },btn3:function (index) {
          layer.close(index);
          report_export("print",tag,model,data);
      },btn4:function (index) {
          layer.close(index);
          if($("#user_number").val() === ""){
            layer.msg(`所有用户模式下不能进行数据删除！`);
          }else{
            user_database_delete_score_infor({"score_number":data.score_number},function(){
              layer.msg(`序号${data.score_number}的文档已删除`);
            });//更新默认用户
          }
      }});
}


function report_export(type,tag,model,data) {
  layer.prompt({
    formType: 2,
    value: '&nbsp;',
    title: '请输入备注信息：',
    btn:["确认"],
    cancel:function(index) {

    }},
    function(value, index, elem){
      data["score_description"] = value;
      layer.close(index);
      user_database_read_user_infor({"user_number":data.user_number},function (len,user_info) {
          if(len === 0){
              layer.msg("用户信息已经被删除，无法操作！");
              return;
          }
          $(tag).load(model, (text) => {
              let config_set = user_init_load_config();
              let update_time = ((data.update_time).split(' '))[0].split('/');
              // $("#score_title").html(data.score_title);//评估报告
              // $("#score_value").html(parseFloat(data.score_value).toFixed(2) + '分');//得分值
              // $("#score_result").html(data.score_result);//评估结果
              // // $("#update_time").html(data.update_time);//评估时间
              // $("#update_time_yy").html(update_time[0]);//评估时间
              // $("#update_time_mm").html(update_time[1]);//评估时间
              // $("#update_time_dd").html(update_time[2]);//评估时间
              //
              // if(config_set.set_hospital_name !== ""){
              //     $("#set_hospital_name").html(config_set.set_hospital_name);//医院名称
              // }
              // if(config_set.set_department_name !== ""){
              //     $("#set_department_name").html(config_set.set_department_name+"&nbsp;&nbsp;");//医院科室
              // }
              // if(config_set.set_principal_name !== ""){
              //     $("#set_principal_name").html(config_set.set_principal_name+"&nbsp;&nbsp;");//医院科室
              // }
              //
              // $("#user_department_id").html(data.score_number);//序号
              // $("#user_name").html(user_info[0].user_name);//用户信息
              // $("#user_age").html(user_info[0].user_age);//年龄
              // $("#user_degree").html(user_info[0].user_degree);//学历
              // $("#user_gender").html(user_info[0].user_gender);//性别
              // $("#user_weight").html(user_info[0].user_weight+"kg");//体重
              // $("#user_height").html(user_info[0].user_height+"cm");//身高
              // $("#user_remarks").html(user_info[0].user_remarks);//备注
              // $("#score_description").html(data.score_description);//说明信息
              $("span [id=score_title]").each(function(){$(this).html(data.score_title)});//评估报告
              $("span [id=score_value]").each(function(){$(this).html(parseFloat(data.score_value).toFixed(2) + '分')});//得分值
              $("span [id=score_result]").each(function(){$(this).html(data.score_result)});//评估结果
              // $("#update_time").html(data.update_time);//评估时间
              $("span [id=update_time_yy]").each(function(){$(this).html(update_time[0])});//评估时间
              $("span [id=update_time_mm]").each(function(){$(this).html(update_time[1])});//评估时间
              $("span [id=update_time_dd]").each(function(){$(this).html(update_time[2])});//评估时间

              if(config_set.set_hospital_name !== ""){
                  $("span [id=set_hospital_name]").each(function(){$(this).html(config_set.set_hospital_name)});//医院名称
              }
              if(config_set.set_department_name !== ""){
                  $("span [id=set_department_name]").each(function(){$(this).html(config_set.set_department_name+"&nbsp;&nbsp;")});//医院科室
              }
              if(config_set.set_principal_name !== ""){
                  $("span [id=set_principal_name]").each(function(){$(this).html(config_set.set_principal_name+"&nbsp;&nbsp;")});//医院科室
              }

              $("span [id=user_department_id]").each(function(){$(this).html(data.score_number)});//序号
              $("span [id=user_name]").each(function(){$(this).html(user_info[0].user_name)});//用户信息
              $("span [id=user_age]").each(function(){$(this).html(user_info[0].user_age)});//年龄
              $("span [id=user_degree]").each(function(){$(this).html(user_info[0].user_degree)});//学历
              $("span [id=user_gender]").each(function(){$(this).html(user_info[0].user_gender)});//性别
              $("span [id=user_weight]").each(function(){$(this).html(user_info[0].user_weight+"kg")});//体重
              $("span [id=user_height]").each(function(){$(this).html(user_info[0].user_height+"cm")});//身高
              $("span [id=user_remarks]").each(function(){$(this).html(user_info[0].user_remarks)});//备注
              $("span [id=score_description]").each(function(){$(this).html(data.score_description)});//说明信息
              if (type === "pdf") {
                  //pdf保存
                  const {BrowserWindow, dialog} = require('electron').remote;
                  const save_fs = require('fs');
                  let new_win = new BrowserWindow({width: 840, height: 1188,show: true,webPreferences:{nodeIntegration: true}});
                  new_win.loadURL('data:text/html;charset=utf-8,' + $(tag).html());
                  let contents = new_win.webContents;
                  let path = dialog.showOpenDialogSync({properties: ['openDirectory']});
                  if(path !== undefined){
                      contents.on('did-finish-load', () => {
                        contents.printToPDF({pageSize: "A4"}).then(function (result) {
                            save_fs.writeFile(`${path[0]}\\${user_info[0].user_name}_${data.score_title}.pdf`, result, (error) => {
                            new_win.close();
                        })
                      })
                      // contents.printToPDF({pageSize: "A4"}, (err, file_data) => {
                      //   console.log(file_data)
                      //   save_fs.writeFile(`${path[0]}\\${user_info[0].user_name}_${data.score_title}.pdf`, file_data, (error) => {
                      //     new_win.close();
                      //   })
                      // })
                      })
                  }else{
                    new_win.close();
                  }
              } else if (type === "word") {
                  //word保存
                  $(tag).wordExport(user_info[0].user_name + "_" + data.score_title);
              } else if(type === "print"){
                  //打印
                  const {BrowserWindow} = require('electron').remote;
                  let win = new BrowserWindow({width: 840, height: 1188,show: true });
                  win.loadURL('data:text/html;charset=utf-8,' + $(tag).html());
                  let contents = win.webContents;
                  contents.print({pageSize: "A4"}, function (err, data) {
                      // win.close();
                  });
              }else{

              }
          });
      });
    });
}
