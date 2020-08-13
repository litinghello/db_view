
const { execFile , spawn ,execSync, execFileSync ,spawnSync} = require('child_process');
const WavEncoder = require("wav-encoder");//wav文件编码
const request = require('request');//node
const fs = require("fs");//wav文件编码

//创建正玄波的文件
//Sample_Rate 采样率 Sinewav_Rate 波形频率 Peak_Value峰峰值 Period 个采样周期
function generate_second_sinew(parameters) {
    let {Sample_Rate, Sinew_Rate, Peak_Value, Period} = parameters;
    let sine_steps = (2 * Math.PI * Sinew_Rate) / Sample_Rate;
    let sine_angle = 0;
    return new Float32Array(Sample_Rate * Period).map(()=> Math.sin(sine_angle += sine_steps) * Peak_Value );
}
//获取音乐信息
function get_music_time(music_name){
    let music_infor = execFileSync('ffprobe.exe', ["-v","quiet","-print_format","json","-show_format",music_name],{});
    return Math.ceil(JSON.parse(music_infor).format.duration);
}

let ffmpeg_status = false;
//转码音乐
function wav_to_ogg(input_wav,output_ogg,loop,reback)  {
    system_message_display("编码处理");
    if(ffmpeg_status === true){
        return false;
    }else {
        ffmpeg_status = true;//设置为正在处理
        try{
            fs.unlinkSync(output_ogg);//同步删除文件
        }catch(err){
        }
		//ffmpeg -stream_loop 10 -i 1.wav -af "pan=octagonal|FL=c0|FR=c2|FC=c1|BL=c7|BR=c5|BC=c6|SL=c3|SR=c4" out1.ogg
        let spawn_ffmpeg = execFile("ffmpeg.exe", ["-stream_loop",loop,"-i",input_wav,"-af","pan=octagonal|FL=c0|FR=c2|FC=c1|BL=c7|BR=c5|BC=c6|SL=c3|SR=c4",output_ogg],{maxBuffer:200*1024*1024});
        //let spawn_ffmpeg = execFile(path.join(__dirname, '..', '/ffmpeg.exe'), ["-stream_loop",loop,"-i",input_wav,"-c","libvorbis",output_ogg],{maxBuffer:200*1024});
        spawn_ffmpeg.on('exit',(code,signal) =>{
            ffmpeg_status = false;
            system_message_close();
            reback();
        });
        spawn_ffmpeg.stderr.on('data', (data) => {
           //console.log(`stderr: ${data}`);//出现错误输出
            let time = data.substr(data.indexOf("time=")+5,8);
            let time_a = time.split(":");
            if(time_a.length === 3){
                let pro_time = parseInt(time_a[0])*60*60+parseInt(time_a[1])*60+parseInt(time_a[2]);
                let percentComplete = Math.round(pro_time * 100 / loop);
                system_message_update("进度："+percentComplete+"%");
            }
        });
        return true;
    }
}

//创建正玄波信号
function create_music_energy_file(music_class,sample_rate,music_energy,music_time,output_name,reback){
	let Wave_Data = {
		sampleRate: sample_rate,
		channelData: [
			generate_second_sinew({
				Sample_Rate: sample_rate,
				Sinew_Rate: music_energy[0],
				Peak_Value: music_energy[1] / 100,
				Period: 1
			}),
			generate_second_sinew({
				Sample_Rate: sample_rate,
				Sinew_Rate: music_energy[2],
				Peak_Value: music_energy[3] / 100,
				Period: 1
			}),
			generate_second_sinew({
				Sample_Rate: sample_rate,
				Sinew_Rate: music_energy[4],
				Peak_Value: music_energy[5] / 100,
				Period: 1
			}),
			generate_second_sinew({
				Sample_Rate: sample_rate,
				Sinew_Rate: music_energy[6],
				Peak_Value: music_energy[7] / 100,
				Period: 1
			}),
			generate_second_sinew({
				Sample_Rate: sample_rate,
				Sinew_Rate: music_energy[8],
				Peak_Value: music_energy[9] / 100,
				Period: 1
			}),
			generate_second_sinew({
				Sample_Rate: sample_rate,
				Sinew_Rate: music_energy[10],
				Peak_Value: music_energy[11] / 100,
				Period: 1
			}),
			generate_second_sinew({
				Sample_Rate: sample_rate,
				Sinew_Rate: music_energy[12],
				Peak_Value: music_energy[13] / 100,
				Period: 1
			}),
			generate_second_sinew({
				Sample_Rate: sample_rate,
				Sinew_Rate: music_energy[14],
				Peak_Value: music_energy[15] / 100,
				Period: 1
			})
		]
	};
	let output_path = "./";
	let temp_name = "temp";
	WavEncoder.encode(Wave_Data).then((buffer) => {
		try {
			fs.writeFileSync(output_path+temp_name+".wav",new Buffer(buffer));//写入文件
		}catch (err){
			return 0;
		}
	});
    try{
        fs.unlinkSync(output_path+output_name+".ogg");//同步删除文件
    }catch(err){
    }
	wav_to_ogg(output_path+temp_name+".wav",output_path+output_name+".ogg",music_time,function(){
		fs.unlink(output_path+temp_name+".wav",(error)=>{//转化成功删除文件
			if(error){
				console.log("error");
			}
		});
        reback();//
	});
}
//混合音乐
function music_a_sinew_mixing(file_time,stereo,hexagonal,output_name,result){
    system_message_display("压缩");
    try{
        fs.unlinkSync(output_name);//同步删除文件
    }catch(err){
    }
    //ffmpeg -i input.wav -af "pan=octagonal|FL=c0|FR=c2|FC=c1|BL=c7|BR=c5|BC=c6|SL=c3|SR=c4" output.ogg
    //let spawn_ffmpeg = execFile('ffmpeg.exe', ["-i",hexagonal,"-i",stereo,"-filter_complex","[0:a][1:a]amerge=inputs=2,pan=octagonal|FL=c0|FR=c2|FC=c1|BL=c7|BR=c5|BC=c6|SL=c3|SR=c4[aout]","-map","[aout]",output_name],{});
    let spawn_ffmpeg = execFile('ffmpeg.exe', ["-i",hexagonal,"-i",stereo,"-filter_complex","[0:a][1:a]amerge=inputs=2,pan=octagonal|FL=c8|FR=c1|FC=c9|BL=c3|BR=c4|BC=c5|SL=c6|SR=c7[aout]","-map","[aout]",output_name],{});
    //let spawn_ffmpeg = execFile('ffmpeg.exe', ["-i",hexagonal,"-i",stereo,"-filter_complex","[0:a][1:a]amerge=inputs=2,pan=octagonal|FL=c8|FR=c9|FC=c2|BL=c3|BR=c4|BC=c5|SL=c6|SR=c7[aout]","-map","[aout]",output_name],{});
    spawn_ffmpeg.on('exit',(code,signal) =>{
        fs.unlink(hexagonal,function(error){});//异步删除文件
        ffmpeg_status = false;
        system_message_close();
        result();
    });
    spawn_ffmpeg.stderr.on('data', (data) => {
        //console.log(`stderr: ${data}`);//出现错误输出
		let time = data.substr(data.indexOf("time=")+5,8);
        let time_a = time.split(":");
        if(time_a.length === 3){
            let pro_time = parseInt(time_a[0])*60*60+parseInt(time_a[1])*60+parseInt(time_a[2]);
            let percentComplete = Math.round(pro_time * 100 / file_time);
            system_message_update("进度"+percentComplete+"%");
        }
    });
}
//上传文件到服务器 通过node js调用
function upload_file_to_server(url,file_path,file_name,reback){
    request.post({url:url, formData: {
            music_file: fs.createReadStream(file_path+file_name)
        }}, function(err, httpResponse, body) {
            system_message_close();
        if (err) {
            console.log('upload failed:', err);
            system_prompt_display("上传["+decodeURI(file_name)+"]中断");
        }else{
            console.log('Upload successful!  Server responded with:', body);
            let result = JSON.parse(body);
            if(result.status === 0){
                system_prompt_display("上传["+decodeURI(file_name)+"]完成");
                reback();
            }else if(result.status === 4){
                system_prompt_display("文件["+decodeURI(file_name)+"]已存在");
            }else{
                system_prompt_display("上传["+decodeURI(file_name)+"]错误");
            }
        }
        fs.unlink(file_path+file_name,function(error){});//异步删除文件
    });
}
/*
let sample_rate = 44100;
let music_energy = ["1000","100","1000","100","1000","100","1000","100","1000","100","1000","100","1000","100","1000","100"];
let save_name = encodeURI("中文", "UTF-8"); ;
let server_url = "http://192.168.208.128:8000";
let music_class = "class1/subclass1";
upload_music_energy_file(sample_rate,music_energy,100,save_name,server_url,music_class);
*/