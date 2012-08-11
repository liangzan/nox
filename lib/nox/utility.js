var fs = require('fs')
  , async = require('async')
  , _ = require('underscore');

/**
 * Utility - for functions that do not belong anywhere
 *
 * @namespace - utility
 */
var utility = exports;

/**
 * Reads a directory recursively and returns the files
 *
 * @example
 *   utility.readdirRecursive('lib', function(err, filePaths) {
 *     // filePaths => ['/path/to/foo.text', /path/to/bar.js']
 *   });
 *
 * @public
 * @param {String} dirPath - The String which is a full path to
 *                           a directory.
 * @callbackParam {Object} err - The error object
 * @callbackParam {Array} filePaths - The Array of file paths found
 *                                    from the directory
 */
utility.readdirRecursive = function(dirPath, callback) {
  function mapPath(filePath, mapCallback) {
    return fs.stat(filePath, function(err, stats) {
      if (err) {
	return mapCallback(err, filePath);
      } else {
	if (stats.isFile()) {
	  return mapCallback(null, filePath);
	} else if (stats.isDirectory()) {
	  return utility.readdirRecursive(filePath, mapCallback);
	} else {
	  return mapCallback(null, filePath);
	}
      }
    });
  };

  fs.readdir(dirPath, function(err, files) {
    if (err) {
      return callback(err, null);
    } else {
      var fullFilePaths = _.map(files, function(filePath) {
	return dirPath + '/' + filePath;
      });
      return async.map(fullFilePaths, mapPath, function(err, mappedPaths) {
	return callback(err, _.flatten(mappedPaths));
      });
    }
  });
};