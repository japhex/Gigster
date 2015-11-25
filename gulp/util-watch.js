var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();

// Function to fire everytime a file is changed and display the changes in the console
var changeEvent = function(evt) {
    plugins.util.log('File', plugins.util.colors.yellow(evt.path.replace(new RegExp('/.*(?=/src)/'), '')), 'was', plugins.util.colors.green(evt.type));
};

// Watch Files For Changes
// @wait-for: 'css' and 'scripts' tasks. 'Scripts' is the last one that runs. IMPORTANT: If another task is added to the default gulp task below, please add this to the queue. We always want the 'watch' task to fire absolute last.
gulp.task('watch', ['assets:css:dev', 'assets:scripts:dev'], function() {
    plugins.livereload.listen();
    gulp.watch('src/javascript/**/*.js', ['browserify', 'assets:scripts:dev']).on('change', function(event){
        changeEvent(event);
    });
    gulp.watch('src/stylesheets/**/*.scss', ['assets:css:dev']).on('change', function(event){
        changeEvent(event);
    });
    gulp.watch('src/fonts/**/*', ['assets:fonts']).on('change', function(event){
        changeEvent(event);
    });
    gulp.watch('src/images/**/*', ['assets:images:dev']).on('change', function(event){
        changeEvent(event);
    });
});