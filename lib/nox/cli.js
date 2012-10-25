var fs = require('fs')
  , path = require('path')
  , winston = require('winston').cli()
  , _ = require('underscore')
  , async = require('async')
  , colors = require('colors')
  , parser = require('./parser')
  , utility = require('./utility');

/**
 * CLI - command line interface for nox
 *
 * @namespace cli
 */
var cli = exports;

/**
 * @constant default output directory for docs
 *           It is relative to the working directory
 */
var defaultOutputDir = 'doc';

/**
 * @constant default source directory for finding files
 *           It is relative to the working directory
 */
var defaultSourceDir = 'lib';


/**
 * @constant default file name for .nox.opts
 */
var optsFilePath = process.cwd() + '/.nox.opts';

/**
 * Runs the commands from the command line
 * Starting point of the application
 *
 * @example
 *   cli.start();
 *   // => returns nothing
 *
 * @public
 * @param {Object} argv - The command line options
 */
cli.start = function(argv) {
  mergedOptions(argv, function(opts) {
    if (opts.h || opts.help) {
      cli.help();
    } else if (opts.v || opts.version) {
      cli.version();
    } else {
      cli.generate(opts);
    }
  });
};

/**
 * Shows the help message for Nox
 *
 * @example
 *   cli.help();
 *   // => returns nothing
 *
 * @public
 */
cli.help = function() {
  winston.help('Usage: nox [OPTIONS] [FILES]');
  winston.help('');
  winston.help('where [OPTION] is one of:');
  winston.help('');
  winston.help('-o, --output-dir');
  winston.help('Specify the directory where the documents will be saved at');
  winston.help('');
  winston.help('-h, --help');
  winston.help('Shows the help message');
  winston.help('');
  winston.help('-v, --version');
  winston.help('Shows the version of the package');
};

/**
 * Shows the version of the app
 *
 * @example
 *   cli.version();
 *   // => returns nothing
 *
 * @public
 */
cli.version = function() {
  var packagePath = path.normalize(__dirname + '../../../package.json');
  fs.readFile(packagePath, 'utf8', function(err, data) {
    if (err) {
      winston.error('[Nox] Error reading package.json');
    } else {
      winston.info(JSON.parse(data).version);
    }
  });
};

/**
 * Generates the documentation from the code
 *
 * @example
 *   cli.generate({});
 *   // => returns nothing
 *
 * @public
 * @param {Object} opts - The options
 */
cli.generate = function(opts) {
  var cmdOptions = {};
  cmdOptions.outputDir = getOutputDir(opts);
  getFilesForParsing(opts, function(err, filePaths) {
    if (err) {
      winston.error('[Nox] Error reading the source files');
    } else {
      parser.parseFiles(filePaths, function(err, results) {
	if (err) {
	  console.log(err);
	} else {
	  console.log(JSON.stringify(results));
	}
      });
    }
  });
};

/**
 * Returns the output directory given the command line
 * arguments
 *
 * @example
 *   getOutputDir({o: 'foo'})
 *   // => '/path/to/foo'
 *
 * @private
 * @param {Object} opts - The options
 * @return {String} The output directory path
 */
function getOutputDir(opts) {
  var outputDir = opts.o || opts['output-dir'] || defaultOutputDir;
  return path.normalize(process.cwd() + '/' + outputDir);
}

/**
 * Returns a list of files to be parsed. Only accept js files
 * for now.
 *
 * @example
 *   getFilesForParsing({_: ['lib']}, function(err, filePaths) {
 *     // filePaths => ['/path/to/lib/foo.js', '/path/to/lib/bar.js']
 *   });
 *
 * @private
 * @param {Object} opts - The command line options
 * @callbackParam {Object} err - The error object
 * @callbackParam {Array} filePaths - The Array of file paths
 */
function getFilesForParsing(opts, callback) {
  var sourceDirOpt = opts._[0] || defaultSourceDir;
  var sourceDirs = _.map(sourceDirOpt.split(','), function(sourcePath) {
    return path.normalize(process.cwd() + '/' + sourcePath);
  });
  var findSourceFiles = function(sourcePath, findCallback) {
    if (/\.js$/i.test(sourcePath)) {
      return findCallback(null, sourcePath);
    } else {
      return utility.readdirRecursive(sourcePath, function(err, filePaths) {
	if (err) {
	  return findCallback(err, sourcePath);
	} else {
	  return findCallback(null, utility.filterJSFiles(filePaths));
	}
      });
    }
  };

  async.map(sourceDirs, findSourceFiles, function(err, results) {
    if (err) {
      return callback(err, null);
    } else {
      return callback(null, _.flatten(results));
    }
  });
}

/**
 * Loads the options from the .nox.opts file
 *
 * @example
 *   loadOptsFile(function(err, opts) {
 *     // opts => { 'o': 'lib', 'help': true}
 *   });
 *
 * @private
 * @callbackParam {Object} err - The error object
 * @callbackParam {Object} opts - The parsed options from the file
 */
function loadOptsFile(callback) {
  return fs.exists(optsFilePath, function(exists) {
    if (exists) {
      return fs.readFile(optsFilePath, 'utf8', function(err, data) {
	if (err) {
	  winston.error('[Nox] Error reading nox option file');
	  return callback(err, {});
	} else {
	  try {
	    return callback(null, JSON.parse(data));
	  } catch (err) {
	    winston.error('[Nox] Error parsing nox option file');
	    return callback(err, {});
	  }
	}
      });
    } else {
      return callback(null, {});
    }
  });
}

/**
 * Returns the merged options from the command line
 * and option file. Command line will take precendence
 *
 * @example
 *   // assuming file opts => {a: 'aa', b: 'b'}
 *   mergedOptions({a: 'a'}, function(opts) {
 *     // => {a: 'a', b: 'b'}
 *   })
 *
 *
 * @private
 * @param {Object} argv - The command line arguments
 * @callbackParam {Object} opts - The parsed options
 */
function mergedOptions(argv, callback) {
  return loadOptsFile(function(err, opts) {
    if (err) {
      return callback(argv);
    } else {
      return callback(_.extend(opts, argv));
    }
  });
}