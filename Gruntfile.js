module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		uglify: {
			js: {
				files: {
					"client/grunt/test.min.js": [
						"client/grunt/test-1.js",
						"client/grunt/test-2.js"
					]
				}
			}
		}
	});

	// Load and run uglify.
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.registerTask(
		"default",
		["uglify"]
	);
};
