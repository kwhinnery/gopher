var fs = require('fs'),
    http = require('http'),
    path = require('path'),
    methods = require('methods'),
    express = require('express'),
    browserify = require('browserify'),
    less = require('less-middleware');
    isProduction = process.env.NODE_ENV === 'production'

// Create global app object
var app = express();

// Create object to contain browserified source in memory, so we don't 
// rebrowserify every file
var browserified = {};

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
app.set('gopher.browserify.options', {
    debug: !isProduction
});
app.set('gopher.less', true);

// Normal express config defaults
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'jade');

// Start the HTTP server with configured settings
var serverStarted;
app.startServer = function() {
    if (!serverStarted) {
        app.httpServer.listen(app.get('port'), function() {
            serverStarted = true;
            console.log('Gopher Express server listening on port ' + app.get('port'));
        });
    }
};

// Auto mount middleware on nextTick and auto start server
process.nextTick(function() {
    // Auto-less-compile process.cwd()+/public
    if (app.get('gopher.less')) {
        app.use(less(process.cwd()+'/public', {
            force: !isProduction
        }));
    }

    // Configure standard Express middleware
    if (app.get('gopher.middleware')) {
        // Middleware stuff you probably want - TODO: Allow user to prevent 
        // mounting specific middleware

        app.use(require('morgan')('dev'));
        app.use(require('body-parser').urlencoded({ 
            extended: false 
        }));
        app.use(require('method-override')());
        app.use(express.static(path.join(process.cwd(), 'public')));

        if ('development' == app.get('env')) {
            app.use(require('errorhandler')());
        }
    }

    // Auto-browserify any file from the "browser" directory
    if (app.get('gopher.browserify')) {
        app.get('/browser/:filename.js', function(request, response, next) {
            var filename = request.param('filename');

            // Send the in-memory JS code back to the client
            function send(f) {
                response.type('application/javascript');
                response.send(f);
            }

            // If we've already browserified this file, just cache it
            if (browserified[filename]) {
                send(browserified[filename]);
            } else {
                var src = path.join(process.cwd(), 'browser', filename+'.js');

                // Grab the requested source file if it exists
                if (fs.existsSync(src)) {
                    // Load browserification options
                    var opts = app.get('gopher.browserify.options');

                    // Browserify the requested file and serve it up
                    var b = browserify(opts);
                    b.add(src);


                    // Uglify for non-dev builds
                    if (!opts.debug) {
                        b.transform({
                            global: true
                        }, 'uglifyify');
                    }

                    // create bundle and store in memory
                    b.bundle(function(err, src) {
                        if (!err) {
                            // Cache output if in production
                            if (isProduction) {
                                browserified[filename] = src;
                            }
                            send(src);
                        } else {
                            response.send(500, err);
                        }
                    });
                } else {
                    next();
                }
            }
        });
    }

    // Auto-start HTTP server unless told otherwise...
    if (app.get('gopher.autostart')) {
        app.startServer();
    }
});

// Export the express app as the module interface
module.exports = app;