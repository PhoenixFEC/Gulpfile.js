const initConf = require('./gulpfile.js/config');
const path = require('path');
const webpack = require('webpack');
// const WebpackErrorNotificationPlugin = require('webpack-error-notification');
// const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

//=========================================================
//  ENVIRONMENT VARS
//---------------------------------------------------------
const NODE_ENV = process.env.NODE_ENV;
console.log('[NODE_ENV]', NODE_ENV);
console.log('[__dirname]', __dirname);
const ENV_DEVELOPMENT = NODE_ENV === 'development';
const ENV_PRODUCTION = NODE_ENV === 'production';
const ENV_TEST = NODE_ENV === 'test';

const HOST = process.env.HOST || initConf.root.host;
const PORT = process.env.PORT || initConf.root.port;

//=========================================================
//  PATH VARS
//---------------------------------------------------------
const paths = {
  devSrc: initConf.root.devSrcDir,
  devJsDir: initConf.tasks.js.devSrc,
  devAssetsDir: initConf.root.devAssetsDir,
  distSrc: initConf.root.distSrcDir,
  distJsDir: initConf.tasks.js.distSrc,
  distAssetsDir: initConf.root.distAssetsDir,
  cdnPath: 'http://static.xlobo.com/',
  nodeModules: path.resolve(__dirname, 'node_modules'),
  components: path.resolve(__dirname, initConf.root.devSrcDir, initConf.root.devAssetsDir, 'js/components'),
  wpLoaderPlugins: path.resolve(__dirname, initConf.root.devSrcDir, 'lib')
};

//=========================================================
//  MODULES ENTRIES
//---------------------------------------------------------
const entries = {
  'R/app': 'js/entries/index.jsx'
};

//=========================================================
//  MODULES LOADERS
//---------------------------------------------------------
const loaders = {
  js: {
    test: /\.jsx?$/,
    loader: 'babel',
    // include: path.resolve(__dirname, paths.devSrc, paths.devJsDir)
    exclude: /(node_modules|gulpfile\.js|images|scss)/
  },
  json: { test: /\.json$/, loader: 'json' }
};

//=========================================================
//  CONFIG
//---------------------------------------------------------
const config = {};

config.resolve = {
  extensions: ['', '.js', '.jsx', '.json', '.css'],
  // root: path.resolve(__dirname, paths.devSrc),
  modulesDirectories: ['node_modules', 'lib', 'components', 'static', 'js']
};

config.resolveLoader = {
  // root: [
  //   paths.nodeModules,
  //   paths.components,
  //   paths.wpLoaderPlugins,
  //   path.join(paths.wpLoaderPlugins, 'webpack-loaders')
  // ],
  modulesDirectories: ['node_modules', 'lib/web_loaders'],
  alias: {
    'json': path.resolve(__dirname, 'devSources/lib/web_loaders/json-loader')
  }
};

config.plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
  })
];

/*config.postcss = [
  autoprefixer({ browsers: ['last 3 versions'] })
];*/

config.sassLoader = {
  outputStyle: 'compressed',
  precision: 10,
  sourceComments: false
};


//========================================
//  DEVELOPMENT or PRODUCTION common part
//----------------------------------------
if (ENV_DEVELOPMENT || ENV_PRODUCTION) {
  config.context = path.resolve(__dirname, paths.devSrc, paths.devAssetsDir);

  config.entry = entries;

  config.output = {
    filename: '[name].js',
    chunkFilename: '[id]-[hash].js',
    path: path.resolve(__dirname, paths.distSrc, paths.distAssetsDir, paths.distJsDir),
    publicPath: '/' + paths.devJsDir + '/'
  };

  // config.plugins.push(
  //   new HtmlWebpackPlugin({
  //     filename: 'index.html',
  //     hash: false,
  //     inject: 'body',
  //     template: './src/index.html'
  //   })
  // );
}


//=====================================
//  DEVELOPMENT
//-------------------------------------
if (ENV_DEVELOPMENT) {
  config.devtool = 'cheap-module-source-map';

  // // webpack-dev-server configure.
  // config.entry.app.unshift(
  //   `webpack-dev-server/client?http://${HOST}:${PORT}`,
  //   'webpack/hot/only-dev-server',
  //   'react-hot-loader/patch'
  // );
  for (var key in config.entry) {
    var entry = config.entry[key]
    config.entry[key] = [
      'react-hot-loader/patch',
      'webpack/hot/dev-server',
      'webpack-hot-middleware/client'
    ].concat(entry)
  }

  config.module = {
    loaders: [
      loaders.js,
      loaders.json
    ]
  };


  config.devServer = {
    contentBase: path.resolve(__dirname, paths.distSrc, paths.distAssetsDir, paths.distJsDir),
    historyApiFallback: true,
    host: HOST,
    hot: true,
    port: PORT,
    publicPath: config.output.publicPath,
    // noInfo: true,
    stats: {
      // poll: true,
      cached: true,
      cachedAssets: true,
      chunks: true,
      chunkModules: false,
      colors: true,
      hash: false,
      reasons: true,
      timings: true,
      version: false
    }
  };

  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'R/vendor',
      children: true,
      async: true,
      minChunks: Infinity
    })
  );
}


//=====================================
//  PRODUCTION
//-------------------------------------
if (ENV_PRODUCTION) {
  config.devtool = 'source-map';

  // config.entry.vendor = []
  config.entry['R/vendor'] = [
    'babel-polyfill',
    'classnames',
    // 'firebase',
    // 'history',
    'react',
    'react-dom',
    'react-hot-loader',
    'react-redux',
    'react-router',
    'react-router-redux',
    'redux',
    'redux-thunk'
  ];

  config.output.chunkFilename = '[id].js';
  // config.output.filename = '[name].[hash].js';
  config.output.publicPath = paths.cdnPath;

  config.module = {
    loaders: [
      loaders.js,
      loaders.json
    ]
  };

  config.plugins.push(
    // new WebpackMd5Hash(),
    // new ExtractTextPlugin('styles.css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'R/vendor',
      children: true,
      async: true,
      minChunks: Infinity
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        dead_code: true, // eslint-disable-line camelcase
        screw_ie8: true, // eslint-disable-line camelcase
        unused: true,
        warnings: false
      }
    })
  );
}

//=====================================
//  TEST
//-------------------------------------
if (ENV_TEST) {
  config.devtool = 'inline-source-map';

  config.module = {
    loaders: [
      loaders.js,
      loaders.scss
    ]
  };
}

module.exports = config;

