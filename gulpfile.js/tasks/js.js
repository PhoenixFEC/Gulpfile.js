var config = require('../config');
if(!config.tasks.js) return;

var gulp   = require('gulp');
var gulpif = require('gulp-if');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var path   = require('path');

var paths = {
  devSrc: path.join(config.root.devSrcDir, config.root.devAssetsDir, config.tasks.js.devSrc, '/**/*.{js, json}'),
  distSrc: path.join(config.root.distSrcDir, config.root.distAssetsDir, config.tasks.js.distSrc)
};
var ignoreComponents = '!' + path.join(config.root.devSrcDir, config.root.devAssetsDir, config.tasks.js.devSrc, '/components/**');
var ignoreReactJS = '!' + path.join(config.root.devSrcDir, config.root.devAssetsDir, config.tasks.js.devSrc, '/R/**');
var jsTask = function() {
	return gulp.src([paths.devSrc, ignoreComponents, ignoreReactJS])
	    .pipe(jshint())
	    .pipe(jshint.reporter('default'))
	    .pipe(gulpif(global.production, uglify().on('error', function(e){
            console.log(e);
         })))
	    .pipe(gulp.dest(paths.distSrc));
};

gulp.task('js', jsTask);
module.exports = jsTask;