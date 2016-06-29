var config = require('../config');
var gulp   = require('gulp');
var zip    = require('gulp-zip');
var path   = require('path');

var paths = {
  devSrc: [path.join(config.root.distSrcDir, '**/*'), '!' + path.join(config.root.distSrcDir, config.tasks.zip.distSrc)],
  distSrc: path.join(config.root.distSrcDir, config.tasks.zip.distSrc)
};

var timestamp = new Date();
var timestamp = '' + timestamp.getFullYear()
	+ (timestamp.getMonth() + 1)
	+ timestamp.getDate()
	+ timestamp.getDate()
	+ timestamp.getHours()
	+ timestamp.getMinutes()
	+ timestamp.getSeconds();
var zipTask = function() {
	return gulp.src(paths.devSrc)
		.pipe(zip('static-resource-' + timestamp + '.zip'))
		.pipe(gulp.dest(paths.distSrc))
};

gulp.task('zip', zipTask);
