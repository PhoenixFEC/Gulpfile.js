var config = require('../config')
if(!config.tasks.js) return

var path            = require('path')
var pathToUrl       = require('./pathToUrl')
var webpack         = require('webpack')
var webpackManifest = require('./webpackManifest')

module.exports = function(env) {
  var jsSrc = path.resolve(config.root.devSrc, config.tasks.js.devSrc)
  var jsDest = path.resolve(config.root.distSrc, config.tasks.js.distSrc)
  var publicPath = pathToUrl(config.tasks.js.distSrc, '/')
  var nodeModules = path.resolve(__dirname, '../../node_modules');
  var bowerComponents = path.resolve(__dirname, '../../bower_components');

  var extensions = config.tasks.js.extensions.map(function(extension) {
    return '.' + extension
  })

  var rev = config.tasks.production.rev && env === 'production'
  var filenamePattern = rev ? '[name]-[hash].js' : '[name].js'

  var webpackConfig = {
    context: jsSrc,
    plugins: [
      // new webpack.ResolverPlugin([
      //   new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
      // ])
    ],
    resolve: {
      root: jsSrc,
      extensions: [''].concat(extensions)
    },
    resolveLoader: {
      root: nodeModules
    },
    module: {
      loaders: [
        {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/, query: config.tasks.js.babel },
        {test: /\.jsx$/,   loader: 'jsx'}
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

  if(env === 'development') {
    webpackConfig.devtool = 'inline-source-map'

    // Create new entries object with webpack-hot-middleware added
    for (var key in config.tasks.js.entries) {
      var entry = config.tasks.js.entries[key]
      config.tasks.js.entries[key] = ['webpack-hot-middleware/client?&reload=true'].concat(entry)
    }

    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
  }

  if(env !== 'test') {
    // Karma doesn't need entry points or output settings
    webpackConfig.entry = config.tasks.js.entries

    webpackConfig.output= {
      path: path.normalize(jsDest),
      filename: filenamePattern,
      publicPath: publicPath // 'http://static.xlobo.com/dist/'
    }

    if(config.tasks.js.extractSharedJs) {
      // Factor out common dependencies into a shared.js
      webpackConfig.plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
          name: 'shared',
          filename: filenamePattern,
        })
      )
    }
  }

  if(env === 'production') {
    if(rev) {
      webpackConfig.plugins.push(new webpackManifest(publicPath, config.root.distSrc))
    }
    webpackConfig.plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.NoErrorsPlugin()
    )
  }

  return webpackConfig
}
