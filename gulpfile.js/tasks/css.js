var config       = require('../config');
if(!config.tasks.css || !config.tasks.css.enable) return;

var gulp         = require('gulp');
var gulpif       = require('gulp-if');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps   = require('gulp-sourcemaps');
var cssnano      = require('gulp-cssnano');
var path         = require('path');
var bs           = require('browser-sync');
var handleErrors = require('../lib/handleErrors');

var paths = {
  devSrc: path.join(config.root.devSrc, config.tasks.css.devSrc, '/**/*.{' + config.tasks.css.extensions + '}'),
  distSrc: path.join(config.root.distSrc, config.tasks.css.distSrc)
};

var cssTask = () => {
	return gulp.src(paths.devSrc)
		.pipe(gulpif(!global.production, sourcemaps.init()))
		.pipe(sass(config.tasks.css.sass))
		.on('error', handleErrors)
		.pipe(autoprefixer(config.tasks.css.autoprefixer))
		.pipe(gulpif(global.production, cssnano()))
		.pipe(gulpif(!global.production, sourcemaps.write()))
		.pipe(gulp.dest(paths.distSrc))
		.pipe(bs.stream())
};

gulp.task('css', cssTask);
module.exports = cssTask;