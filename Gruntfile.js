module.exports = function(grunt) {
	var components = "";
	var files = [
		"./lib/**/*.js",
		"./client/js/chat.js"
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
					"client/js/components.min.js": [
						"client/components/*.js",
						"client/components/jquery/*.js"
					]
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
