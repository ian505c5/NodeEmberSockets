module.exports = function(grunt){
	var jsFiles = [
				'build/js/libs/jquery-1.8.3.js',
				'build/js/libs/bootsrap.js',
				'build/js/libs/handlebars.js',
				'build/js/libs/ember-1.0.0-rc.1.js',
				'build/js/app.js',
				'build/js/controllers/**/*.js',
				'build/js/models/**/*.js',
				'build/js/views/**/*.js',
				'build/js/ajax_helpers.js',
				'build/js/router.js'
	]
	//Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			build: {
				src: ['build']
			},
			scripts: {
				src: ['build/**/*.js', '!build/js/main.min.js']
			}
		},
		copy: {
			build: {
				cwd: 'public',
				src: ['**'],
				dest: 'build',
				expand: true
			},
		},
		uglify: {
			build: {
				options: {
					mangle: false
				},
				files: {
					'build/js/main.min.js': jsFiles
				}
			}
		},
		watch: {
			scripts: {
				files: 'public/**/*.js',
				tasks: ['scripts']
			},
			copy: {
				files: ['public/**', '!public/**/*.js'],
				tasks: ['copy']
			}
		},
		connect: {
			server: {
				options: {
					port: 3000
				}
			}
		}
	});

	//load the tasks
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.registerTask(
		'build',
		'Compliles all of the assets and copies the files to the build directory',
		['clean:build','copy','scripts']
	);

	grunt.registerTask(
		'scripts',
		'Compile JS files',
		['uglify','clean:scripts']
	);
	grunt.registerTask(
		'node-server',
		'Start the node server',
		function(){
			require('./app.js').listen(3000);
		}
	);
	grunt.registerTask(
		'poop',
		'Watches the project for changes, automatically builds them and runs a server.',
		['build', 'watch']
	);
}