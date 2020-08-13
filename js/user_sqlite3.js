//chrome V8 数据库操作
/*
function user_database_read_information(path,callback){
	var sqlite3 = require('sqlite3').verbose();
	var db = new sqlite3.Database(path);
	db.all("SELECT * FROM information", function (err, rows) {
		callback(rows.length,rows);
		db.close();
	});
}
*/