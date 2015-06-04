"use strict";

var lame = require('lame');
var mumble = require('mumble');

mumble.connect('mumble://wallpiece:9648', function( error, client ) {
    if( error ) { throw new Error( error ); }

    client.authenticate('MusicBot', 'yolo');
    client.on( 'initialized', function() {
        start( client );
    });
});

var start = function( client ) {
    // client.outputStream().pipe(client.inputStream());
    var input = client.inputStream();
    var decoder = new lame.Decoder();

    var stream;
    decoder.on( 'format', function( format ) {
        console.log( format );

        stream.pipe( client.inputStream({
            channels: format.channels,
            sampleRate: format.sampleRate,
            gain: 1
        }));
    });

    stream = require('fs').createReadStream(__dirname + '/test.mp3').pipe( decoder );
};
