module.exports = function(grunt) {

  // Project configuration.
    grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    dirs: {
        privateJs: 'src/javascript/',
        publicJs: 'public/javascript/',
        privateCss: 'src/stylesheets',
        publicCss: 'public/stylesheets',
        privateImages: 'src/images/',
        publicImage: 'public/images/'
    },    
    concat: {
        bar: {
            src: ['<%= dirs.privateJs %>jquery-ui-1.10.4.custom.min.js','<%= dirs.privateJs %>main.js'],
            dest: '<%= dirs.privateJs %>build-concat.js',
        },
    },
    uglify: {
        options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        build: {
            src: '<%= dirs.privateJs %>build-concat.js',
            dest: '<%= dirs.publicJs %>built.min.js'
        }
    },
    sass: {
        dist: {
            files: [{
                expand: true,
                cwd: '<%= dirs.privateCss %>',
                src: ['main.scss'],
                dest: '<%= dirs.publicCss %>',
                ext: '.css'
            }]
        }
    },
    watch: {
        // Watching and compiling SCSS files, also refreshing browser automagically
        options: {
            livereload:true
        },
        sass: {
            files: '<%= dirs.privateCss %>/{,*/}*.{scss,sass}',
            tasks: ['sass']
        },
        css: {
            files: ['css/*.scss'],
            tasks: ['sass'],
            options: {
                spawn: false,
            }
        }        
    },
    jsdoc : {
      dist: {
        //src: ['src/javascript/*.js'],
        src: ['<%= dirs.privateJs %>main.js'],
          options: {
            destination: 'docs'
          }
      }
    },
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: '<%= dirs.privateImages %>',
          src: ['**/*.{png,jpg,gif}'],
          dest: '<%= dirs.publicImages %>'
        }]
      }
    }    
  });
  // Load the plugin that provides the "concat" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // Grunt will generate jsdocs
  grunt.loadNpmTasks('grunt-jsdoc');
  // Grunt will watch all SASS files and compile to CSS
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  // Grunt build will run, compile and concatenate SASS files into single CSS file.
  grunt.loadNpmTasks('grunt-contrib-sass');
  // Grunt will watch all SASS files and compile to CSS
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['concat','uglify','jsdoc','imagemin','sass','watch']);

};