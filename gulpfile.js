// Include gulp
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();

// Directory structures
var DIRECTORIES = {
    src : '/',
    publicStyles : 'public/stylesheets/',
    privateStyles : 'src/stylesheets/',
    publicScripts : 'public/javascript/',
    privateScripts : 'src/javascript/',
    publicImages : 'public/images/'
}

// Function to fire everytime a file is changed and displayed the changes in the console
var changeEvent = function(evt) {
    plugins.util.log('File', plugins.util.colors.yellow(evt.path.replace(new RegExp('/.*(?=/' + DIRECTORIES.src + ')/'), '')), 'was', plugins.util.colors.green(evt.type));
};

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src(DIRECTORIES.privateStyles + '*.scss')
        .pipe(plugins.sass())
        .pipe(gulp.dest(DIRECTORIES.publicStyles));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(DIRECTORIES.privateScripts + '*.js')
        .pipe(plugins.filesize())
        .pipe(plugins.concat('build-concat.js'))
        .pipe(gulp.dest(DIRECTORIES.publicScripts))
        .pipe(plugins.rename('built.min.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(DIRECTORIES.publicScripts))
        .pipe(plugins.filesize());
});

// Minify all images on build
gulp.task('imageMin', function () {
    return gulp.src('src/images/*')
        .pipe(plugins.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}]
            //use: [plugins.imagemin-pngquant()]
        }))
        .pipe(gulp.dest(DIRECTORIES.publicImages));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(DIRECTORIES.privateScripts + '*.js', ['scripts']).on('change', function(event){
        changeEvent(event);
    });
    gulp.watch(DIRECTORIES.privateStyles + '*.scss', ['sass']).on('change', function(event){
        changeEvent(event);
    });
});

// Default Task
gulp.task('default', ['sass', 'scripts', 'imageMin', 'watch']);