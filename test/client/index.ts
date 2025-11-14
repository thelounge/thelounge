// Recursively load all JS files (test files) in the `js` folder
// Webpack's require.context is not in standard Node.js types
const context = (require as any).context("./js", true, /.+\.js$/);
context.keys().forEach(context);

module.exports = context;
