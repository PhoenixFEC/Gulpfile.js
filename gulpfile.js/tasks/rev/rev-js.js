var config    = require('../../config');
var gulp      = require('gulp');
var path      = require('path');
var rev       = require('gulp-rev');
var revNapkin = require('gulp-rev-napkin');

var distSrc = path.join(config.root.distSrcDir);
var distAssetsDir = path.join(config.root.distSrcDir, config.root.distAssetsDir);
var jsDistSrc = path.join(config.root.distSrcDir, '/**/*.js');

// 4) Rev and compress CSS and JS files (this is done after assets, so that if a
//    referenced asset hash changes, the parent hash will change as well
gulp.task('rev-js', function(){
  return gulp.src([jsDistSrc])
    .pipe(rev())
    .pipe(gulp.dest(distSrc))
    .pipe(revNapkin())
    .pipe(rev.manifest(
                      path.join(distSrc, 'rev-manifest.json'),
                      { merge: true }
                     ))
    .pipe(gulp.dest(''));
});
