module.exports = function(grunt) {
	grunt.initConfig({
		uglify: {
			options: {
				compress: false
			},
			js: {
				files: {
					"client/js/components.min.js": "client/components/**/*.js"
				}
			}
		},
		nodewebkit: {
			src: "./**/*",
			options: {
				build_dir: "./build",
				mac: false
			}
		}
	});
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-node-webkit-builder");
	grunt.registerTask(
		"build",
		function() {
			require("child_process").exec("rm -rf ./build");
			grunt.task.run("nodewebkit");
		}
	);
	grunt.registerTask(
		"default",
		"uglify"
	);
};
