var fs = require('fs')
  , path = require('path')
  , winston = require('winston').cli()
  , colors = require('colors');

/**
 * CLI - command line interface for nox
 *
 * @namespace cli
 */
var cli = exports;

/**
 * Runs the commands from the command line
 * Starting point of the application
 *
 * @param {Object} argv
 */
cli.start = function(argv) {
  if (argv.h || argv.help) {
    cli.help();
  } else if (argv.v || argv.version) {
    cli.version();
  } else {
    cli.generate(argv);
  }
};

/**
 * Shows the help message for Nox
 */
cli.help = function() {
  winston.help('Usage: nox [OPTIONS] [FILES]');
  winston.help('');
  winston.help('where [OPTION] is one of:');
  winston.help('-o, --ouput-dir, -h, --help, -v, --version');
};

/**
 * Shows the version of the app
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