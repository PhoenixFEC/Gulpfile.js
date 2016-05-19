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
  var jsxLoaders;
  if(env === 'production') {
    jsxLoaders = {test: /\.jsx?$/, loader: "babel", exclude: /(node_modules|bower_components)/,
          query: {
            "presets": ["react", "es2015"]
          }
        };
  } else {
    jsxLoaders = {test: /\.jsx?$/, loader: "babel", exclude: /(node_modules|bower_components)/,
          query: {
            "presets": ["react", "es2015", "react-hmre"],
            "plugins": [["react-transform", {
              "transforms": [{
                "transform": "react-transform-hmr",
                // if you use React Native, pass "react-native" instead:
                "imports": ["react", "react-dom"],
                // this is important for Webpack HMR:
                "locals": ["module"]
              }]
              // note: you can put more transforms into array
              // this is just one of them!
            }]]
          }
        };
  }
  var wpConfig = {
    // watch: true,
    entry: {
      app: [path.join(paths.devSrc, 'js/index.jsx')]
    },
    output: {
      filename: '[name].js',
      chunkFilename: '[id].js',
      path: path.resolve(paths.distSrc, './js'),
      publicPath: path.resolve(paths.distSrc, './js')
      // publicPath: env === 'production' ? 'http://static.xlobo.com/' : path.resolve(paths.distSrc, './js')
    },
    // context: path.join('staticFiles')
    module: {
      // noParse: ['react', 'react-dom'],
      loaders: [
        // {test://, include:[], exclude:[], loaders:[]}
        jsxLoaders
        // {test: /\.jsx?$/, loader: 'babel', exclude: /(node_modules|bower_components)/}
        // {test: /\.html$/,   loaders: ['dom', 'html']},
        // {test: /\.json$/,   loader: 'json'}
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
        'react': 'react/dist/react.min.js',
        'react-dom': 'react-dom/dist/react-dom.min.js',
        'react-dom-server': 'react-dom/dist/react-dom-server.min.js',
        'react-with-addons': 'react/dist/react-with-addons.min.js',
        'jquery': path.resolve(paths.devSrc, 'lib/jquery/1.8.3/jquery.min.js')
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
    wpConfig.devtool = 'cheap-source-map';
    var addPlugins = [
      new webpack.optimize.OccurenceOrderPlugin(),
      // config NODE_ENV to disable react-transform-hrm
      // new webpack.DefinePlugin({
      //   'process.env': {
      //     NODE_ENV: JSON.stringify('production')
      //   }
      // }),
      //js文件的压缩
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        }
      })
    ];
    addPlugins.forEach(function(item, i) {
      wpConfig.plugins.push(item);
    });
  }

  // Any configrator in production
  if(env === 'development') {

    // wpConfig.watch = true;
    wpConfig.devtool = 'cheap-module-eval-source-map';
    wpConfig.devServer = {
      historyApiFallack: true,
      hot: true,
      inline: true,
      progress: true
    };

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

  }
  return wpConfig;
};

module.exports = webpackConfig;