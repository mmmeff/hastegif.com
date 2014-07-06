var request = require('request');

var apiKey = 'dc6zaTOxFJmzC'; // global key for API beta
var apiUrl = 'http://api.giphy.com/v1/gifs/';

var _buildQueryString = function (parts) {
  var buffer = '?';
  parts.unshift('api_key=' + apiKey);
  buffer += parts.join('&');
  return buffer;
};

exports.search = function (query, cb) {
  var url;
  url = apiUrl + 'search' + _buildQueryString(['q=' + query]);

  request(url, function (err, resp, body) {
    cb(JSON.parse(body).data);
  });
};
