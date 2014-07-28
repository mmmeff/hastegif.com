var request = require('request');
var cache = require('memory-cache');

var apiKey = 'rX7kbMzkGu7WJwvG'; // global key for API beta
var apiUrl = 'http://api.gifme.io/v1/';
var cacheLife = 1000 * 60 * 60 * 12; // 12 hours

var _buildQueryString = function (parts) {
  var buffer = '?';
  parts.unshift('key=' + apiKey);
  buffer += parts.join('&');
  return buffer;
};

var search = function (query, cb) {
  var url;
  url = apiUrl + 'search' + _buildQueryString([
    'query=' + query,
    'limit=20',
    'page=0'
  ]);

  if (cache.get(url)) {
    cb(cache.get(url));
  } else {
    request(url, function (err, resp, body) {
      var results = body.data || [];
      cache.put(url, results, cacheLife);
      cb(results);
    });
  }
};

var top = function (query, cb) {
  search(query, function (results) {
    cb(results[0]);
  });
};

exports.search = search;
exports.top = top;
