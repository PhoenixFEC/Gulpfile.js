var gulp = require('gulp');
var copy = require('gulp-copy');
var config = require('../config');
if(!config.tasks.html) return;

var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var notify = require('gulp-notify');
var fs = require('fs');
var path = require('path');
var handleErrors = require('../lib/handleErrors');

var paths = {
	devSrc: path.join(config.root.devSrc, config.tasks.html.devSrc),
	distSrc: path.join(config.root.distSrc, config.tasks.html.distSrc)
}

var getData = function(file) {
  var dataPath = path.resolve(config.root.devSrc, config.tasks.html.devSrc, config.tasks.html.dataFile)
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'))
}

var copyTask = function() {
	// fs.readdir(path.join(config.root.devSrc, config.tasks.html.devSrc), function(err, files){
	// 	// body
	// })
	fs.readdir(paths.devSrc, function(err, files) {
		if(err) {
			handleErrors(err);
			return;
		}

	})
};

gulp.task('copy3rdLibrary', copyTask);
module.exports = copyTask;