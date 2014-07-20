module.exports = function(grunt) {
	grunt.initConfig({
		uglify: {
			options: {
				compress: false
			},
			js: {
				files: {
					"client/js/libs.min.js": "client/js/libs/**/*.js"
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
