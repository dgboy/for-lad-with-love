var request = require('request');

var URL = '';

request(URL, function (err, res, body) {
    if (err) throw err;
    console.log(body);
    console.log(res.statusCode);
});
