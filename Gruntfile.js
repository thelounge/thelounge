module.exports = function(grunt) {
	var libs = "client/js/libs/**/*.js";

	grunt.initConfig({
		watch: {
			files: libs,
			tasks: ["uglify"]
		},
		browserify: {
			dist: {
		    	files: {
		      		'client/js/compiled/lounge.js': [libs, 'client/js/libs/*.js', 'client/js/lounge.js', 'client/js/lounge.templates.js']
		    	}
		  	}
		},
		uglify: {
			options: {
				compress: false,
				sourceMap: true
			},
			js: {
				files: {
					"client/js/compiled/lounge.js": "client/js/compiled/lounge.js"
				}
			}
		}
	});
	
	grunt.loadNpmTasks("grunt-browserify");
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
					"-f", "client/js/lounge.templates.js"
				]
			}, function(err) {
				if (err) console.log(err);
			});
		}
	);
	grunt.registerTask(
		"default",
		["browserify", "uglify", "build"]
	);
};
