var config           = require('../../config');
if(!config.tasks.iconFont) return;

var gulp             = require('gulp');
var iconfont         = require('gulp-iconfont');
var generateIconSass = require('./generateIconSass');
var handleErrors     = require('../../lib/handleErrors');
var path             = require('path');
var url              = require('url');

var fontPath         = path.join(config.root.distSrcDir, config.tasks.iconFont.distSrc);
var cssPath          = path.join(config.root.distSrcDir, config.root.distAssetsDir, config.tasks.css.distSrc);

var settings = {
  name: 'xlobo icons',
  devSrc: path.join(config.root.devSrcDir, config.tasks.iconFont.devSrc, '/*.svg'),
  distSrc: path.join(config.root.distSrcDir, config.root.distAssetsDir, config.tasks.iconFont.distSrc),
  sassDest: path.join(config.root.devSrcDir, config.tasks.css.devSrc, config.tasks.iconFont.sassDest),
  template: path.normalize('./gulpfile.js/tasks/iconFont/template.sass'),
  sassOutputName: '_icons.sass',
  fontPath: url.resolve('.',path.relative(cssPath, fontPath)),
  className: 'icon',
  options: {
    timestamp: 0, // see https://github.com/fontello/svg2ttf/issues/33
    fontName: 'icons',
    normalize: false,
    formats: config.tasks.iconFont.extensions
  }
};

var iconFontTask = function() {
  return gulp.src(settings.devSrc)
    .pipe(iconfont(settings.options))
    .on('glyphs', generateIconSass(settings))
    .on('error', handleErrors)
    .pipe(gulp.dest(settings.distSrc))
};

gulp.task('iconFont', iconFontTask);
module.exports = iconFontTask;
