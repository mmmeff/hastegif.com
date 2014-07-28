var config = require('config');
var express = require('express');
var request = require('request');
var giphy = require('./services/giphy');
var gifme = require('./services/gifme');

var app = express();

app.get('/', function (req, res) {
  res.send('hello! Try hitting /:query to see the top gif online for that query. Front end coming soon');
});

app.get('/404.gif', function (req, res) {
  res.sendfile(__dirname + '/static/images/404.gif');
});

app.get('/:query:format(.gif)?', function (req, res) {
  var q;
  q = req.param('query');

  giphy.top(q, function (giphyTopHit) {
    if (typeof giphyTopHit !== 'undefined') {
      request.get(giphyTopHit.images.original.url).pipe(res);
    } else { // got nothing from giphy - let's try gifme
      gifme.top(q, function (gifmeTopHit) {
        if (typeof gifmeTopHit !== 'undefined') {
          request.get(gifmeTopHit.link).pipe(res);
        } else {
          // give up, fallback to nothing found image
          res.redirect('/404.gif');
        }
      });
    }
  });
});


var server = app.listen(config.port, function() {
  console.log('Listening on port %d', server.address().port);
});
