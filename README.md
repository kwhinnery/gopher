# Gopher Express

[Express](http://expressjs.com) is the de-facto standard for a light weight web framework in node.js, but sometimes it might be nice to include just a bit more in terms of default configuration and behavior. That's what Gopher Express is for.

## Installation

    npm install --save gopher

This will install [express](http://expressjs.com) and [EJS](https://github.com/visionmedia/ejs) as [peer dependencies](http://blog.nodejs.org/2013/02/07/peer-dependencies/) if they're not already a part of your project.  Check `package.json` for the current supported versions.

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
* `app.set('gopher.autostart', true)` : automatically start the created HTTP server
* `app.set('gopher.middleware', true);` : automatically mount default middleware
* `app.set('gopher.browserify', true);` : enable browserify middleware (see below)
* `app.set('gopher.browserify.options', { debug: process.env.NODE_ENV !== 'production' });` : options passed to the browserify `bundle` command. Setting debug to false will also have the effect of uglifying your browserify bundle  
* `app.set('gopher.less', true);` : Enable Less CSS middleware (see below)

#### Browserify (experimental feature, API not fully baked)
Gopher will automatically use [browserify](https://github.com/substack/node-browserify) browserify and then serve any JS files in your project's `browser` directory. Gopher sets up a route for `/browser/:filename.js`, and will browserify any files found there by that name. 

#### Less CSS (experimental feature, API not fully baked)
Gopher will automatically mount [less-middleware](https://github.com/emberfeather/less.js-middleware).  TL;DR - this middleware will intercept GET requests for *.css.  It will look for .less files in your public directory by the same name. If it finds one, it will Less compile that file and place it in your `public` directory.  The resulting CSS will then be served up by Express' static middleware.

Note that this compilation step will only happen once per node process launch, so during development, any changes to your Less files will not be picked up until the next app launch.  However, you're probably already using [nodemon](https://github.com/remy/nodemon) or something similar to watch your app files for changes and restart your node process, right? If not, start! This will save you lots of time.  Once you start using nodemon, you can monitor both your .js and .less files for changes, and restart your node process when either file type is modified. Start your app like this from now on:

    nodemon -e js,less your_app.js

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
