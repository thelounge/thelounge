"use strict";

// Recursively load all JS files (test files) in the `js` folder
const context = require.context("./js", true, /.+\.js$/);
context.keys().forEach(context);

module.exports = context;
