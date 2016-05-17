var config        = require('../config');
var gulp          = require('gulp');
var gutil         = require('gulp-util');
var sourcemaps    = require('gulp-sourcemaps');
var webpack       = require('webpack');
// var webpackStream = require('webpack-stream');
// var named         = require('vinyl-named');
var through       = require('through2');
var path          = require('path');

var paths = {
  devSrc: [path.join(config.root.devSrc, config.tasks.js.devSrc, '/**/*.{' + config.tasks.js.extensions + '}')],
  distSrc: path.join(config.root.distSrc, config.tasks.js.distSrc),
}
/*var webpackTask = function() {

  return gulp.src(paths.devSrc)
  	.pipe(named())
    .pipe(webpack(webpackConfig, function(err, stats) {
       // Use stats to do more things if needed
        if(err) throw new gutil.PluginError("webpack", err);
        // gutil.log("[webpack]", stats.toString({
        //     color: true
        // }));
    }))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(through.obj(function (file, enc, cb) {
      // Dont pipe through any source map files as it will be handled
      // by gulp-sourcemaps
      var isSourceMap = /\.map$/.test(file.path);
      if (!isSourceMap) this.push(file);
      cb();
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.distSrc));
};*/

// gulp.task('webpack', webpackTask);
// module.exports = webpackTask;

var singleWebpack = function(callback) {
  var env = global.production === true ? 'production' : 'development';
  var webpackConfig = require('./webpack/webpack-config')(env);
  webpack(webpackConfig, function(err, stats) {
   // Use stats to do more things if needed
    if(err) throw new gutil.PluginError("webpack", err);
    // gutil.log("[webpack]", stats.toString({
    //     colors: true
    // }));
    callback();
  });
};

gulp.task('webpack', singleWebpack);
module.exports = singleWebpack;
