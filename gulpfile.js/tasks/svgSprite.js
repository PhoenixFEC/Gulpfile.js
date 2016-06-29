var config      = require('../config')
if(!config.tasks.svgSprite) return

var browserSync = require('browser-sync')
var path        = require('path')
var gulp        = require('gulp')
var imagemin    = require('gulp-imagemin')
var svgstore    = require('gulp-svgstore')

var svgSpriteTask = function() {

  var paths = {
    devSrc: path.join(config.root.devSrcDir, config.root.devAssetsDir, config.tasks.svgSprite.devSrc, '/*.svg'),
    distSrc: path.join(config.root.distSrcDir, config.root.distAssetsDir, config.tasks.svgSprite.distSrc)
  }


  return gulp.src(paths.devSrc)
    .pipe(imagemin())
    .pipe(svgstore())
    .pipe(gulp.dest(paths.distSrc))
    .pipe(browserSync.stream())
}

gulp.task('svgSprite', svgSpriteTask)
module.exports = svgSpriteTask
