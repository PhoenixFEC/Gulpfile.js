var config     = require('../config');
var compact    = require('lodash/compact');

// Grouped by what can run in parallel
var assetTasks = config.tasksGroup.assetTasks;
var codeTasks  = config.tasksGroup.codeTasks;

module.exports = function(env) {
	webpackTask = env === 'production' ? 'webpack:production' : 'webpack';

	function matchFilter(task) {
		if(config.tasks[task]) {
			if(task === 'js') task = config.tasks.js.webpackEnable ? webpackTask : false;
			return task
		}
	}

	function exists(value) {
		return !!value
	}


	return {
		assetTasks: compact(assetTasks.map(matchFilter).filter(exists)),
		codeTasks: compact(codeTasks.map(matchFilter).filter(exists))
	}
};