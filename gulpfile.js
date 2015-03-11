// Include gulp
var gulp = require('gulp');
var pngquant = require('imagemin-pngquant');
var gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins({
                rename: {
                    'gulp-minify-css': 'minifycss'
                }
              });

// Directory structures
var DIRECTORIES = {
    src : '/',
    publicStyles : 'public/stylesheets/',
    privateStyles : 'src/stylesheets/',
    publicScripts : 'public/javascript/',
    privateScripts : 'src/javascript/',
    publicImages : 'public/images/'
};

// Function to fire everytime a file is changed and displayed the changes in the console
var changeEvent = function(evt) {
    plugins.util.log('File', plugins.util.colors.yellow(evt.path.replace(new RegExp('/.*(?=/' + DIRECTORIES.src + ')/'), '')), 'was', plugins.util.colors.green(evt.type));
};

// Clean public directories for styles/scripts
gulp.task('clean-styles', function(){
    return gulp.src(DIRECTORIES.publicStyles, {read: false})
        .pipe(plugins.clean());
});
gulp.task('clean-scripts', function(){
    return gulp.src(DIRECTORIES.publicScripts, {read: false})
        .pipe(plugins.clean());
});

// Compile Sass files, add autoprefixed CSS3 properties, minify the output CSS and finally concatenate into a single file for a single request
gulp.task('sass', ['clean-styles'], function() {
    return gulp.src(DIRECTORIES.privateStyles + '*.scss')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass({ style: 'expanded' }))
        .pipe(plugins.autoprefixer({browsers: ['last 3 versions']}))
        .pipe(plugins.minifycss({keepBreaks:false}))
        .pipe(plugins.concat('main.css'))
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest(DIRECTORIES.publicStyles))
        .pipe(plugins.size({showFiles:true}))
        .pipe(plugins.livereload());
});

// Browserify JS files
gulp.task('browserify', function(){
    return gulp.src(DIRECTORIES.privateScripts + 'main.js')
        .pipe(plugins.browserify())
        .pipe(plugins.rename('build.js'))
        .pipe(gulp.dest(DIRECTORIES.publicScripts))
        .pipe(plugins.concat('build.min.js'))
        .pipe(plugins.stripDebug())
        .pipe(plugins.uglify().on('error', function(e) { console.log('\x07',e.message); return this.end(); }))
        .pipe(plugins.size({showFiles:true}))
        .pipe(gulp.dest(DIRECTORIES.publicScripts))
        .pipe(plugins.jsdoc('./docs'));        
});

// Concatenate & Minify JS
gulp.task('scripts', ['clean-scripts'], function() {
    return gulp.src(DIRECTORIES.publicScripts + 'build.js')
        .pipe(plugins.concat('build.min.js'))
        .pipe(plugins.stripDebug())
        .pipe(plugins.uglify().on('error', function(e) { console.log('\x07',e.message); return this.end(); }))
        .pipe(plugins.size({showFiles:true}))
        .pipe(gulp.dest(DIRECTORIES.publicScripts))
        .pipe(plugins.jsdoc('./docs'));
});

// Minify all images on build
gulp.task('imagemin', function () {
    return gulp.src('src/images/*.png')
        .pipe(pngquant({ quality: '65-80', speed: 4})())
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
gulp.task('default', ['sass', 'browserify', 'scripts', 'watch']);