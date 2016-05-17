if(global.production) return

var gulp              = require('gulp')
var browserSync       = require('browser-sync')
var config            = require('../config')
var webpack           = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')

var browserSyncTask = function() {

  var webpackConfig = require('./webpack/webpack-config')('development');
  var compiler = webpack(webpackConfig);

  var server = config.tasks.browserSync.server;
  server.middleware = [
    webpackDevMiddleware(compiler, {
      noInfo: true,
      stats: { colors: true },
      publicPath: webpackConfig.output.publicPath
    }),
    webpackHotMiddleware(compiler)
  ]
  browserSync.init(config.tasks.browserSync)
}

gulp.task('browserSync', browserSyncTask)
