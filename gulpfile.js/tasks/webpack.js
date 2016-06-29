// var config        = require('../config');
var gulp          = require('gulp');
var gutil         = require('gulp-util');
var webpack       = require('webpack');

// var webpackConfig = require('./webpack/webpack-config');
var webpackConfig = require('../../webpack-config');
var webpackTasks = function(callback) {
  webpack(webpackConfig, function(err, stats) {
    if(err) throw new gutil.PluginError("[webpack]", err);
    // gutil.log("[webpack]", stats.toString({
    //     colors: true
    // }));
    callback();
  });
};

gulp.task('webpack', webpackTasks);
