// Include gulp and plugin dependenciesvar gulp = require('gulp');var requireDir = require('require-dir');var gulpLoadPlugins = require('gulp-load-plugins'),    plugins = gulpLoadPlugins();// All tasks are split into individual javascript files in the 'gulp' directory. Please keep tidy.requireDir('./gulp');// Run nodemon task and within it on start and change, intitiate 'watch' task to re-compile static filesgulp.task('start', function(){  plugins.nodemon({ script: 'server.js', ext: 'html js'})    .on('start', ['watch'])    .on('change', ['watch'])    .on('restart', function () {      console.log('restarted!');    });});// Default Taskgulp.task('default', ['clean:assets', 'assets:fonts', 'assets:images:dev', 'assets:css:dev', 'assets:scripts:dev', 'start']);// Default Taskgulp.task('production', ['clean:assets', 'assets:fonts', 'assets:images:production', 'assets:css:production', 'assets:scripts:production']);// Icon font taskgulp.task('icons', ['iconfont']);