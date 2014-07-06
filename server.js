var config = require('config');
var express = require('express');
var request = require('request');
var cache = require('memory-cache');
var giphy = require('./services/giphy');

var app = express();

app.get('/', function (req, res) {
  res.send('hello! Try hitting /query');
});

app.get('/:query', function (req, res) {
  giphy.search(req.param('query'), function (results) {
    request.get(results[0].images.original.url).pipe(res);
  });
});

app.get('/top/:query', function (req, res) {
  giphy.top(req.param('query'), function (result) {
    request.get(result.images.original.url).pipe(res);
  });
});

app.get('/random/:query', function (req, res) {
  giphy.random(req.param('query'), function (result) {
    request.get(result.images.original.url).pipe(res);
  });
});

var server = app.listen(config.port, function() {
  console.log('Listening on port %d', server.address().port);
});
