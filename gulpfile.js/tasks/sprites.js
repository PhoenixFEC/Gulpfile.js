var config = require('../config');
if(!config.tasks.sprites) return;

var gulp        = require('gulp');
var gulpif      = require('gulp-if');
var changed     = require('gulp-changed');
var cssnano     = require('gulp-cssnano');
var imagemin    = require('gulp-imagemin');
var spritesmith = require('gulp.spritesmith');
var buffer      = require('vinyl-buffer');
var merge       = require('merge-stream');
var path        = require('path');

var paths = {
	devSrc: path.join(config.root.devSrcDir, config.root.devAssetsDir, config.tasks.sprites.devSrc, '{' + config.tasks.sprites.category.join(',') + '}', '*.png'),
  imgDistSrc: path.join(config.root.distSrcDir, config.root.distAssetsDir, config.tasks.sprites.imgDistSrc),
	cssDistSrc: path.join(config.root.devSrcDir, config.root.devAssetsDir, config.tasks.sprites.cssDistSrc)
};

var spritesTask = function() {
  var spriteData = gulp.src(paths.devSrc)
    .pipe(changed(paths.imgDistSrc)) // Ignore unchanged files
    .pipe(spritesmith({
    imgName: '../sprites/sprite.png',
    cssName: '_sprite.css',
    padding: 1
  }));

  var imgStream = spriteData.img
  	.pipe(buffer())
  	.pipe(imagemin())
  	.pipe(gulp.dest(paths.imgDistSrc));

	var cssStream = spriteData.css
		// .pipe(buffer())
		.pipe(gulpif(global.production, cssnano()))
		.pipe(gulp.dest(paths.cssDistSrc));

  return merge(imgStream, cssStream);
};

gulp.task('sprites', spritesTask);
module.exports = spritesTask;