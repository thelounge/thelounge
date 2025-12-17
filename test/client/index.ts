// Recursively load all JS files (test files) in the `js` folder
// Webpack's require.context is not in standard Node.js types
interface WebpackRequire extends NodeRequire {
	context(
		directory: string,
		useSubdirectories: boolean,
		regExp: RegExp
	): {
		keys(): string[];
		(id: string): unknown;
	};
}

const context = (require as WebpackRequire).context("./js", true, /.+\.js$/);
context.keys().forEach(context);

export default context;
