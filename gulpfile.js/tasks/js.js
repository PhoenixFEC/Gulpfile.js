var config = require('../config');
if(!config.tasks.js || !config.tasks.js.enable) return;

var gulp = require('gulp');
var gulpif = require('gulp-if');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
// var concat = require('gulp-concat');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var bs = require('browser-sync');
var path = require('path');
var handleErrors = require('../lib/handleErrors');

var paths = {
	devSrc: path.join(config.root.devSrc, config.tasks.js.devSrc, '**/*.{' + config.tasks.js.extensions + '}'),
	distSrc: path.join(config.root.distSrc, config.tasks.js.distSrc)
}

var jsTask = function() {
	return gulp.src(paths.devSrc)
	    .pipe(jshint())
	    .pipe(jshint.reporter('default'))
	    .pipe(gulpif(global.production, uglify()))
	    .pipe(gulp.dest(paths.distSrc))
	    .on('error', handleErrors)
};

gulp.task('js', jsTask);
module.exports = jsTask;