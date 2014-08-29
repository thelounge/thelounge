module.exports = function(grunt) {
	var libs = "client/js/**/*.js";
	grunt.initConfig({
		watch: {
			files: libs,
			tasks: ["uglify"]
		},
		uglify: {
			options: {
				compress: false
			},
			js: {
				files: {
					"client/build/build.js": libs
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
