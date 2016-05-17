var config = require('../../config');
var path = require('path');
var webpack = require('webpack');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

var paths = {
  devSrc: path.resolve(config.root.devSrc),
  distSrc: path.resolve(config.root.distSrc),
  nodeModules: path.resolve('node_modules')
};

var webpackConfig = function(env) {
  var wpConfig = {
    // watch: true,
    entry: {
      page1: [path.join(paths.devSrc, 'js/page1.jsx')]
    },
    output: {
      filename: '[name].js',
      chunkFilename: '[id].js',
      path: path.resolve(paths.distSrc, './js'),
      publicPath: path.resolve('dist/js')
    },
    // context: path.join('staticFiles')
    devtool: 'source-map',
    module: {
      // noParse: ['react', 'react-dom'],
      loaders: [
        // {test://, include:[], exclude:[], loaders:[]}
        {test: /\.js$/, loader: 'babel', exclude: /(node_modules|bower_components)/},
        {test: /\.jsx?$/, loader: 'babel', exclude: /(node_modules|bower_components)/},
        {test: /\.html$/,   loaders: ['dom', 'html']},
        {test: /\.json$/,   loader: 'json'}
        // {test: /\.css$/,    loader: 'style!css!autoprefixer'},
        // {test: /\.scss$/,   loader: 'style!css!autoprefixer!sass'},
        // {test: /\.woff$/,   loader: "url?limit=10000&minetype=application/font-woff"},
        // {test: /\.ttf$/,    loader: "file"},
        // {test: /\.eot$/,    loader: "file"},
        // {test: /\.svg$/,    loader: "file"}
      ]
    },
    resolve: {
      root: [path.resolve(paths.devSrc, '../node_modules')],
      // modulesDirectories: ,
      extensions: ['', '.js', '.jsx', '.html', '.css'],
      externals: [],
      alias: {
      }
    },
    resolveLoader: {
      root: paths.nodeModules
    },

    plugins: [
      //将公共代码抽离出来合并为一个文件
      new CommonsChunkPlugin('common.js')
    ]
  };

  // Any configrator in production
  if(env === 'production') {
    var addPlugins = [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      //js文件的压缩
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        }
      }),
      new webpack.NoErrorsPlugin()
    ];
    addPlugins.forEach(function(item, i) {
      wpConfig.plugins.push(item);
    })
  }

  // Any configrator in production
  if(env === 'development') {
    for (var key in wpConfig.entry) {
      var entry = wpConfig.entry[key]
      wpConfig.entry[key] = [
        // necessary for hot reloading with IE:
        'event-source-polyfill',
        // listen to code updates emitted by hot middleware:
        'webpack-hot-middleware/client'
      ].concat(entry)
    }
    var addPlugins = [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ];
    addPlugins.forEach(function(item, i) {
      wpConfig.plugins.push(item);
    })

    // wpConfig.watch = true;
    // devtool: 'inline-source-map'
    wpConfig.devtool = 'cheap-module-eval-source-map';
    wpConfig.devServer = {
      historyApiFallack: true,
      hot: true,
      inline: true,
      progress: true
    };
  }
  return wpConfig;
};

module.exports = webpackConfig;