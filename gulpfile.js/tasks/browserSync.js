if(global.production) return

var gulp                 = require('gulp');
var browserSync          = require('browser-sync');
var path                 = require('path');
var config               = require('../config');
var webpack              = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');

var browserSyncTask = function() {

  // var webpackConfig = require('./webpack/webpack-config');
  var webpackConfig = require('../../webpack-config');
  var compiler = webpack(webpackConfig);

  var bsConfig = config.tasks.browserSync;
  var server = bsConfig.server;
  server.middleware = [
    webpackDevMiddleware(compiler, webpackConfig.devServer),
    webpackHotMiddleware(compiler)
  ];

  bsConfig.serveStatic = [path.join(config.root.distAssetsDir)];
  bsConfig.startPath = path.join(config.tasks.html.distSrc);

  browserSync.init(bsConfig);
};

gulp.task('browserSync', browserSyncTask);
