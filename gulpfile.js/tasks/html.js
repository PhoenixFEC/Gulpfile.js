var config       = require('../config')
if(!config.tasks.html || !config.tasks.html.enable) return

var browserSync  = require('browser-sync')
var gulp         = require('gulp')
var gulpif       = require('gulp-if')
var htmlmin      = require('gulp-htmlmin')
var path         = require('path')

var exclude = path.normalize('!**/{' + config.tasks.html.excludeFolders.join(',') + '}/**')

var paths = {
  devSrc: [path.join(config.root.devSrc, config.tasks.html.devSrc, '/**/*.{' + config.tasks.html.extensions + '}'), exclude],
  distSrc: path.join(config.tasks.html.distSrc),
}

var htmlTask = function() {

  return gulp.src(paths.devSrc)
    .pipe(gulpif(global.production, htmlmin(config.tasks.html.htmlmin)))
    .pipe(gulp.dest(paths.distSrc))
    .pipe(browserSync.stream())

}

gulp.task('html', ['copy3rdLibrary'], htmlTask)
module.exports = htmlTask
