var gulp = require('gulp');
var del = require('del');
var gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();

// Delete old asset files pre-build
gulp.task('clean:assets', function () {
    return del([
        'public/stylesheets/*',
        'public/javascript/*',
        'public/fonts/**/*',
        'public/images/**/*'
    ]);
});

gulp.task('clean:assets:css', function () {
    return del([
        'public/stylesheets/*'
    ]);
});

gulp.task('clean:assets:scripts', function () {
    return del([
        'public/javascript/*'
    ]);
});

gulp.task('clean:assets:fonts', function () {
    return del([
        'public/fonts/**/*'
    ]);
});

gulp.task('clean:assets:images', function () {
    return del([
        'public/images/**/*'
    ]);
});