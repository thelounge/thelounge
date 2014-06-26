module.exports = function(grunt) {
	var files = ["*.js", "lib/*"];
	grunt.initConfig({
		jshint: {
			files: files
		},
		uglify: {
			js: {
				files: {
					"client/js/components.min.js": ["client/components/*.js"]
				}
			}
		},
		watch: {
			files: files,
			tasks: ["default"]
		}
	});
	["jshint", "uglify", "watch"]
		.forEach(function(task) {
			grunt.loadNpmTasks("grunt-contrib-" + task);
		});
	grunt.registerTask(
		"default",
		["jshint", "uglify"]
	);
};
