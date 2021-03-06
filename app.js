/**
 * Module dependencies
 */
var express = require('express'),
  routes = require('./controllers/index'),
  survey = require('./controllers/api/survey'),
  local = require('./controllers/api/local'),
  http = require('http'),
  path = require('path'),
  hoganExpress = require('hogan-express');

var app = module.exports = express();

/**
 * Configuration
 */

/** All environments */
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.set('layout', 'layout/layout'); //rendering by default

// add partials to be used here
app.set('partials', {
    head: "layout/header",
    foot: "layout/footer",
});
app.engine('html', hoganExpress);
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());

/** Simple session storage */
app.use(express.session({secret: 'vkjHei93bjbf48GH84jjeU'}));

app.use(app.router);

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
};

/**
 * Routes
 */
// serve index and view partials
app.get('/', routes.index);

app.post('/api/0/survey/:survey_id/activity/:activity_id', survey.increment);
app.post('/api/0/survey', survey.create);
app.get('/api/0/local/:location/:query/:limit', local.collection);


app.get('/templates/:name', routes.templates);
app.get('/templates/:directory/:name', routes.subtemplates);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

/**
 * Start Server
 */
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
