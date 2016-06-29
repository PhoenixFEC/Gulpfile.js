var config     = require('../../config');
var gulp       = require('gulp');
// var revReplace = require('gulp-rev-replace');
var path       = require('path');
var revReplace = require('../../lib/revReplace.js');

var distSrcDir = config.root.distSrcDir;
var distHtmlSrc = config.tasks.html.distSrc;
var deployVersionDir = config.root.deployVersionDir;
var gulpSrc = path.join(distSrcDir, distHtmlSrc, '/**/*.{html, hbs}');
var gulpDest = path.join(distSrcDir, distHtmlSrc);

// 5) Update asset references in HTML
gulp.task('update-html', function(){
  var manifest = gulp.src(path.join(distSrcDir, "rev-manifest.json"));
  var replacePath = function(filename) {
    if(filename.indexOf('/static/') > -1) {
      return filename.replace(/\/(static)\//, function(a, b) {
        return a.replace(b, deployVersionDir)
      });
    }
    return filename;
  };

  var replaceOptions = {
        manifest: manifest,
        deployRoot: distSrcDir
  };
  if(global.production) {
    replaceOptions.modifyReved = replacePath;
    replaceOptions.cdnDomain = config.root.cdnPath;
    // prefix = 'static/v2';
  }

  return gulp.src(gulpSrc)
    .pipe(revReplace(replaceOptions))
    .pipe(gulp.dest(gulpDest));
});
