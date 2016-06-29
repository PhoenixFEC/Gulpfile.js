var config   = require('../config');
if(!config.tasks.images) return;

var path     = require('path');
var gulp     = require('gulp');
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');
var changed  = require('gulp-changed');
var bs       = require('browser-sync');

var paths = {
	devSrc: path.join(config.root.devSrcDir, config.root.devAssetsDir, config.tasks.images.devSrc, '**/*.{' + config.tasks.images.extensions + '}'),
	distSrc: path.join(config.root.distSrcDir, config.root.distAssetsDir, config.tasks.images.distSrc),
	sassIncludeImg: path.join(config.root.devSrcDir, config.root.devAssetsDir, config.tasks.css.devSrc, '**/img/**/*.{' + config.tasks.images.extensions + '}'),
	sassIncludeImgDist: path.join(config.root.distSrcDir, config.root.distAssetsDir, config.tasks.css.distSrc),
	jsIncludeImg: path.join(config.root.devSrcDir, config.root.devAssetsDir, config.tasks.js.devSrc, '**/img/**/*.{' + config.tasks.images.extensions + '}'),
	jsIncludeImgDist: path.join(config.root.distSrcDir, config.root.distAssetsDir, config.tasks.js.distSrc)
};

var imagesTask = function() {
	gulp.src(paths.devSrc)
		.pipe(changed(paths.distSrc)) // Ignore unchanged files
		.pipe(imagemin({
	        progressive: true,
	        svgoPlugins: [{removeViewBox: false}],
	        use: [pngcrush()]
	    }))
		.pipe(gulp.dest(paths.distSrc));

	gulp.src(paths.sassIncludeImg)
		.pipe(changed(paths.sassIncludeImgDist)) // Ignore unchanged files
		.pipe(imagemin({
	        progressive: true,
	        svgoPlugins: [{removeViewBox: false}],
	        use: [pngcrush()]
	    }))
		.pipe(gulp.dest(paths.sassIncludeImgDist))
		.pipe(bs.stream());

	gulp.src(paths.jsIncludeImg)
		.pipe(changed(paths.jsIncludeImgDist)) // Ignore unchanged files
		.pipe(imagemin({
	        progressive: true,
	        svgoPlugins: [{removeViewBox: false}],
	        use: [pngcrush()]
	    }))
		.pipe(gulp.dest(paths.jsIncludeImgDist))
		.pipe(bs.stream());
};

gulp.task('images', imagesTask);
module.exports = imagesTask;