var config       = require('../config');
if(!config.tasks.css) return;

var gulp         = require('gulp');
var gulpif       = require('gulp-if');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps   = require('gulp-sourcemaps');
var cssnano      = require('gulp-cssnano');
// var rev          = require('gulp-rev');
var path         = require('path');
var bs           = require('browser-sync');
var handleErrors = require('../lib/handleErrors');

var paths = {
  devSrc: path.join(config.root.devSrcDir, config.root.devAssetsDir, config.tasks.css.devSrc, '/**/*.{' + config.tasks.css.extensions + '}'),
  distSrc: path.join(config.root.distSrcDir, config.root.distAssetsDir, config.tasks.css.distSrc)
};

var cssTask = () => {
  return gulp.src(paths.devSrc)
    .pipe(gulpif(!global.production, sourcemaps.init()))
    .pipe(sass())
    .on('error', handleErrors)
    .pipe(autoprefixer(config.tasks.css.autoprefixer))
    .pipe(gulpif(global.production, cssnano()))
    // .pipe(rev())
    .pipe(gulpif(!global.production, sourcemaps.write()))
    .pipe(gulp.dest(paths.distSrc))
    // .pipe(rev.manifest({
    //   merge: true
    // }))
    // .pipe(gulp.dest(config.root.distSrcDir))
    .pipe(bs.stream({match: "**/*.css"}))
};

gulp.task('css', cssTask);
module.exports = cssTask;