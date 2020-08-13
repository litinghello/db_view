
const os = require('os');//系统信息
const crypto = require('crypto');//加密模块
//加密算法
function crypto_aes_encryption(key,data) {
    let aes_encryption = crypto.createCipher("aes-256-ecb",key,"");
    let hex_str = aes_encryption.update(data, 'utf8', 'hex'); //编码方式从hex转为utf-8;
    hex_str += aes_encryption.final('hex'); //编码方式从utf-8;
    return hex_str;
}
//解密算法
function crypto_aes_decryption(key,data) {
    let aes_decryption = crypto.createDecipher("aes-256-ecb",key,"");
    let hex_str = aes_decryption.update(data, 'hex', 'utf8'); //编码方式从hex转为utf-8;
    hex_str += aes_decryption.final('utf8'); //编码方式从utf-8;
    return hex_str;
}
//获取系统地址信息
function get_OS_address(object){
    let interfaces = os.networkInterfaces();
    for(let devName in interfaces){
        if(interfaces.hasOwnProperty(devName)){
            let iface = interfaces[devName];
            for(let i=0;i<iface.length;i++){
                let alias = iface[i];
                if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                    return alias[object];
                }
            }
        }
    }
}
//随机数据
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

//let mac_address = get_OS_address("mac");//获取mac地址
let mac_address = require('node-machine-id').machineIdSync({original: true});//这里使用机器码
let lock_rcode = crypto_aes_encryption(mac_address,getRandomInt(1,999999999999999).toString());//生成随机值
//let lock_rcode = crypto_aes_encryption(mac_address,"123456");//生成随机值
function get_device_lock(device_password) {
    let lock_object = {
        a:getRandomInt(1,999999999999999),
        s_mac:mac_address,
        //b:getRandomInt(1,999999999999999),
        s_rcode:lock_rcode,
        //c:getRandomInt(1,999999999999999)
    };
    let lock_hex = crypto_aes_encryption(crypto.createHash('sha1').update(device_password).digest('hex'),JSON.stringify(lock_object));
    return lock_hex;
}
//解密数据
function update_run_count(string_key) {
	//解析传递过来的字符串
	let json_key;//解密数据
	try{
		json_key = JSON.parse(crypto_aes_decryption(lock_rcode,string_key));
	}catch(err){
		return null;
	}
	if(json_key.s_mac === mac_address){
		let get_run_time =  parseInt(json_key.play_count);
		let get_run_type =  parseInt(json_key.play_type);
		if(!isNaN(get_run_time) && !isNaN(get_run_type)){
			if(get_run_time >= 0 && get_run_type >= 0){
				//get_run_time;//设置运行时间
				lock_rcode = crypto_aes_encryption(mac_address,getRandomInt(1,999999999999999).toString());//从新生成随机值
				return {time:get_run_time,type:get_run_type};
			}
		}
	}else{
		return null;
	}
}

// console.log(get_device_lock("password")); //获取设备码
//
// console.log(update_run_count("88d25d782fb73ed3f7c0d16f8202ef4529b0d58f6e84c61f795599f2505ccd3eca005f286abfc8f1c765d9df491833bb180e374acc9bf910a7c55972cf8f1e9d247eb2c603db2d2c248c6d6be8f442642b25c6142bb2536e2b36ac02102bf558f92870bbeb2b94a78130f71a837ce5360a8377eab735ae7965c45283ba1a71f9")); //解析激活码key
