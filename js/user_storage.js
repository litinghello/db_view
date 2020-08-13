//chrome V8 数据库操作


function user_cs_close_view() {
    setTimeout(()=>{
        window.close();
    },500);
}
//重构跳转模块
function user_cs_goto_view(url) {
    // console.log(url);
    if(url == null){
        window.location.reload();
    }else{
        window.location.assign('../html/'+url);
    }
}
//用于调取存储方式的实现
function user_cs_storage_write(data) {
    for(let key in data){
        user_cs_local_write(key,data[key]);
    }
}
function user_cs_storage_read(data) {
    for(let key in data){
        data[key] = user_cs_local_read(key);
    }
    return data;
}
function user_cs_storage_delete(data) {
    for(let key in data){
        user_cs_local_delete(key);
    }
}
function user_cs_storage_clear() {
    user_cs_local_clear();
}
//session storage
function user_cs_session_write(key,value) {
    window.sessionStorage.setItem(key,value);
}
function user_cs_session_read(key) {
    return window.sessionStorage.getItem(key);
}
function user_cs_seeion_delete(key) {
    window.sessionStorage.removeItem(key);
}
function user_cs_session_clear() {
    window.sessionStorage.clear();
}
//local storage
function user_cs_local_write(key,value) {
    window.localStorage.setItem(key,value);
}
function user_cs_local_read(key) {
    return window.localStorage.getItem(key);
}
function user_cs_local_delete(key) {
    window.localStorage.removeItem(key);
}
function user_cs_local_clear() {
    window.localStorage.clear();
}

//node file read and write
const cs_fs = require('fs');
//写入数据
function user_cs_file_write(path,data) {
    cs_fs.writeFileSync(path,crypto_aes_encryption("12:34:56:78:9a:bc",JSON.stringify(data)));
    // cs_fs.writeFileSync(path,JSON.stringify(data));
}
//获取数据
function user_cs_file_read(path,encoding) {
    if(cs_fs.existsSync(path)){
        // return JSON.parse(cs_fs.readFileSync(path,encoding));
        return JSON.parse(crypto_aes_decryption("12:34:56:78:9a:bc",cs_fs.readFileSync(path,"binary")));//需要采用二进制方式进行文件读取解码
    }else{
        return null;
    }
}
//更新数据
function user_cs_file_update(path,data,encoding) {
    let conf = user_cs_file_read(path,encoding);
    if(conf === null){
        return null;
    }
    for(let key in data){
        conf[key] = data[key];
    }
    user_cs_file_write(path,conf);//写入数据
}
//获取数据路径
function user_ac_get_roaming_path(path){
    return user_init_load_config().roaming_path+"\\"+path;
}
//获取文件执行路径
function user_ac_get_execute_path(path){
    return user_init_load_config().execute_path+"\\"+path;
}

//数据库对象
const user_ac_database = {"handle":null,"database":null,"version":null,"information":null,"size":null};
//加载数据库
function user_ac_database_open_database(object){
    if((user_ac_database.handle === null) ||
        (user_ac_database.database !== object.database) ||
        (user_ac_database.version !== object.version) ||
        (user_ac_database.information !== object.information) ||
        (user_ac_database.size !== object.size)){
        user_ac_database.handle = openDatabase(object.database,object.version,object.information,object.size);
    }
    return user_ac_database;
}

//创建数据表
function user_ac_database_create_table(table,data,callback){
    let SQL_STR = `CREATE TABLE IF NOT EXISTS ${table} `;
    let TAB_STR = new Array();
    data['create_time'] = "varchar(255)";
    data['update_time'] = "varchar(255)";
    for(let key in data){
        TAB_STR.push(`${key} ${data[key]}`);
    }
    SQL_STR += "("+TAB_STR.join(',')+")";
    user_ac_database.handle.transaction(function(tx){
        tx.executeSql(SQL_STR,[],function (tx,result) {
            callback(result.insertId,result.rows);
        }, function (tx, error) {
            console.log(error.message);
        });
    });
}
//删除表
function user_ac_database_delete_table(table,callback){
    let SQL_STR = `DROP TABLE ${table}`;
    user_ac_database.handle.transaction(function(tx){
        tx.executeSql(SQL_STR,[],function (tx,result) {
            callback(result.rowsAffected,result.rows);
        }, function (tx, error) {
            console.log(error.message);
        });
    });
}
//最大值
function user_ac_database_max_table(name,table,callback){
    let SQL_STR = `SELECT MAX(${name}) FROM ${table}`;
    user_ac_database.handle.transaction(function(tx){
        tx.executeSql(SQL_STR,[],function (tx,result) {
            callback(result.rowsAffected,result.rows);
        }, function (tx, error) {
            console.log(error.message);
        });
    });
}
//写入数据到表中
function user_ac_database_write(table,data,callback) {
    let SQL_STR = `INSERT INTO ${table} `;
    let TAB_STR = new Array();
    let VAL_STR= new Array();
    data['create_time'] = (new Date()).toLocaleString();//设置时间
    data['update_time'] = (new Date()).toLocaleString();//设置时间
    // console.log(data);
    for(let key in data){
        TAB_STR.push(key);
        VAL_STR.push(`\'${data[key]}\'`);
    }
    SQL_STR += "("+TAB_STR.join(',')+")"+" VALUES "+"("+VAL_STR.join(',')+")";
    // console.log(SQL_STR);
    user_ac_database.handle.transaction(function(tx){
        tx.executeSql(SQL_STR,[],function (tx,result) {
            callback(result.rows.length,result.rows,data);
        }, function (tx, error) {
            console.log(error.message);
        });
    });
}
//更新数据
function user_ac_database_update(table,target,data,callback) {
    let SQL_STR = `UPDATE ${table} SET `;
    let TAB_STR = new Array();
    let VAL_STR= new Array();

    for(let key in target){
        if(target[key] !== null){
            TAB_STR.push(`${key} = \'${target[key]}\'`);
        }
    }
    data['update_time'] = (new Date()).toLocaleString();//设置时间
    for(let key in data){
        VAL_STR.push(`${key} = \'${data[key]}\'`);
    }
    SQL_STR += VAL_STR.join(",")+" WHERE "+TAB_STR.join(" AND ");
    user_ac_database.handle.transaction(function(tx){
        tx.executeSql(SQL_STR,[],function (tx,result) {
            callback(result.rows.length,result.rows);
        }, function (tx, error) {
            console.log(error.message);
        });
    });
}
//读取数据
function user_ac_database_read(table,target,callback){
    let SQL_STR = `SELECT * FROM ${table} WHERE `;
    let TAB_STR = [];
    for(let key in target){
        if(target[key] !== null && target[key] !== ''){
            TAB_STR.push(`${key} = \'${target[key]}\'`);
        }
    }
    if(TAB_STR.length === 0){
        SQL_STR = `SELECT * FROM ${table}`;
    }else{
        SQL_STR += TAB_STR.join(" AND ");
    }
    user_ac_database.handle.transaction(function(tx){
        tx.executeSql(SQL_STR,[],function (tx,result) {
            // console.log(result.rows.length,result.rows);
            callback(result.rows.length,result.rows);
        }, function (tx, error) {
            console.log(error.message);
        });
    });
}
//删除某一行
function user_ac_database_delete(table,target,callback){
    let SQL_STR = `DELETE FROM ${table} WHERE `;
    let TAB_STR = new Array();
    for(let key in target){
        if(target[key] !== null){
            TAB_STR.push(`${key} = \'${target[key]}\'`);
        }
    }
    SQL_STR += TAB_STR.join(" AND ");
    user_ac_database.handle.transaction(function(tx){
        tx.executeSql(SQL_STR,[],function (tx,result) {
            callback(result.rows.length,result.rows);
        }, function (tx, error) {
            console.log(error.message);
        });
    });
}
//查询A表与B表的关联数据类 然后过滤table_target表中的where_target参数
function user_ac_database_read_inner(table_a,table_b,contact,table_target,where_target,callback){
   let SQL_STR = "WHERE ";
    let TAB_STR = [];
    for(let key in where_target){
        if(where_target[key] !== null && where_target[key] !== ''){
            TAB_STR.push(`${table_target}.${key} = \'${where_target[key]}\'`);
        }
    }
    if(TAB_STR.length === 0){
        SQL_STR = "";
    }else{
        SQL_STR += TAB_STR.join(" AND ");
    }
    // console.log(where_target);
    // console.log(SQL_STR);
    // SQL_STR = `SELECT * FROM ${table_a} left outer join ${table_b} on ${table_a}.${contact} = ${table_b}.${contact} ${SQL_STR}`;
    SQL_STR = `SELECT *,${table_a}.create_time,${table_a}.update_time FROM ${table_a} left outer join ${table_b} on ${table_a}.${contact} = ${table_b}.${contact} ${SQL_STR}`;
    // console.log(SQL_STR);
    user_ac_database.handle.transaction(function(tx){
        tx.executeSql(SQL_STR,[],function (tx,result) {
            // console.log(result.rows.length,result.rows);
            callback(result.rows.length,result.rows);
        }, function (tx, error) {
            console.log(error.message);
        });
    });
}
// user_ac_database_create_table("name",create_table,function(){});
// user_ac_database_delete_table("name3",function(){});
//user_ac_database_write("name",wrtie_table,function(){});
//user_ac_database_read("name",read_table,function(){});
//user_ac_database_update("name",wrtie_table,{"name":"new"},function(){});
//user_ac_database_delete("name",{"name":"new"},function(){});
