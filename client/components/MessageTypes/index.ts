// This creates a version of `require()` in the context of the current
// directory, so we iterate over its content, which is a map statically built by
// Webpack.
// Second argument says it's recursive, third makes sure we only load templates.
const requireViews = require.context(".", false, /\.vue$/);

export default requireViews.keys().reduce((acc: Record<string, any>, path) => {
	acc["message-" + path.substring(2, path.length - 4)] = requireViews(path).default;

	return acc;
}, {});
