# Gopher Express

[Express](http://expressjs.com) is the de-facto standard for a light weight web framework in node.js, but sometimes it might be nice to include just a tiny bit more in terms of default configuration and behavior. That's what Gopher Express is for.

## Installation

    npm install --save gopher

This will pull down compatible express and EJS versions if they're not already a part of your project.

## Usage

One goal was to provide useful default configuration, based on the opinions I became accustomed to in the [Sinatra world](http://www.sinatrarb.com/):

    var app = require('gopher');

    app.get('/', function(request, response) {
        response.send('hello world!');
    });

This does a couple of things by default:

* Creates a pre-configured express app as the base module object
* Creates and starts an HTTP server with the given express app on `process.nextTick` (can override this with a config setting)

## Configuration Choices

Defaults to including the middleware you probably want, including POST data parsers for form-encoded and JSON bodies.

## Dependencies

Gopher assumes that you will use Express 3.x (as of this writing) and EJS as the default templating engine.