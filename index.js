//Mumsix, mumble music bot
var mumble = require('mumble');
var GS = require('grooveshark-streaming');
var fs = require('fs');

var options = {
	key : fs.readFileSync(__dirname + '/private.pem'),
	cert : fs.readFileSync(__dirname + '/public.pem')
}

console.log('Connecting');
mumble.connect('mumble://wallpiece:9648', options, function (err, res) {
	if (err) throw new Error(err);

	res.authenticate('MusicBot', 'yolo');

	res.on('initialized', function () {
		console.log('Connected!');
	});

    // On text message...
    res.on( 'textMessage', function (data) {
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

function grooveshark() {

}