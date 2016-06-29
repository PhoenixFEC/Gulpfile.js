var config   = require('../config');
var gulp     = require('gulp');
// var express  = require('express')
// var logger   = require('morgan')
var path     = require('path');

var settings = {
  root: path.resolve(process.cwd(), config.root.distSrcDir),
  host: process.env.HOST || config.root.host,
  port: process.env.PORT || config.root.port,
  logLevel: process.env.NODE_ENV ? process.env.NODE_ENV : 'development',
  staticOptions: {
    extensions: ['html', 'hbs'],
    maxAge: '31556926'
  }
}


const express = require('express');
const logger = require('winston');


//=========================================================
//  SETUP
//---------------------------------------------------------
const PROJECT_ROOT_DIR = process.cwd();
const app = express();

app.set('host', process.env.HOST || settings.host);
app.set('port', process.env.PORT || settings.port);


app.use(require('morgan')('dev'));
app.use(express.static(`${PROJECT_ROOT_DIR}/dist`));

// console.log('[process.cwd]', process.cwd())
//=========================================================
//  ROUTER
//---------------------------------------------------------
const router = new express.Router();

router.get('*', (req, res) => {
  res.sendFile(`${PROJECT_ROOT_DIR}/dist/html/index.html`);
});

app.use(router);


//=========================================================
//  START SERVER
//---------------------------------------------------------
var serverTasks = function() {
  app.listen(app.get('port'), app.get('host'), error => {
    if (error) {
      logger.error(error);
    }
    else {
      logger.info(`Server listening @ ${app.get('host')}:${app.get('port')}`);
    }
  });
};
gulp.task('server', serverTasks);