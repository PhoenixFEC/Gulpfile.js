var config     = require('../../config')
var gulp       = require('gulp')
var revReplace = require('gulp-rev-replace')
var path       = require('path')

// 2) Update asset references with reved filenames in compiled css + js
gulp.task('rev-update-references', function(){
  var manifest = gulp.src(path.join(config.root.distSrc, "rev-manifest.json"))

  return gulp.src(path.join(config.root.distSrc,'/**/**.{css,js}'))
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest(config.root.distSrc))
})
