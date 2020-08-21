
var Client = require('ssh2').Client;
var conn = new Client();
conn.on('ready', function() {
	console.log('Client :: ready');
	conn.exec(updatetime(), function(err, stream) {
		if (err) throw err;
		stream.on('close', function(code, signal) {
			console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
			conn.end();
		}).on('data', function(data) {
			console.log('STDOUT: ' + data);
		}).stderr.on('data', function(data) {
			console.log('STDERR: ' + data);
		});
	});
}).connect({
  host: '192.168.1.230',
  port: 22,
  username: 'root',
  password: 'fa'
});

function updatetime(){
	let time = new Date();
	let time_str = time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate()+" "+time.getHours()+":"+time.getMinutes()+":"+time.getSeconds();
	return "date -s '"+time_str+"'";
}
