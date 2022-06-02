// Recursively load all JS files (test files) in the `js` folder
// @ts-expect-error ts-migrate(2339) FIXME: Property 'context' does not exist on type 'NodeReq... Remove this comment to see the full error message
const context = require.context("./js", true, /.+\.js$/);
context.keys().forEach(context);

module.exports = context;
