var config      = require('../config')
if(!config.tasks.svgSprite || !config.tasks.svgSprite.enable) return

var browserSync = require('browser-sync')
var path        = require('path')
var gulp        = require('gulp')
var imagemin    = require('gulp-imagemin')
var svgstore    = require('gulp-svgstore')

var svgSpriteTask = function() {

  var settings = {
    devSrc: path.join(config.root.devSrc, config.tasks.svgSprite.devSrc, '/*.svg'),
    distSrc: path.join(config.root.distSrc, config.tasks.svgSprite.distSrc)
  }

  return gulp.src(settings.devSrc)
    .pipe(imagemin())
    .pipe(svgstore())
    .pipe(gulp.dest(settings.distSrc))
    .pipe(browserSync.stream())
}

gulp.task('svgSprite', svgSpriteTask)
module.exports = svgSpriteTask
