// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var size = require('gulp-filesize');

// Directory structures
var DIRECTORIES = {
    publicStyles : 'public/stylesheets/',
    privateStyles : 'src/stylesheets/',
    publicScripts : 'public/javascript/',
    privateScripts : 'src/javascript/',
    publicImages : 'public/images/'
}

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src(DIRECTORIES.privateStyles + '*.scss')
        .pipe(sass())
        .pipe(gulp.dest(DIRECTORIES.publicStyles));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(DIRECTORIES.privateScripts + '*.js')
        .pipe(size())
        .pipe(concat('build-concat.js'))
        .pipe(gulp.dest(DIRECTORIES.publicScripts))
        .pipe(rename('built.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(DIRECTORIES.publicScripts))
        .pipe(size());
});

// Minify all images on build
gulp.task('imageMin', function () {
    return gulp.src('src/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(DIRECTORIES.publicImages));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(DIRECTORIES.privateScripts + '*.js', ['scripts']);
    gulp.watch(DIRECTORIES.privateStyles + '*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['sass', 'scripts', 'imageMin', 'watch']);