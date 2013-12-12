var express = require('express'),
    http = require('http'),
    path = require('path');

// Create global app object
var app = express();

// Create an HTTP server for use with our app, and hang it off the app instance
var server = http.createServer(app);
app.httpServer = server;

// Create some config that the user can override
app.set('gopher.autostart', true);
app.set('gopher.middleware', true);

// Normal express config defaults
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'ejs');

// Start the HTTP server with configured settings
var serverStarted;
app.startServer = function() {
    if (!serverStarted) {
        server.listen(app.get('port'), function() {
            serverStarted = true;
            console.log('Express server listening on port ' + app.get('port'));
        });
    }
};

// Auto mount middleware and start the HTTP server on nextTick
process.nextTick(function() {
    if (app.get('gopher.middleware')) {
        // Middleware stuff you probably want - TODO: Allow user to prevent 
        // mounting specific middleware
        app.use(express.logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded());
        app.use(express.methodOverride());
        app.use(app.router);
        app.use(express.static(path.join(process.cwd(), 'public')));

        if ('development' == app.get('env')) {
            app.use(express.errorHandler());
        }
    }

    // Auto-start HTTP server unless told otherwise...
    if (app.get('gopher.autostart')) {
        app.startServer();
    }
});

// Export the express app as the module interface
module.exports = app;