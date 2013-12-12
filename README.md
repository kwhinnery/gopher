# Gopher Express

[Express](http://expressjs.com) is the de-facto standard for a light weight web framework in node.js, but sometimes it might be nice to include just a bit more in terms of default configuration and behavior. That's what Gopher Express is for.

## Installation

    npm install --save gopher

This will pull down compatible [express](http://expressjs.com) and [EJS](https://github.com/visionmedia/ejs) versions if they're not already a part of your project.  Check `package.json` for the current supported versions.

## Usage

    var app = require('gopher');

    app.get('/', function(request, response) {
        response.send('hello world!');
    });

Visit [http://localhost:3000/](http://localhost:3000/).

What happened?

* Creates a pre-configured express app as the base module object
* Creates and starts an HTTP server with the given express app on [`process.nextTick`](http://nodejs.org/api/process.html#process_process_nexttick_callback)

## Configuration

Your Gopher Express app uses the [express app configuration API](http://expressjs.com/api.html#app.set) to store configuration properties for the app.  Here is the default configuration, all of which can be overridden if desired:

#### Standard Express Configuration
* `app.set('view engine', 'ejs');` : Use EJS as the templating engine
* `app.set('views', path.join(process.cwd(), 'views'));` : Views directory is `views` in the webapp directory
* `app.set('port', process.env.PORT || 3000);` : Use an environment variable for the HTTP port, or start up on port 3000

#### Default Middleware
Check these out [here](http://expressjs.com/api.html#middleware).

* `app.use(express.logger('dev'));`
* `app.use(express.json());`
* `app.use(express.urlencoded());`
* `app.use(express.methodOverride());`
* `app.use(app.router);`
* `app.use(express.static(path.join(process.cwd(), 'public')));` : static content goes in `public`
* Development: `app.use(express.errorHandler());`

#### Gopher-specific configuration
* `app.get('gopher.autostart')` : automatically start the created HTTP server
* `app.set('gopher.middleware', true);` : automatically mount default middleware

## API and Module Properties

### require('gopher')

Load the Gopher module, create a pre-configured express web application.

__Returns:__ An express web app

### app.httpServer

An [http server](http://nodejs.org/api/http.html#http_class_http_server) created for the application.

### app.startServer()

Start `app.httpServer` and listen on `app.get('port')` if it hasn't already been started.

## License

MIT