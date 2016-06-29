// var config   = require('../config');
var path     = require('path');
var gutil = require('gulp-util');
var through2 = require('through2');

// var distSrc = path.join(config.root.distSrcDir);

// change assets path to new reference
// @param {
//  deployRoot: {String} sources root directory. e.g. dist
//  cdnDomain: {String} e.g. http://cdn.domain.com/
//  prefix: {String} pre-path e.g. a/b/c.js => abc/a/b/c.js  abc is pre-path
//  modifyReved: {Function} modify reved path
// }
//
var revReplace = function(options) {
  var options = options || {};
  options.deployRoot          = options.deployRoot || '';
  options.cdnDomain           = options.cdnDomain || '';
  options.prefix              = options.prefix || '';
  options.modifyReved         = options.modifyReved || null;
  options.replaceInExtensions = options.replaceInExtensions || ['.js', '.css', '.html', '.hbs'];
  options.canonicalUris       = options.canonicalUris || true;

  if(!options.manifest) {
    new gutil.PluginError('gulp-rev-replace', 'menifest option is not defined');
  }

  // if(!options.deployRoot) {
  //   new gutil.PluginError('gulp-rev-replace', 'deployRoot option is not defined');
  // }

  var manifest = null;


  return through2.obj(function replacePath(chunk, enc, cb) {
    if(chunk.isNull()) {
      this.push(chunk);
      return cb();
    }

    if(chunk.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-rev-replace', 'Streaming not supported'));
      return cb();
    }

    if(typeof options === 'undefined') {
      this.push(chunk);
      return cb();
    }

    if(manifest === null) {
      manifest = {};
      options.manifest.once('data', function (file) {
        var tmp = JSON.parse(file.contents.toString());
        Object.keys(tmp).forEach(function (unreved) {
          var unrevedPath = path.resolve(options.deployRoot, unreved);
          var revedPath = options.prefix ? path.join(options.prefix, tmp[unreved]) : tmp[unreved];
          revedPath = options.cdnDomain ? options.cdnDomain + canonicalizeUri(revedPath) : '/' + canonicalizeUri(revedPath);
          manifest[unrevedPath] = revedPath;
        });
      });
    // console.log(manifest)
    }


    var newContents = chunk.contents.toString();
    var curFileDirname = path.dirname(chunk.path);
    newContents = newContents.replace(/(href=|url\(|src=)(['"]?)(\S*)('|"|\))/g, function(a,b,c,d,e) {
      var curPath = d;
      if(regPath(curPath, '^#') || regPath(curPath, 'http(s)?\\:\\/\\/')) return a;
      var isAbsPath = regPath(curPath, '^\\/');
      var curPath = isAbsPath ? curPath.replace(/^\//, '../') : curPath;
      var relativeFullPath = path.resolve(curFileDirname, curPath);
      curPath = !!manifest[relativeFullPath] ? manifest[relativeFullPath] : d;
      if(options.modifyReved) curPath = options.modifyReved(curPath);

      return a.split(d).join(curPath);
    });

    chunk.contents = new Buffer(newContents);
    cb(null, chunk);
  });

  function canonicalizeUri(filePath) {
    if(path.sep !== '/' && options.canonicalUris) {
      filePath = filePath.split(path.sep).join('/');
    }
    return filePath;
  }

  function regPath(path, keywordsReg) {
    return new RegExp(keywordsReg).test(path);
  }
};
module.exports = revReplace;