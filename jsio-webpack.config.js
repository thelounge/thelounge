'use strict';
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';


const configure = (configurator, options) => {
	configurator.merge({
		entry: {
			clientUI: path.resolve(__dirname, '2.0'),
		},
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: '[name].js',
			publicPath: NODE_ENV === 'production' ? '/dist/' : '/',
		},
		resolve: {
			alias: {
				clientUI: path.resolve(__dirname, '2.0')
			}
		}
	});

	configurator.plugin('htmlWebpack', HtmlWebpackPlugin, [{
		title: 'Lounge Client',
		template: path.resolve(__dirname, '2.0', 'index.html'),
		chunks: ['clientUI']
	}]);

	options.useReactHot = true;

	return configurator;
};

// const postConfigure = (configurator) => {
// 	configurator.merge((existing) => {
// 		return existing;
// 	});
// };


module.exports = {
	configure: configure
	// postConfigure: postConfigure
};
