var assert = require('assert'),
    request = require('request');

module.exports = function(app) {
    var tests = 0;

    // Test XML generating EJS view
    request('http://localhost:3000/xml', function(err, response, body) {
        assert(!err);
        assert(body === '<foo>bar</foo>');
        assert(response.headers['content-type'] === 'text/xml');
        tests++;
    });

    // Test a POST request and prameter serialization in middleware
    request({
        url:'http://localhost:3000/test',
        method:'POST',
        form: {
            foo:'bar'
        }
    }, function(err, response, body) {
        var responseBody = JSON.parse(body);
        assert(responseBody.foo === 'bar');
        tests++;
    });

    var timer = setInterval(function() {
        if (tests > 1) {
            app.httpServer.close();
            clearInterval(timer);
        }
    },20);
};