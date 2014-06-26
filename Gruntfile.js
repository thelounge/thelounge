module.exports = function(grunt) {
	var files = [
		"./lib/**/*.js",
		"./client/js/shout.js"
	];
	grunt.initConfig({
		watch: {
			files: files,
			tasks: ["jshint"]
		},
		jshint: {
			files: files
		},
		uglify: {
			js: {
				files: {
					"client/js/components.min.js": ["client/components/*.js"]
				}
			}
		}
	});
	["watch", "jshint", "uglify"]
		.forEach(function(task) {
			grunt.loadNpmTasks("grunt-contrib-" + task);
		});
	grunt.registerTask(
		"default",
		["uglify"]
	);
};
