module.exports = {
	presets: [
		["@babel/preset-env", {bugfixes: true}],
		"@babel/preset-typescript",
		"@vue/babel-preset-jsx",
	],
	targets: "> 0.25%, not dead",
	// plugins: [["@babel/transform-typescript", {allowNamespaces: true}]],
};
