# Nox Syntax Reference

While Nox aims to be compatible with JSDoc, we may introduce new tags. Use this as the canonical reference. Much of this document is taken from the excellent [Google Javascript Style Guide](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml). Nox does not implement the full set of tags. There is a slight difference with the styling as well. We are much influenced by [tomdoc](http://tomdoc.org).

## Comment syntax

``` javascript
/**
 * JSDoc always begins with a slash and 2 asterisks.
 * There is no provision for inline tags.
 * @block tags should always start on their own line
 */
function foo() {
}
```

## Indentation

If you have to line break a block tag, you should treat this as breaking a code statement and indent it four spaces.

``` javascript
/**
 * Illustrates line wrapping for long param/return descriptions.
 * @param {String} foo - This is a param with a description too long to fit in
 *     one line. Description could start with a name followed by a dash.
 * @return {Number} This returns something that has a description too long to
 *     fit in one line.
 */
function bar(foo) {
  return 5;
};
```

It is acceptable to line up the description.

``` javascript
/**
 * This is NOT the preferred indentation method.
 * @param {String} foo - This is a param with a description too long to fit in
 *                     one line.
 * @return {Number} This returns something that has a description too long to
 *                  fit in one line.
 */
function bar(foo) {
  return 5;
};
```

## Top/File-Level Comments

The top level comment is designed to orient readers unfamiliar with the code to what is in this file. It should provide a description of the file's contents, its author(s), and any dependencies or compatibility information. As an example:

``` javascript
/**
 * Description of file, its uses and information
 * about its dependencies.
 *
 * @author user@google.com (Firstname Lastname)
 * Copyright 2009 Google Inc. All Rights Reserved.
 */
```

## Class Comments

Classes must be documented with a description, and appropriate type tags.

``` javascript
/**
 * Class making something fun and easy.
 *
 * @param {String} arg1 - An argument that makes this more interesting.
 * @param {Array.<number>} arg2 - List of numbers to be processed.
 * @constructor
 * @extends {goog.Disposable}
 */
project.MyClass = function(arg1, arg2) {
  // ...
};
goog.inherits(project.MyClass, goog.Disposable);
```

## Method and Function Comments

A description must be provided along with parameters. Method descriptions should start with a sentence written in the third person declarative voice.

``` javascript
/**
 * Operates on an instance of MyClass and returns something.
 *
 * @param {project.MyClass} obj - Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {Boolean} Whether something occured.
 */
function PR_someMethod(obj) {
  // ...
}
```

## Property Comments

For simple getters that take no parameters and have no side effects, the description can be omitted.

``` javascript
/**
 * Maximum number of things per pane.
 * @type {Number}
 */
project.MyClass.prototype.someProperty = 4;
```

## Tag Reference

### @author

Documents the author of the file.

``` javascript
/**
 * @author kuth@google.com (Uthur Pendragon)
 */
```

### @constant

Marks a variable as a read only constant.

``` javascript
/**
 * My namespace's favorite kind of beer.
 * @constant
 * @type {String}
 */
mynamespace.MY_BEER = 'stout';
```

### @constructor

Indicates the constructor.

``` javascript
/**
 * A rectangle.
 * @constructor
 */
function GM_Rect() {
  ...
}
```

### @deprecated

Used to indicate that a function should not be used any more. Always provide instructions on what should be used instead.

``` javascript
/**
 * Determines whether a node is a field.
 *
 * @return {Boolean} True if the contents of
 *     the element are editable, but the element
 *     itself is not.
 * @deprecated Use isField().
 */
BN_EditUtil.isTopEditableField = function(node) {
  // ...
};
```

### @enum

An enumerated type.

``` javascript
/**
 * Enum for tri-state values.
 *
 * @enum {Number}
 */
project.TriState = {
  TRUE: 1,
  FALSE: -1,
  MAYBE: 0
};
```

### @extends

Indicates that the class is inherited from another. Usually used at the constructor.

``` javascript
/**
 * Immutable empty node list.
 *
 * @constructor
 * @extends goog.ds.BasicNodeList
 */
goog.ds.EmptyNodeList = function() {
  ...
};
```

### @override

Indicates that the method or property has overridden its parent class.

``` javascript
/**
 * @return {String} Human-readable representation of project.SubClass.
 * @override
 */
project.SubClass.prototype.toString() {
  // ...
};
```

### @param

Used with method, function and constructor calls to document the arguments of a function.

Type names must be enclosed in curly braces. If the type is omitted, the compiler will not type-check the parameter.

``` javascript
/**
 * Queries a Baz for items.
 *
 * @param {Number} groupNum - Subgroup id to query.
 * @param {String|Number|Null} term - An itemName,
 *     or itemId, or null to search everything.
 */
goog.Baz.prototype.query = function(groupNum, term) {
  // ...
};
```

### @public

Indicates that the member is public

``` javascript
/**
 * Handlers that are listening to this logger.
 *
 * @type Array.<Function>
 * @public
 */
this.handlers_ = [];
```

### @private

Indicates that the member is private

``` javascript
/**
 * Handlers that are listening to this logger.
 *
 * @type Array.<Function>
 * @private
 */
this.handlers_ = [];
```

### @return

Documents the return type. If there is no return value, do not use it. Type name should be enclosed in curly braces.

``` javascript
/**
 * @return {String} The hex ID of the last item.
 */
goog.Baz.prototype.getLastId = function() {
  // ...
  return id;
};
```

### @callbackParam

Documents the parameters of the callback function. It should be order of the parameters returned. There should be a name followed by the description of the parameter.

``` javascript
/**
 * @callbackParam {String} foo - The name of the user
 */
function bar(callback) {
  ...
  return callback(foo);
}
```

### @see

Reference to another function or class

``` javascript
/**
 * Adds a single item, recklessly.
 *
 * @see #addSafely
 * @see goog.Collect
 * @see goog.RecklessAdder#add
 */
```

### @type

Documents the type that the member belongs to

``` javascript
/**
 * @type Color
 */
function getColor() {
}
```

### @version

Documents what version the member belongs to

``` javascript
/**
 * @class
 * @version 2001 beta release
 */
function Hal() {
    this.sing = function(song) {
    }
}
```

### @namespace

Documents what namespace this member belongs to

``` javascript
/**
 *  @namespace Extensions
 */
var function pluginManager {
}

exports.Extensions = pluginManager;
```

### @memberOf

Documents the parent of the member

``` javascript
var Tools = {};

/** @namespace */
Tools.Dom = {};

/** @memberOf Tools.Dom */
var hiliteSearchTerm = function(term) {
}

Tools.Dom.highlightSearchTerm = hiliteSearchTerm;
```

### @throws

Documents the exceptions the function may throw

``` javascript
/**
 * @throws {OutOfMemeory} If the file is too big.
 */
function processFile(path) {

}
```

### @example

Allows you to provide an example of the usage. Code should be provided below the tag and indented with 2 spaces.

``` javascript
/**
 * @example
 *   var bleeper = makeBleep(3);
 *   bleeper.flop();
 */
```
