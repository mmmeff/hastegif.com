var express = require('express');
var request = require('request');
var cache = require('memory-cache');

var app = express();

app.get('/', function (req, res) {
  res.send('hello! Try hitting /query');
});

app.get('/:q', function (req, res) {
  var q,
      url,
      cacheTime;
  q = req.param('q');
  url = 'http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=' + q;
  cacheTime = 1000 * 60 * 10; //10 minutes

  res.set('content-type', 'image/gif');

  // check cache for result, otherwise ping giphy
  if (cache.get(q)) {
    sendImage(cache.get(q), res);
  } else {
    request(url, function (error, response, body) {
      var obj,
          results,
          target,
          gifUrl;
      obj = JSON.parse(body);
      results = obj.data;

      if (results.length < 1) {
        res.send('nothing here.');
      } else {
        target = results[0];

        // get image from giphy
        gifUrl = target.images.original.url;

        // cache result
        cache.put(q, gifUrl, cacheTime);

        sendImage(gifUrl, res);
      }
    });
  }
});

sendImage = function (url, res) {
  request.get(url).pipe(res);
};

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});
