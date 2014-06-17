module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		uglify: {
			js: {
				files: {
					"client/js/libs.js": [
						"client/components/jquery/dist/jquery.js",
						"client/components/stickyscroll/stickyscroll.js",
						"client/components/jquery-cookie/jquery.cookie.js",
						"client/components/favico.js/favico.js"
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
