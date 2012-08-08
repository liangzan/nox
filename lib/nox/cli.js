var fs = require('fs')
  , path = require('path')
  , winston = require('winston').cli()
  , _ = require('underscore')
  , colors = require('colors');

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
var defaultOutputDir = 'lib';

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
  console.log(cmdOptions.outputDir);
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