var config  = require('../config');
if(!config.tasks.js) return;

var webpackConfig  = require('../lib/webpack-multi-config')('production');
var logger  = require('../lib/compileLogger');
var gulp    = require('gulp');
var webpack = require('webpack');

var webpackProductionTask = function(cb) {
	webpack(webpackConfig, function(err, stats) {
		logger(err, stats);
		cb();
	})
};


// var gulp          = require('gulp');
var sourcemaps    = require('gulp-sourcemaps');
// var webpack       = require('webpack');
var webpackStream = require('webpack-stream');
var named         = require('vinyl-named');
var through       = require('through2');
var path          = require('path');
var pathToUrl     = require('../lib/pathToUrl');

var paths = {
	devSrc: path.join(config.root.devSrc, config.tasks.js.devSrc),
	distSrc: path.join(config.root.distSrc, config.tasks.js.distSrc),
	publicPath: pathToUrl(config.tasks.js.distSrc, '/'),
	nodeModules: path.resolve(__dirname, '../../node_modules'),
	bowerComponents: path.resolve(__dirname, '../../bower_components')
};

var extensions = config.tasks.js.extensions.map(function(extension) {
	return '.' + extension
});

var webpackConfig = {
	entry: {
		page1: [path.resolve(__dirname, '../../staticFiles/js/page1.js')]
	},
	output: {
		path: path.normalize(paths.distSrc),
		filename: '[name]-[hash].js',
		publicPath: path.normalize(paths.publicPath) // 'http://static.xlobo.com/dist/'
	},
	devtool: 'inline-source-map',
	context: path.normalize(paths.devSrc),
	plugins: [
	  new webpack.ResolverPlugin([
	    new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
	  ])
	],
	resolve: {
	  root: path.normalize(paths.devSrc),
	  extensions: [''].concat(extensions)
	},
	resolveLoader: {
	  root: paths.nodeModules
	},
	module: {
	  loaders: [
	    {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/, query: config.tasks.js.babel },
	    {test: /\.jsx$/,   loader: 'jsx'},
	    // {test: /\.html$/,   loader: 'html'},
	    // {test: /\.json$/,   loader: 'json'},
	    // {test: /\.css$/,    loader: 'style!css!autoprefixer'},
	    // {test: /\.scss$/,   loader: 'style!css!autoprefixer!sass'},
	    // {test: /\.woff$/,   loader: "url?limit=10000&minetype=application/font-woff"},
	    // {test: /\.ttf$/,    loader: "file"},
	    // {test: /\.eot$/,    loader: "file"},
	    // {test: /\.svg$/,    loader: "file"}
	  ]
	}
}
var webpackProductionTask = function() {
  return gulp.src(paths.devSrc)
    .pipe(named())
    .pipe(webpackStream({
      devtool: 'source-map'
    }, webpack, function(err, stats) {
    	//
    }))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(through.obj(function (file, enc, cb) {
      // Dont pipe through any source map files as it will be handled
      // by gulp-sourcemaps
      var isSourceMap = /\.map$/.test(file.path);
      if (!isSourceMap) this.push(file);
      cb();
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.distSrc));
};


gulp.task('webpack:production', webpackProductionTask);
module.exports = webpackProductionTask;