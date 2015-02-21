//Mumsix, mumble music bot
var mumble = require('mumble');
var GS = require('grooveshark-streaming');
var fs = require('fs');
var http = require('http');
var lame = require('lame');
var wav = require('wav');

var connection;

var options = {
	key : fs.readFileSync(__dirname + '/private.pem'),
	cert : fs.readFileSync(__dirname + '/public.pem')
}

console.log('Connecting');
mumble.connect('mumble://wallpiece:9648', options, function (err, res) {
	if (err) throw new Error(err);
	connection = res;

	res.authenticate('MusicBot', 'yolo');

	res.on('initialized', function () {
		console.log('Connected!');
		// var speaker = new require('speaker')();
		// var decoder = new lame.Decoder();

		// fs.createReadStream(__dirname + '/song.mp3').pipe(decoder).pipe(res.inputStream());
		play();
	});
	// message('Hey there, I\'m music bot!');


    // On text message...	
    res.on( 'textMessage', function (data) {
    	console.log(data);
    	if (data.message.split(' ')[0] == '/m' || data.message.split(' ')[0] == '/music') {
    		var command = data.message.split(' ').splice(1);
    		if (command[0] == 'g' || command[0] == 'grooveshark') {
    			grooveshark(command);
    		}
    	}
    });

    // res.on( 'voice', function (event) {
    //     console.log( 'Mixed voice' );
    //     var pcmData = event.data;
    // });
});

function message(message) {
	console.log('sending message', message);
	connection.sendMessage('TextMessage', {'message': message, channelId: [0]});
}

function grooveshark(command) {
	var lookup = command.splice(1).join(' ');

	GS.Tinysong.getSongInfo(lookup, null, function (err, info) {
		GS.Grooveshark.getStreamingUrl(info.SongID, function (err, url) {
			if (fs.existsSync(__dirname + '/song.mp3')) fs.unlinkSync(__dirname + '/song.mp3');
			message('Got the song, downloading it now!');
			http.get(url, function (res) {

				res.on("data", function (data){
					if (fs.existsSync(__dirname + '/song.mp3')) {
						fs.appendFileSync(__dirname + '/song.mp3', data);
					}
					else {
						fs.writeFileSync(__dirname + '/song.mp3', data);
					}
				});

			res.on('end', function () {
					play(__dirname + '/song.mp3');
					message('Done downloading song!');
				})
			})
		});
	});
}

function play(song) {
	var speaker = new require('speaker')();
	var decoder = new lame.Decoder();
	
	var spawn = require('child_process').spawn;
	var speex = spawn('speexenc', ['-', '-', '--rate 48000', '--16bit']);

	fs.createReadStream(__dirname + '/song.mp3').pipe(decoder);//.pipe(speex.stdin);


	decoder.on('format', onFormat);

	function onFormat (format) {
		console.error('MP3 format: %j', format);

		// write the decoded MP3 data into a WAV file
		var writer = new wav.Writer(format);
		decoder.pipe(writer).pipe(speex.stdin);
	}
	
	speex.stdout.pipe(connection.inputStream());

	// enogg.pipe(speaker);

	// fs.createReadStream(__dirname + '/song.mp3').pipe(decoder).pipe(speaker);
}