var config = require('../config');
var gulp   = require('gulp');
var watch  = require('gulp-watch');
var path   = require('path');

var watchTask = function() {
  var watchableTasks = ['fonts', 'iconFont', 'images', 'sprites', 'svgSprite', 'html', 'css'];

  watchableTasks.forEach(function(taskName) {
    var task = config.tasks[taskName];
    if(task) {
      var glob = path.join(config.root.devSrcDir, config.root.devAssetsDir, task.devSrc, '**/*.{' + task.extensions.join(',') + '}');
      watch(glob, function() {
          require('./' + taskName)();
      });
    }
  });
};

gulp.task('watch', ['browserSync'], watchTask);
