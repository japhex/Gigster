module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      all: ['public/javascript/main.js']
    },  
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['public/javascript/*.js'],
        dest: 'public/javascript/built.js',
      },
    },
    uglify: {
      my_target: {
        files: {
          'public/javascript/built.min.js': ['public/javascript/built.js']
        }
      }
    }
  });

  // JSHint
  grunt.loadNpmTasks('grunt-contrib-jshint');
  // Concatenate all files into single file
  grunt.loadNpmTasks('grunt-contrib-concat');
  // Uglify/Minify code
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('default', ['concat']);
  grunt.registerTask('default', ['uglify']);

};