//yt.js
var search = require('youtube-search');
var dl = require('youtube-dl');
var fs = require('fs');

search('low leaf as one', {key: fs.readFileSync('apikey').toString()}, function (err, results) {
  if (err) console.warn(err);
  console.log(results[0].link)
  dl.exec(results[0].link, ['-x', '--audio-format', 'mp3', '-o', 'music/%(title)s.%(ext)s'], {}, function(err, output) {
  if (err) throw err;
  console.log(output);
});

})
