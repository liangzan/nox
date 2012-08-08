var cli = require('../lib/nox').cli
  , fs = require('fs')
  , path = require('path')
  , spawn = require('child_process').spawn
  , exec = require('child_process').exec
  , should = require('should')
  , async = require('async')
  , _ = require('underscore');

var command = process.cwd() + '/bin/nox';

function removeOptionFile(callback) {
  var optsfilePath = process.cwd() + '/.nox.opts';
  fs.exists(optsfilePath, function(exists) {
    if (exists) {
      return fs.unlink(optsfilePath, function(err) {
	if (err) { console.log(err); }
	return callback();
      });
    } else {
      return callback();
    }
  });
}

describe('cli', function() {
  describe('start', function() {
    describe('no file options, with command option h', function() {
      before(function(done) {
	removeOptionFile(done);
      });

      it('should invoke help function', function(done) {
	var nox = spawn(command, ['-h']);
	var output = '';

	nox.stdout.on('data', function(data) {
	  output += data.toString();
	});

	nox.on('exit', function(code) {
	  (/Usage: nox \[OPTIONS\] \[FILES\]/.test(output)).should.eql(true);
	  done();
	});
      });
    });

    // no options file with help
    describe('no file options, with command option help', function() {
      before(function(done) {
	removeOptionFile(done);
      });

      it('should invoke help function', function(done) {
	var nox = spawn(command, ['--help']);
	var output = '';

	nox.stdout.on('data', function(data) {
	  output += data.toString();
	});

	nox.on('exit', function(code) {
	  (/Usage: nox \[OPTIONS\] \[FILES\]/.test(output)).should.eql(true);
	  done();
	});
      });
    });

    describe('no file options, with command option v', function() {
      before(function(done) {
	removeOptionFile(done);
      });

      it('should invoke version function', function(done) {
	var nox = spawn(command, ['-v']);
	var output = '';

	nox.stdout.on('data', function(data) {
	  output += data.toString();
	});

	nox.on('exit', function(code) {
	  (/v\d+\.\d+\.\d+/.test(output)).should.eql(true);
	  done();
	});
      });
    });

    // no options file with help
    describe('no file options, with command option version', function() {
      before(function(done) {
	removeOptionFile(done);
      });

      it('should invoke version function', function(done) {
	var nox = spawn(command, ['--version']);
	var output = '';

	nox.stdout.on('data', function(data) {
	  output += data.toString();
	});

	nox.on('exit', function(code) {
	  (/v\d+\.\d+\.\d+/.test(output)).should.eql(true);
	  done();
	});
      });
    });

  });
});