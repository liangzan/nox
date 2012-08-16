var fs = require('fs')
  , _ = require('underscore');

/**
 * Mock - A module with comments for testing
 * the parser
 *
 * @namespace - mock
 */
var mock = exports;

/**
 * This is the single line description for the first function.
 *
 * @example
 *   mock.foo(true, function(err, result) {
 *     // result => 'foo'
 *   });
 *
 * @public
 * @param {Boolean} flag - This is a tag description
 * @callbackParam {Object} err
 * @callbackParam {String} result - This is a tag description
 *                                  that spans multiple lines
 */
mock.foo = function(flag, callback) {
  if (flag) {
    return callback(null, 'foo');
  } else {
    return callback('err', null);
  }
};

/**
 * This is the multi line description
 * for the second function
 *
 * @example
 *   mock.bar()
 *   // => 'bar'
 *
 * @public
 * @return {String} This is a return tag description
 */
mock.bar = function() {
  // this is a inner comment
  // and should not be regarded as a tag
  // but as part of the code
  return 'bar';
};
