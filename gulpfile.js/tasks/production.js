var config          = require('../config')
var getEnabledTasks = require('../lib/getEnabledTasks')
var gulp            = require('gulp')
var gulpSequence    = require('gulp-sequence')

var productionTask = function(cb) {
  global.production = true
  var tasks = getEnabledTasks('production')
  var zip = config.tasks.zip.enable ? 'zip' : '';
  gulpSequence('clean', 'sprites', tasks.assetTasks, tasks.codeTasks, config.tasks.production.rev ? 'rev': false, zip, cb)
}

gulp.task('production', productionTask)
module.exports = productionTask
