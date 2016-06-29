var gulp         = require('gulp');
var gutil        = require('gulp-util');
var gulpSequence = require('gulp-sequence');

require('./rev/rev-assets');
require('./rev/rev-update-references');
require('./rev/rev-css');
require('./rev/rev-js');
require('./rev/update-html');

// var revAssets = !global.production ? 'rev-assets' : false;
// var revCSSJS = !global.production ? ['rev-css', 'rev-js'] : false;

// If you are familiar with Rails, this task the equivalent of `rake assets:precompile`
var revTask = function(cb) {
  gulpSequence(
    // 1) Add md5 hashes to assets referenced by CSS and JS files
    'rev-assets',
    // 2) Update asset references (images, fonts, etc) with reved filenames in compiled css + js
    'rev-update-references',
    // 3) Rev and compress CSS and JS files (this is done after assets, so that if a referenced asset hash changes, the parent hash will change as well
    ['rev-css', 'rev-js'],
    // 4) Update asset references in HTML
    'update-html',
  cb);
};

gulp.task('rev', revTask);
module.exports = revTask;
