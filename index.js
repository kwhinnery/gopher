var express = require('express'),
    http = require('http'),
    path = require('path'),
    methods = require('methods'),
    browserify = require('browserify-middleware');

// Create global app object
var app = express();

// Create an HTTP server for use with our app, and hang it off the app instance
var server = http.createServer(app);
app.httpServer = server;

// Delay addition of routes because they need to be added *after* the global
// middleware has been set up with app.use. This blows, but is the only way to 
// avoid API cruft when requiring the module.
function monkeyPatch(functionName) {
    var old = app[functionName];
    app[functionName] = function() {
        var args = arguments;
        // Delegate right to old behavior for config getters
        if (functionName === 'get' && arguments.length === 1) {
            return old.apply(app,args);
        } else {
            setTimeout(function() {
                old.apply(app,args);
            },1);
        }
    };
}

// Add wrappers for all router methods
monkeyPatch('all');
methods.forEach(monkeyPatch);

// Create some config that the user can override
app.set('gopher.autostart', true);
app.set('gopher.middleware', true);
app.set('gopher.browserify', true);

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

// Auto mount middleware on nextTick and auto start server after 10ms
process.nextTick(function() {
    console.log(process.cwd());
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

    // Auto-browserify process.cwd()+/browser/index.js
    if (app.get('gopher.browserify')) {
        var browserifySrc = path.join(process.cwd(), 'browser', 'index.js');
        app.use('/main.js', browserify(browserifySrc));
    }

    // Auto-start HTTP server unless told otherwise...
    if (app.get('gopher.autostart')) {
        app.startServer();
    }
});

// Export the express app as the module interface
module.exports = app;