var cli = require('./nox/cli')
  , parser = require('./nox/parser')
  , utility = require('./nox/utility');

/**
 * Nox - Document generator for Node.js
 * This file sets the namespace for the modules
 *
 * @namespace nox
 */
var nox = exports;

nox.cli = cli;
nox.parser = parser;
nox.utility = utility;
