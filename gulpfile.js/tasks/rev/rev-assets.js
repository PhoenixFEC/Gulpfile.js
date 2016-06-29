var config    = require('../../config')
var gulp      = require('gulp')
var path      = require('path')
var rev       = require('gulp-rev')
var revNapkin = require('gulp-rev-napkin')


var distSrc = path.join(config.root.distSrcDir);
var distAssetsDir = path.join(config.root.distSrcDir, config.root.distAssetsDir);
var allDistSrc = path.join(config.root.distSrcDir, '/**/*');
var ignoreThese = '!' + path.join(config.root.distSrcDir, '/**/*.+(css|js|map|json|html|hbs|tpl)');
var ignoreReactJS = '!' + path.join(config.root.distSrcDir, '/js/R/**');
// var ignoreTpl = '!' + path.join(config.root.distSrcDir, config.tasks.html.distSrc, '**');

// 1) Add md5 hashes to assets referenced by CSS and JS files
gulp.task('rev-assets', function() {
  // Ignore files that may reference assets. We'll rev them next.
  return gulp.src([allDistSrc, ignoreThese, ignoreReactJS])
    .pipe(rev())
    .pipe(gulp.dest(distSrc))
    .pipe(revNapkin())
    .pipe(rev.manifest(
                      path.join(distSrc, 'rev-manifest.json'),
                      { merge: true }
                     ))
    .pipe(gulp.dest(''))
})
