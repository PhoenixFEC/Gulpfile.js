var config  = require('../config')
var gulp    = require('gulp')
// var ghPages = require('gulp-gh-pages')
var open    = require('open')
var os      = require('os')
var path    = require('path')

var settings = {
  url: config.root.projects.xlobowww.url,
  src: path.join(config.root.distSrc, '/**/*'),
  ghPages: {
    cacheDir: path.join(os.tmpdir(), config.root.projects.xlobowww.name)
  }
}

var deployTask = function() {
  return gulp.src(settings.src)
    // .pipe(ghPages(settings.ghPages))
    .on('end', function(){
      open(settings.url)
    })
}

gulp.task('deploy', ['production'], deployTask)
module.exports = deployTask
