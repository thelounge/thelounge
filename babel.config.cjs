module.exports = {
	presets: [
		["@babel/preset-env", {bugfixes: true}],
		"babel-preset-typescript-vue", // TODO: last updated 2020-05-18, probably seek replacement after vue 3.x
		// "@babel/typescript", // ? babel-preset-typescript-vue should be a drop-in replacement for @babel/typescript with vue support
		// "@vue/babel-preset-jsx",
	],
	targets: "> 0.25%, not dead",
};
