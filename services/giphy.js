var request = require('request');
var cache = require('memory-cache');

var apiKey = 'dc6zaTOxFJmzC'; // global key for API beta
var apiUrl = 'http://api.giphy.com/v1/gifs/';
var cacheLife = 1000 * 60 * 10; // 10 minutes

var _buildQueryString = function (parts) {
  var buffer = '?';
  parts.unshift('api_key=' + apiKey);
  buffer += parts.join('&');
  return buffer;
};

var search = function (query, cb) {
  var url;
  url = apiUrl + 'search' + _buildQueryString(['q=' + query]);

  if (cache.get(url)) {
    cb(cache.get(url));
  } else {
    request(url, function (err, resp, body) {
      var results = JSON.parse(body).data;
      cache.put(url, results, cacheLife);
      cb(results);
    });
  }
};

var top = function (query, cb) {
  search(query, function (results) {
    cb((results.length > 0) ? results[0] : null);
  });
};

var random = function (query, cb) {
  search(query, function (results) {
    cb(
      (results.length > 0)
      ? results[Math.floor(Math.random() * (results.length))]
      : null
    );
  });
};

exports.search = search;
exports.top = top;
exports.random = random;
