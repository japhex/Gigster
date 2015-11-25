var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();

var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');


// Move static image files
// @output: /public/**/*
// 
// Development Task
gulp.task('assets:images:dev', ['clean:assets:images'], function() {
    return gulp.src('src/images/**/*')
        .pipe(gulp.dest('public/images'));
});


// Production Task
// - Image optimization for production
gulp.task('assets:images:production', ['clean:assets:images'], function() {
    return gulp.src('src/images/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('public/images'));
});