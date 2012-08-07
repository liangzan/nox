# Nox

Nox is a documentation generator for Node.js projects. It is heavily influenced by [dox](https://github.com/visionmedia/dox), hence the name. It aims to be compatible with [JSDoc markup](http://code.google.com/p/jsdoc-toolkit/wiki/TagReference). Currently Nox implements a subset of the tags available in JSDoc. You can find out from the [Nox Syntax Reference](https://github.com/shiawuen/nox/blob/master/Nox-Syntax-Reference.md).

We aim to support [Coffeescript](http://coffeescript.org) without the need to compile to Javascript in __v0.2__. For now, as long as the compiled Javascript is compatible with the format, it should work.

## Installation

You can install locally.

``` sh
npm install nox
```

Or globally

``` sh
npm install -g nox
```

## Usage

``` sh
nox [OPTION] [FILES]
```

### Options

#### -o, --output-dir

Specifies the directory where the documentation will be saved at. Defaults to __doc__. The directory should be relative to the working directory.

#### -h, --help

Shows the help message with the list of options.

#### -v, --version

Show the version of the package

### .nox.opts file

You can place a __.nox.opts__ file on your project root. Nox will load the options specified from the file. However options stated on the command line will always take precendence.

The format of the options should be in JSON format. There is no point inventing _yet another custom serialization format_ since JSON is widely accepted. Here is an example. If the option do not expect an argument, use __true__ as the argument.

``` javascript
{
 "o": "doc",
 "help": true
}
```

### Files

Nox will read files from __./lib/*.js__ by default. You can specify the files in a variety of ways.

By the name of the directory. Nox will include all files under the directory.

``` sh
nox lib
```

By the file name

``` sh
nox lib/foo.js
```

By a regular expression. Nox will include all files that fits into the expression.

``` sh
nox lib/foo/*.js
```

Multiple expressions are separated by commas. Below is an example that searches for files in __lib__ and __src__ directory.

``` sh
nox lib,src
```

## License

Copyright (c) 2012 Wong Liang Zan. MIT License
