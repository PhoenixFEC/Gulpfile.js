var gulp         = require('gulp');
var gulpSequence = require('gulp-sequence');
var tasks        = require('../lib/getEnabledTasks')('watch');

var defaultTask = function(cb) {
	gulpSequence('clean', 'sprites', tasks.assetTasks, tasks.codeTasks, 'watch', cb)
}

gulp.task('default', defaultTask)
module.exports = defaultTask