var config          = require('../config')
// var getEnabledTasks = require('../lib/getEnabledTasks')
var gulp            = require('gulp')
var gulpSequence    = require('gulp-sequence')

var jstask = config.tasks.js.webpackEnable ? 'webpack' : 'js';
var productionTask = function(cb) {
  global.production = true
  // var tasks = getEnabledTasks('production')
  var zip = config.tasks.zip.enable ? 'zip' : '';
  // gulpSequence('clean', 'sprites', tasks.assetTasks, tasks.codeTasks, config.tasks.production.rev ? 'rev': false, zip, cb)
  gulpSequence('clean',
	             ['sprites', 'fonts', 'images', 'svgSprite'],
	             ['css', 'html'],
	             jstask,
	             config.tasks.production.rev ? 'rev': false,
	             zip, cb);
}

gulp.task('production', productionTask)
