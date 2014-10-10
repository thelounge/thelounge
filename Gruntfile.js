module.exports = function(grunt) {
	var libs = "client/js/libs/**/*.js";
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
					"client/js/libs.min.js": libs
				}
			}
		}
	});
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.registerTask(
		"build",
		function() {
			grunt.util.spawn({
				cmd: "node",
				args: [
					"node_modules/handlebars/bin/handlebars",
					"client/views/",
					"-e", "tpl",
					"-f", "client/js/shout.templates.js"
				]
			}, function(err) {
				if (err) console.log(err);
			});
		}
	);
	grunt.registerTask(
		"default",
		["uglify", "build"]
	);
};
