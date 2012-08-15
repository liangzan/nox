var fs = require('fs')
  , path = require('path')
  , async = require('async')
  , _ = require('underscore');

/**
 * Parser - Parses the source
 *
 * @namespace parser
 */
var parser = exports;

/**
 * Parse the files and return the results in JSON
 *
 * @example
 *   parser.parseFiles(['/path/to/foo'], function(err, results) {
 *     // results => [...]
 *   });
 *
 * @public
 * @param {Array} filePaths - The Array of String file paths to
 *                            the source files
 * @callbackParam {Object} err - The error object
 * @callbackParam {Object} results - The parsed results
 */
parser.parseFiles = function(filePaths, callback) {
  return async.map(filePaths, parser.parseFile, callback);
};

/**
 * Parsed the invidual file and return the results in JSON
 *
 * @example
 *   parser.parseFile('/path/to/file', function(err, result) {
 *     // result => [....]
 *   });
 *
 * @public
 * @param {String} filePath - The String file paths to
 *                            the source file
 * @callbackParam {Object} err - The error object
 * @callbackParam {Object} result - The parsed result
 */
parser.parseFile = function(filePath, callback) {
  fs.readFile(filePath, 'utf8', function(err, data) {
    if (err) {
      return callback(err, null);
    } else {
      var regionRegex = /\/\*\*[\n\r]+/g;
      var regions = data.split(regionRegex);
      var parsedFileOutput = {};
      parsedFileOutput.filePath = filePath;
      parsedFileOutput.documentation = _.chain(regions)
	.map(parseCommentRegion)
	.compact()
	.value();
      return callback(null, parsedFileOutput);
    }
  });
};

/**
 * Parses the comment + code chunk and returns
 * the result in JSON
 *
 * @example
 *   parseCommentRegion("some code + comment");
 *   // => {...}
 *
 * @private
 * @param {String} region - The code and comment chunk
 * @return {Object} The parsed result
 */
function parseCommentRegion(region) {
  var parsedComment = extractCommentFromRegion(region);
  var parsedCode = extractCodeFromRegion(region);

  if (parsedComment === null || parsedCode === null) {
    return '';
  } else {
    var parsedOutput = {};
    var commentTagRegions = extractToTagRegions(parsedComment);
    parsedOutput.description = sanitizeComment(commentTagRegions[0]);
    parsedOutput.code = parsedCode;
    parsedOutput.tags = _.chain(commentTagRegions)
      .tail()
      .map(parseCommentTag)
      .compact()
      .value();
    return parsedOutput;
  }
}

/**
 * Parses the comment tags and returns them in JSON
 *
 * @example
 *   parseCommentTag("comments with tags");
 *   // => {...}
 *
 * @private
 * @param {String} comment - The comment chunk
 * @return {Object} The parsed comment
 */
function parseCommentTag(comment) {
  if (isExampleTag(comment)) {
    return extractExampleTagCode(comment);
  } else {
    var tagComponents = extractTagComponents(comment);
    if (tagComponents === null) {
      return '';
    } else {
      return {
	tag: formatTagComponent(tagComponents[1]),
	type: sanitizeType(formatTagComponent(tagComponents[2])),
	name: formatTagComponent(tagComponents[3]),
	description: formatTagComponent(tagComponents[4])
      };
    }
  }
}

/**
 * Extracts the comment from a comment + code chunk
 *
 * @example
 *   extractCommentFromRegion("comment + code");
 *   // => {...}
 *
 * @private
 * @param {String} comment - The comment + code chunk
 * @return {String} The comment
 */
function extractCommentFromRegion(comment) {
  var commentRegex = /\s*\*[^\n\r]*\s*[\n\r]+/gm;
  var parsedCommentResult = comment.match(commentRegex);
  if (parsedCommentResult !== null) {
    return parsedCommentResult.join('');
  } else {
    return null;
  }
}

/**
 * Extracts the code from a comment + code chunk
 *
 * @example
 *   extractCodeFromRegion("comment + code");
 *   // => {...}
 *
 * @private
 * @param {String} comment - The comment + code chunk
 * @return {String} The code
 */
function extractCodeFromRegion(comment) {
  var codeRegex = /^(?!\s*\*).+\s*[\n\r]+/gm;
  var parsedCodeResult = comment.match(codeRegex);
  if (parsedCodeResult !== null) {
    return parsedCodeResult.join('');
  } else {
    return null;
  }
}

/**
 * Splits the comment by its tags
 *
 * @example
 *   extractToTagRegions("comment")
 *   // => ["public", "..."]
 *
 * @private
 * @param {String} comment - The comment chunk
 * @return {Array} The Array of tags
 */
function extractToTagRegions(comment) {
  var commentTagRegex = /\s*\*\s*@/gm;
  return comment.split(commentTagRegex);
}

/**
 * Removes the asterisks and new lines from the comment
 *
 * @example
 *   sanitizeComment("* foo\n");
 *   // => "foo"
 *
 * @private
 * @param {String} comment - The comment chunk
 * @return {String} The comment without the asterisks and new lines
 */
function sanitizeComment(comment) {
  var commentWithoutNewline = comment.replace(/[\r\n]/gm, ' ');
  var commentCharRegex = /\s*\*\/?\s*/g;
  return commentWithoutNewline.replace(commentCharRegex, ' ').trim();
}

/**
 * Trims whitespace from the tag. Returns an empty string
 * for null cases.
 *
 * @example
 *   formatTagComponent(" foo ");
 *   // => "foo"
 *
 * @private
 * @param {String} tagComponent - A string
 * @return {String} String without whitespace
 */
function formatTagComponent(tagComponent) {
  return (tagComponent || '').trim();
}

/**
 * Breaks down a comment tag into its components
 *
 * @example
 *   extractTagComponents("param {String} foo - bar")
 *   // => ["param", "{String}", ...]
 *
 * @private
 * @param {String} comment - The comment tag
 * @return {Array} The match result
 */
function extractTagComponents(comment) {
  var tagComponentRegex = /(\w+)\s*(\{\w+\})?\s?([^-]+)?\s?-?\s?(.*)?/;
  return sanitizeComment(comment).match(tagComponentRegex);
}

/**
 * Removes the asterisks from the example description
 *
 * @example
 *   sanitizeExampleCode("foo\n * bar")
 *   // => "foo bar"
 *
 * @private
 * @param {String} comment - The description for the example tag
 * @return {String} The cleaned up example description
 */
function sanitizeExampleCode(comment) {
  var commentCharRegex = /\s*\*\s\s\s/g;
  return comment.replace(commentCharRegex, '');
}

/**
 * Parses the example tag
 *
 * @example
 *   extractExampleTagCode("example tag")
 *   // => {tag: 'example', description: 'foo'}
 *
 * @private
 * @param {String} exampleTag - The example comment chunk
 * @return {Object} The parsed example tag
 */
function extractExampleTagCode(exampleTag) {
  var splittedExampleTags = exampleTag
	.replace(/example\n/, '')
	.split("\n");
  var sanitizedExampleCode = _.map(splittedExampleTags, sanitizeExampleCode);
  if (/\*/.test(_.last(sanitizedExampleCode))) {
    sanitizedExampleCode.pop();
  }
  return {tag: 'example', description: sanitizedExampleCode.join("\n")};
}

/**
 * Checks if the comment tag is an example tag
 *
 * @example
 *   isExampleTag("comment")
 *   // => true
 *
 * @private
 * @param {String} comment - The comment chunk
 * @return {Boolean}
 */
function isExampleTag(comment) {
  return /^example\n/.test(comment);
}

/**
 * Removes the curly braces from the type tag
 *
 * @example
 *   sanitizeType("{foo}")
 *   // => "foo"
 *
 * @private
 * @param {String} rawType
 * @return {String}
 */
function sanitizeType(rawType) {
  return rawType.replace(/[\{\}]/g, '');
}
