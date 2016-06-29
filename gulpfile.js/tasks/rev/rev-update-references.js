var config     = require('../../config');
var gulp       = require('gulp');
// var revReplace = require('gulp-rev-replace');
var path       = require('path');
var revReplace = require('../../lib/revReplace.js');

var distSrcDir = config.root.distSrcDir;
var distAssetsDir = config.root.distAssetsDir;
var deployVersionDir = config.root.deployVersionDir;
// var distAssetsDir = path.join(distSrcDir, distAssetsDir);
var gulpSrc = path.join(distSrcDir, distAssetsDir, '/**/**.{css,js,html,json}');
var gulpDest = path.join(distSrcDir, distAssetsDir);
var ignoreReactJS = '!' + path.join(distSrcDir, distAssetsDir, 'js/R/**');

// 2) Update asset references with reved filenames in compiled css + js
gulp.task('rev-update-references', function(){
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

  return gulp.src([gulpSrc, ignoreReactJS])
    .pipe(revReplace(replaceOptions))
    .pipe(gulp.dest(gulpDest));
});
