module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      bar: {
        src: ['src/javascript/jquery-ui-1.10.4.custom.min.js','src/javascript/main.js'],
        dest: 'src/javascript/build-concat.js',
      },
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/javascript/build-concat.js',
        dest: 'public/javascript/built.min.js'
      }
    },
   sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/stylesheets',
          src: ['main.scss'],
          dest: 'public/stylesheets',
          ext: '.css'
        }]
      }
    },
    watch: {
      sass: {
        files: 'public/stylesheets/{,*/}*.{scss,sass}',
        tasks: ['sass']
      }
    },
    jsdoc : {
      dist: {
        //src: ['src/javascript/*.js'],
        src: ['src/javascript/main.js'],
          options: {
            destination: 'docs'
          }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // Load the plugin that provides the "concat" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  // Grunt build will run, compile and concatenate SASS files into single CSS file.
  grunt.loadNpmTasks('grunt-contrib-sass');
  // Grunt will watch all SASS files and compile to CSS
  grunt.loadNpmTasks('grunt-contrib-watch');
  // Grunt will generate jsdocs
  grunt.loadNpmTasks('grunt-jsdoc');

  // Default task(s).
  grunt.registerTask('default', ['concat','uglify','jsdoc','sass','watch']);

};