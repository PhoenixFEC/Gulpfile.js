var config     = require('../../config')
var gulp       = require('gulp')
var revReplace = require('gulp-rev-replace')
var path       = require('path')

// 5) Update asset references in HTML
gulp.task('update-html', function(){
  var manifest = gulp.src(path.join(config.root.distSrc, "rev-manifest.json"))

  return gulp.src(path.join(config.root.distSrc, config.tasks.html.distSrc, '/**/*.{html, hbs}'))
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest(path.join(config.root.distSrc, config.tasks.html.distSrc)))
})
