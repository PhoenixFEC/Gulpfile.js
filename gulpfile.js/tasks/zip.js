var config = require('../config');
var gulp   = require('gulp');
var zip    = require('gulp-zip');
var del    = require('del');
var path   = require('path');

var paths = {
  devSrc: [path.join(config.root.distSrc, '**/*'), '!' + path.join(config.root.distSrc, config.tasks.zip.distSrc)],
  distSrc: path.join(config.root.distSrc, config.tasks.zip.distSrc)
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
		.pipe(zip('xlobo-static-resource-' + timestamp + '.zip'))
		.pipe(gulp.dest(paths.distSrc))
};

gulp.task('zip', zipTask);
module.exports = zipTask;