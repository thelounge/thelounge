module.exports = {
	presets: [
		["@babel/preset-env", {bugfixes: true}],
		"babel-preset-typescript-vue3",
		"@babel/preset-typescript", // ? babel-preset-typescript-vue should be a drop-in replacement for @babel/typescript with vue support
		// "@vue/babel-preset-jsx",
	],
	plugins: ["@babel/plugin-transform-runtime"],
};
