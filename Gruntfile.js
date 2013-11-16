module.exports = function(grunt){
	var jsFiles = [
				
	]
	//Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			build: {
				src: ['build']
			},
			scripts: {
				src: ['build/**/*.js', '!build/js/main.js']
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
		useminPrepare: {
			html: 'public/index.html',
			options: {
				dest: 'public'
			}
		},
		usemin: {
			html: 'build/index.html'
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
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-usemin');

	grunt.registerTask(
		'build',
		'Compliles all of the assets and copies the files to the build directory',
		['clean:build','copy','scripts']
	);

	grunt.registerTask(
		'scripts',
		'Compile JS files',
		['useminPrepare','concat','uglify','usemin','clean:scripts']
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
		['build']
	);
}