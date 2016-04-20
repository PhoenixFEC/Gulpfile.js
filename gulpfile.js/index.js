/**
 * gulpfile.js
 *    To add a new task, simply add a new task file that directory.
 *    gulpfile.js/tasks/default.js specifies the default set of tasks to run
 *    when you run `gulp`.
 */
var requireDir = require('require-dir');
requireDir('./tasks', { recurse: true });