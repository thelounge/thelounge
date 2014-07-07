module.exports = function(grunt) {
	grunt.initConfig({
		uglify: {
			js: {
				files: {
					"client/js/components.min.js": [
						"client/components/*.js",
						"client/components/**/*.js"
					]
				}
			}
		}
	});
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.registerTask(
		"default",
		["uglify"]
	);
};
