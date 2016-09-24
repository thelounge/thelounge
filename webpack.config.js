module.exports = {
	entry: "./client/js/lounge.js",
	resolve: {
		extensions: ["", ".js"]
	},
	output: {
		path: "./client/js",
		filename: "bundle.js",
		publicPath: "/"
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel",
				query: {
					presets: ["es2015", "react"]
				}
			}
		]
	}
};
