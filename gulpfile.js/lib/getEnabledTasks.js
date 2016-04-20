var config     = require('../config');
var compact    = require('lodash/compact');

// Grouped by what can run in parallel
var assetTasks = config.tasksGroup.assetTasks;
var codeTasks  = config.tasksGroup.codeTasks;

module.exports = function(env) {

	function matchFilter(task) {
		if(config.tasks[task]) {
			// switch(task) {
			// 	case '':
			// 		break;
			// 	case '':
			// 		break;
			// 	case '':
			// 		break;
			// }
			// if(task === 'js') {
			// 	task = (env === 'production' && !config.tasks.js.enable) ? 'webpack:production' : false
			// }
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
