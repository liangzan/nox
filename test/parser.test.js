var parser = require('../lib/nox').parser
  , fs = require('fs')
  , path = require('path')
  , should = require('should')
  , exec = require('child_process').exec
  , _ = require('underscore');

var fixturePath = process.cwd() + '/test/fixtures/parser_fixture.js';

describe('parser', function() {
  it('should parse the file comments', function(done) {
    parser.parseFiles([fixturePath], function(err, result) {
      var expectedResult = [
	{
	  "filePath": fixturePath,
	  "documentation": [
	    {
	      "description": "Mock - A module with comments for testing the parser",
	      "code": "var mock = exports;\n\n",
	      "tags": [
		{
		  "tag": "namespace",
		  "type": "",
		  "name": "",
		  "description": "mock"
		}
	      ]
	    },
	    {
	      "description": "This is the single line description for the first function.",
	      "code": "mock.foo = function(flag, callback) {\n  if (flag) {\n    return callback(null, 'foo');\n  } else {\n    return callback('err', null);\n  }\n};\n\n",
	      "tags": [
		{
		  "tag": "example",
		  "description": "mock.foo(true, function(err, result) {\n  // result => 'foo'\n});"
		},
		{
		  "tag": "public",
		  "type": "",
		  "name": "",
		  "description": ""
		},
		{
		  "tag": "param",
		  "type": "Boolean",
		  "name": "flag",
		  "description": "This is a tag description"
		},
		{
		  "tag": "callbackParam",
		  "type": "Object",
		  "name": "err",
		  "description": ""
		},
		{
		  "tag": "callbackParam",
		  "type": "String",
		  "name": "result",
		  "description": "This is a tag description that spans multiple lines"
		}
	      ]
	    },
	    {
	      "description": "This is the multi line description for the second function",
	      "code": "mock.bar = function() {\n  // this is a inner comment\n  // and should not be regarded as a tag\n  // but as part of the code\n  return 'bar';\n};\n",
	      "tags": [
		{
		  "tag": "example",
		  "description": "mock.bar()\n// => 'bar'"
		},
		{
		  "tag": "public",
		  "type": "",
		  "name": "",
		  "description": ""
		},
		{
		  "tag": "return",
		  "type": "String",
		  "name": "This is a return tag description",
		  "description": ""
		}
	      ]
	    }
	  ]
	}
      ];
      expectedResult.should.eql(result);
      done();
    });
  });
});