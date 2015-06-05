"use strict";

var lame = require('lame');
var mumble = require('mumble');

mumble.connect('mumble://wallpiece:9648', function(error, client) {
    if(error) { throw new Error(error); }

    client.authenticate('MusicBot', 'yolo');
    client.on('initialized', function () {
        start(client);
    });
});

var start = function( client ) {
    var input = client.inputStream();
    var decoder = new lame.Decoder();

    client.channelByName('Gaming').join()

    client.on('textMessage', function (data) {
      // console.log(client.userBySession(data.session[0]));
      if (data.message == 'play') {
        var stream;
        decoder.on( 'format', function( format ) {
            // console.log( format );

            stream.pipe( client.inputStream({
                channels: format.channels,
                sampleRate: format.sampleRate,
                gain: 0.1
            }));
        });

        stream = require('fs').createReadStream(__dirname + '/test.mp3').pipe( decoder );
      }
      client.channelByName('Gaming').join()
      // if (data.)
      // client.sendMessage('Received message');
    });

};
