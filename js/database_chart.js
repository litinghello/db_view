


function get_chart_data_form_db(object,callback){
  user_ac_database_open_database(user_cs_file_read(user_ac_get_roaming_path(user_init_load_config().user_uuid),'utf-8').database);//加载数据库
  if(object.database.type === "sum_same"){
    user_ac_database_sum_same(object.database.table,object.database.field,object.database.data,function (len, data) {
      // console.log(data)
      let d_labels = [],d_data = [],index = 0;
      for(let key in data[0]){
        d_labels[index] = key;
        d_data[index] = data[0][key];
        index++;
      }
      callback({
        "type": object.chart.type,
        "data": {
            "labels": d_labels,
            "datasets": [{
                "label": object.chart.label,
                "backgroundColor": object.chart.backgroundColor,
                "borderColor": object.chart.borderColor,
                "data": d_data
            }]
        },
        "options":object.options
      })
    });

  }else if(object.database.type === "sum_between"){
    user_ac_database_sum_between(object.database.table,object.database.field,object.database.data,function (len, data) {
      // console.log(data);
      let d_labels = [],d_data = [],index = 0;
      for(let key in data[0]){
        d_labels[index] = key;
        d_data[index] = data[0][key];
        index++;
      }
      callback({
        "type": object.chart.type,
        "data": {
            "labels": d_labels,
            "datasets": [{
                "label": object.chart.label,
                "backgroundColor": object.chart.backgroundColor,
                "borderColor": object.chart.borderColor,
                "data": d_data
            }]
        },
      })
    });
  }else{

  }

}

//table：表名称 field：字段 target：{a:[0,1],b:[1,2]}
function user_ac_database_sum_between(table,field,target,callback){
    // console.log(target);
    let SQL_STR = "SELECT ";
    for(let key in target){
      //console.log(target[key])
      SQL_STR += `SUM(CASE WHEN CAST(${field} as int) BETWEEN ${target[key][0]} AND ${target[key][1]} THEN 1 ELSE 0 END) AS ${key},`;
    }
    SQL_STR = SQL_STR.substr(0,SQL_STR.length-1);
    SQL_STR += ` FROM ${table}`;
    // console.log(SQL_STR);
    // SQL_STR = `SELECT SUM(CASE WHEN CAST(user_age as int) BETWEEN 0 AND 10 THEN 1 ELSE 0 END) AS '0-10' FROM ${table}`;
    user_ac_database.handle.transaction(function(tx){
        tx.executeSql(SQL_STR,[],function (tx,result) {
            // console.log(result.rows.length,result.rows);
            callback(result.rows.length,result.rows);
        }, function (tx, error) {
            console.log(error.message);
        });
    });
}
//table：表名称 field：字段 target：{a:[1],b:[2]}
function user_ac_database_sum_same(table,field,target,callback){
    // console.log(target);
    let SQL_STR = "SELECT ";
    for(let key in target){
      //console.log(target[key])
      SQL_STR += `SUM(CASE WHEN ${field} = ${target[key][0]} THEN 1 ELSE 0 END) AS ${key},`;
    }
    SQL_STR = SQL_STR.substr(0,SQL_STR.length-1);
    SQL_STR += ` FROM ${table}`;
    // console.log(SQL_STR);
    // SQL_STR = `SELECT SUM(CASE WHEN CAST(user_age as int) BETWEEN 0 AND 10 THEN 1 ELSE 0 END) AS '0-10' FROM ${table}`;
    user_ac_database.handle.transaction(function(tx){
        tx.executeSql(SQL_STR,[],function (tx,result) {
            // console.log(result.rows.length,result.rows);
            callback(result.rows.length,result.rows);
        }, function (tx, error) {
            console.log(error.message);
        });
    });
}
