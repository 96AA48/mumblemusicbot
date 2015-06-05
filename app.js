"use strict";

var lame = require('lame');
var mumble = require('mumble');
var yt = require('youtube-search');
var dl = require('youtube-dl');
var fs = require('fs');

var lastresults = [];

mumble.connect('mumble://wallpiece:9648', function(error, client) {
    if(error) { throw new Error(error); }

    client.authenticate('MusicBot', 'yolo');
    client.on('initialized', function () {
        start(client);
    });
});

var start = function(client) {
    var input = client.inputStream();
    var decoder = new lame.Decoder();

    client.on('textMessage', function (data) {
      var command = data.message.split(' ');

      if (command[0] == '/join') {
        client.channelById(client.userBySession(data.actor).channel.id).join();
      }
      else if (command[0] == '/select'){
        if (command[1] && parseInt(command[1]) != NaN) {
          if (lastresults.length > 0) {
            command[1] = parseInt(command[1]);
            dl.exec(lastresults[command[1]].link, ['-x', '--audio-format', 'mp3', '-o', 'music/%(title)s.%(ext)s'], {}, function(err, output) {
              if (err) throw err;
              play(client, lastresults[command[1]].title);
            });
          }
          else {
            sendMessage(client, 'You didn\'t do a song lookup yet, try /play (&lt;songname&gt;). Or you didn\'t fill in a number.');
          }
        }
        else {
          sendMessage(client, 'You need to specify which song you want to play : (&lt;songnumber&gt;)')
        }
      }
      else if (command[0] == '/play') {
        if (command[1]) {
          if (command[1].substr(0,6) == 'http://' || command[1].substr(0, 7) == 'https://') {

          }
          else if (command[1] == 'offline') {
          }
          else {
            command.splice(0,1);
            yt(command.join(' '), {key: fs.readFileSync('apikey').toString()}, function (err, results) {
              lastresults = results;
              if (err) console.warn(err);
              var list = '<br><span style="color:green;">What song do you wanna play?</span><br>';
              for (var i = 0; i < results.length; i++) {
                list += '<span style="color:cyan;">[</span>' + i +'<span style="color:cyan;">]</span> ' + results[i].title + '<br>';

              }
              list += '<br><span style="color:green">Type what song you want with /select <span style="color:red">&lt;number of the song&gt;</span></span>'
              sendMessage(client, list);
            });
          }
        }
        else {
          sendMessage(client, 'You need to specify what you would want to play : (offline/&lt;songname&gt;/&lt;youtubelink&gt;)');
        }
      }

      console.log(data);

    });

    function sendMessage(client, message) {
      client.sendMessage('TextMessage', {'message': message, channelId: [client.user.channel.id]})
    }

    function play(client, song) {
        var stream;
        decoder.on( 'format', function(format) {
            stream.pipe(client.inputStream({
                channels: format.channels,
                sampleRate: format.sampleRate,
                gain: 0.1
            }));
        });

        stream = require('fs').createReadStream(__dirname + '/music/' + song + '.mp3').pipe(decoder);
    }

};
