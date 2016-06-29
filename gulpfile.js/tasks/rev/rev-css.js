var config    = require('../../config');
var gulp      = require('gulp');
var rev       = require('gulp-rev');
var revNapkin = require('gulp-rev-napkin');
var path      = require('path');

var distSrc = path.join(config.root.distSrcDir);
var distAssetsDir = path.join(config.root.distSrcDir, config.root.distAssetsDir);
var cssDistSrc = path.join(config.root.distSrcDir, '/**/*.css');
// 4) Rev and compress CSS and JS files (this is done after assets, so that if a
//    referenced asset hash changes, the parent hash will change as well
gulp.task('rev-css', function(){
  return gulp.src(cssDistSrc)
    .pipe(rev())
    .pipe(gulp.dest(distSrc))
    .pipe(revNapkin())
    .pipe(rev.manifest(
                      path.join(distSrc, 'rev-manifest.json'),
                      { merge: true }
                     ))
    .pipe(gulp.dest(''));
});
