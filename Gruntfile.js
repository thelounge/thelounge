module.exports = function(grunt) {
	var libs = "client/js/libs/**/*.js";
	grunt.initConfig({
		watch: {
			files: libs,
			tasks: ["uglify"]
		},
		uglify: {
			options: {
				sourceMap: true,
				compress: false
			},
			js: {
				files: {
					"client/js/libs.min.js": libs
				}
			}
		}
	});
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.registerTask(
		"default",
		["uglify"]
	);
};
