var config          = require('../config');
// var getEnabledTasks = require('../lib/getEnabledTasks')
var gulp            = require('gulp');
var gulpSequence    = require('gulp-sequence');

var productionTask = function(cb) {
  global.production = true
  // var zip = config.tasks.zip.enable ? 'zip' : '';
  gulpSequence(
               'clean',
               'sprites',
	             ['fonts', 'images', 'svgSprite'],
	             ['css', 'js', 'html'],
	             'webpack',
	             'rev',
	             // zip,
	             // 'server',
	             cb);
}

gulp.task('production', productionTask)
