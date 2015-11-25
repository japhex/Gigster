var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();

// Move static font files
// @output: /public/**/*
// 
gulp.task('assets:fonts', ['clean:assets:fonts'], function() {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('public/fonts'));
});