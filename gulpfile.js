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
    publicImages : 'public/images/',
    publicFonts : 'public/fonts/',
    privateFonts : 'src/fonts/'
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
// @waits-for: 'clean-styles' task
// @output: /public/stylesheets/main.css
// 
gulp.task('sass', ['clean-styles'], function() {
    return gulp.src(DIRECTORIES.privateStyles + '*.scss')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass({ style: 'expanded',errLogToConsole: true }))
        .pipe(plugins.autoprefixer({browsers: ['last 3 versions']}))
        .pipe(plugins.minifycss({keepBreaks:false}))
        .pipe(plugins.concat('main.css'))
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest(DIRECTORIES.publicStyles))
        .pipe(plugins.size({showFiles:true,title:'Minfied CSS'}))
        .pipe(plugins.livereload());
});

// Browserify JS files
gulp.task('browserify', function(){
    return gulp.src(DIRECTORIES.privateScripts + 'main.js')
        .pipe(plugins.browserify())
        .pipe(plugins.rename('build.min.js'))
        .pipe(gulp.dest(DIRECTORIES.publicScripts))
});

// Concatenate & Minify JS after browserify task has run
// @waits-for: 'browserify' and 'clean-scripts' tasks
// @output: /public/javascript/build.min.js
// 
gulp.task('scripts', ['browserify','clean-scripts'], function() {
    return gulp.src(DIRECTORIES.publicScripts + 'build.min.js')
        .pipe(plugins.concat('build.min.js'))
        //.pipe(plugins.stripDebug()) --> USE FOR PRODUCTION
        .pipe(plugins.uglify().on('error', function(e) { console.log('\x07',e.message); return this.end(); }))
        .pipe(plugins.size({showFiles:true,title:'Minfied javascript'}))
        .pipe(gulp.dest(DIRECTORIES.publicScripts))
        .pipe(plugins.jsdoc('./docs'));
});

// Minify all images on separate build task
// @output: /public/images/[images].png
gulp.task('imagemin', function () {
    return gulp.src('src/images/*.png')
        .pipe(pngquant({ quality: '65-80', speed: 4})())
        .pipe(gulp.dest(DIRECTORIES.publicImages));
});

// Move fonts to public directory
// @output: /public/fonts/[font].woff
gulp.task('fonts', function () {
    return gulp.src('src/fonts/*')
        .pipe(gulp.dest(DIRECTORIES.publicFonts));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch([DIRECTORIES.privateScripts + '*.js',DIRECTORIES.privateScripts + '/modules/*.js'], ['browserify', 'scripts']).on('change', function(event){
        changeEvent(event);
    });
    gulp.watch([DIRECTORIES.privateStyles + '*.scss',DIRECTORIES.privateStyles + '/_partials/*.scss',DIRECTORIES.privateStyles + '/_partials/models/gigs/*.scss',DIRECTORIES.privateStyles + '/_partials/models/user/*.scss'], ['sass']).on('change', function(event){
        changeEvent(event);
    });
});

// Run nodemon task and within it on start and change, intitiate 'watch' task to re-compile static files
gulp.task('start', function(){
  plugins.nodemon({ script: 'server.js', ext: 'html js'})
    .on('start', ['watch'])
    .on('change', ['watch'])
    .on('restart', function () {
      console.log('restarted!');
    });
});

// Default Task
gulp.task('default', ['sass', 'browserify', 'scripts', 'fonts', 'start']);
gulp.task('image', ['imagemin']);