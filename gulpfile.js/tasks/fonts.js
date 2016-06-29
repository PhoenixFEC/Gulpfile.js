var config = require('../config');
if(!config.tasks.fonts) return;

var path    = require('path');
var gulp    = require('gulp');
var changed = require('gulp-changed');
var bs      = require('browser-sync');

var paths = {
  devSrc: path.join(config.root.devSrcDir, config.root.devAssetsDir, config.tasks.fonts.devSrc, '/**/*.{' + config.tasks.fonts.extensions + '}'),
  distSrc: path.join(config.root.distSrcDir, config.root.distAssetsDir, config.tasks.fonts.distSrc)
};

var fontsTask = function() {
	return gulp.src([paths.devSrc])
		.pipe(changed(paths.distSrc)) // Ignore unchanged files
		.pipe(gulp.dest(paths.distSrc))
		.pipe(bs.stream())
};

gulp.task('fonts', fontsTask);
module.exports = fontsTask;