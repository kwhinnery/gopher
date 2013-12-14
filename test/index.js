var path = require('path');
process.chdir(path.join(process.cwd(),'test'));

var app = require('../index');

// Set up a few test route handlers
app.post('/test', function(request, response) {
    response.send(request.body);
});

app.get('/xml', function(request, response) {
    response.type('text/xml');
    response.render('xml', { content:'bar' });
});

// require actual tests once the server is started
setTimeout(function() {
    require('./basic')(app);
},10);