var utility = require('../lib/nox').utility
  , fs = require('fs')
  , path = require('path')
  , should = require('should')
  , exec = require('child_process').exec
  , _ = require('underscore');

var tempDir = process.cwd() + '/tmp';

describe('utility', function() {
  describe('readdirRecursive', function() {
    describe('valid directory path', function() {
      before(function(done) {
	fs.mkdirSync(tempDir);
	fs.mkdirSync(tempDir + '/dao');
	fs.mkdirSync(tempDir + '/dar');
	fs.mkdirSync(tempDir + '/dao/eaa');
	fs.mkdirSync(tempDir + '/dao/eao');

	fs.openSync(tempDir + '/foo', 'w');
	fs.openSync(tempDir + '/dao/eaa/frr', 'w');
	done();
      });

      after(function(done) {
	var command = 'rm -rf ' + process.cwd() + '/tmp';
	exec(command, function(err) {
	  if (err) { console.log(err); }
	  done();
	});
      });

      it('should return the files in the directory', function(done) {
	utility.readdirRecursive(tempDir, function(err, filePaths) {
	  filePaths.length.should.eql(2);
	  filePaths.should.include(tempDir + '/foo');
	  filePaths.should.include(tempDir + '/dao/eaa/frr');
	  done();
	});
      });
    });

    describe('non existent path', function() {
      it('should return null', function(done) {
	utility.readdirRecursive(tempDir, function(err, filePaths) {
	  should.not.exist(filePaths);
	  done();
	});
      });
    });

    describe('a file path', function() {
      before(function(done) {
	fs.mkdirSync(tempDir);
	fs.openSync(tempDir + '/foo', 'w');
	done();
      });

      after(function(done) {
	var command = 'rm -rf ' + process.cwd() + '/tmp';
	exec(command, function(err) {
	  if (err) { console.log(err); }
	  done();
	});
      });

      it('should return null', function(done) {
	utility.readdirRecursive(tempDir + '/foo', function(err, filePaths) {
	  should.not.exist(filePaths);
	  done();
	});
      });
    });
  });
});
