var config = require('../config');
if(!config.tasks.sprites) return;

var gulp = require('gulp');
var gulpif = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var spritesmith = require('gulp.spritesmith');
var buffer = require('vinyl-buffer');
var merge = require('merge-stream');
var path = require('path');

var paths = {
	devSrc: path.join(config.root.devSrc, config.tasks.sprites.devSrc, '{' + config.tasks.sprites.category.join(',') + '}', '*.png'),
	distSrc: path.join(config.root.distSrc, config.tasks.sprites.distSrc)
}

var spritesTask = function() {
  var spriteData = gulp.src(paths.devSrc)
    .pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css',
    padding: 1
  }));

  var imgStream = spriteData.img
  	.pipe(buffer())
  	.pipe(imagemin())
  	.pipe(gulp.dest(paths.distSrc));

	var cssStream = spriteData.css
		// .pipe(buffer())
		.pipe(gulpif(global.production, cssnano()))
		.pipe(gulp.dest(paths.distSrc));

  return merge(imgStream, cssStream);
}

gulp.task('sprites', spritesTask);
module.exports = spritesTask;