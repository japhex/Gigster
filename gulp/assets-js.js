var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();

var runTimestamp = new Date(),
    hours = runTimestamp.getHours().toString().length == 1 ? '0' + runTimestamp.getHours() : runTimestamp.getHours(),
    minutes = runTimestamp.getMinutes().toString().length == 1 ? '0' + runTimestamp.getMinutes() : runTimestamp.getMinutes(),
    ampm = hours >= 12 ? 'pm' : 'am',
    timeStamp = hours + ':' + minutes + ' ' + ampm;

// Browserify JS files
gulp.task('browserify', function(){
    return gulp.src('src/javascript/main.js')
        .pipe(plugins.browserify())
        .pipe(plugins.rename('build.min.js'))
        .pipe(gulp.dest('public/javascript'));
});

// Concatenate & Minify JS after browserify task has run
// @waits-for: 'browserify' task
// @output: /public/javascript/main.build.js
// 
// Development Task
// - Browserify all files, concatenate into single request, notification upon completion
gulp.task('assets:scripts:dev', ['clean:assets:scripts', 'browserify'], function() {
    return gulp.src('public/javascript/build.min.js')
        .pipe(plugins.concat('build.min.js'))
        .pipe(plugins.size({showFiles:true,title:'Minified javascript'}))
        .pipe(gulp.dest('public/javascript'))
        .pipe(plugins.notify({
            message: 'Re-compilation of JS file <%= file.relative %> complete | <%= options.date %>', 
            templateOptions: {date: timeStamp}, 
            onLast:true
        }));
});

// Production Task
// - Browserify, concatenate, strip all console.log statements and minify. Single file served.
gulp.task('assets:scripts:production', ['clean:assets:scripts', 'browserify'], function() {
    return gulp.src('public/javascript/build.min.js')
        .pipe(plugins.concat('build.min.js'))
        .pipe(plugins.stripDebug())
        .pipe(plugins.uglify())
        .pipe(gulp.dest('public/javascript'));
});