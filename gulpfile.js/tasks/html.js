var config      = require('../config');
if(!config.tasks.html) return;

var browserSync = require('browser-sync');
var gulp        = require('gulp');
var gulpif      = require('gulp-if');
var htmlmin     = require('gulp-htmlmin');
var path        = require('path');
var fs          = require('fs');
var through2    = require('through2');

var exclude = path.normalize('!**/{' + config.tasks.html.excludeFolders.join(',') + '}/**');

var paths = {
  devSrc: path.join(config.root.devSrcDir, config.tasks.html.devSrc, '/**/*.{' + config.tasks.html.extensions + '}'),
  distSrc: path.join(config.root.distSrcDir, config.tasks.html.distSrc)
};

// var razorReplace = function() {
//   return through2.obj(function(chunk, encoding, cb) {
//     var newContents = chunk.contents.toString().replace(/{{@Html\.Partial\(('[^']+'|"[^"]+")\)}}/g, function(a, b) {
//       var fullPath = (chunk.base + b).replace(new RegExp('\'', 'g'), '');
//       return fs.readFileSync(fullPath);
//     });
//     chunk.contents = new Buffer(newContents);
//     cb(null, chunk);
//   })
// };


var htmlTask = function() {

  return gulp.src([paths.devSrc, exclude])
    // .pipe(razorReplace())
    // .pipe(gulpif(global.production, htmlmin(config.tasks.html.htmlmin)))
    .pipe(gulp.dest(paths.distSrc))
    .pipe(browserSync.stream());

};

gulp.task('html', htmlTask);
module.exports = htmlTask;
