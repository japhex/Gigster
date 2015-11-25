var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins({rename: {'gulp-minify-css': 'minifycss'}});

var runTimestamp = new Date(),
    hours = runTimestamp.getHours().toString().length == 1 ? '0' + runTimestamp.getHours() : runTimestamp.getHours(),
    minutes = runTimestamp.getMinutes().toString().length == 1 ? '0' + runTimestamp.getMinutes() : runTimestamp.getMinutes(),
    ampm = hours >= 12 ? 'pm' : 'am',
    timeStamp = hours + ':' + minutes + ' ' + ampm;
    
// Compile Sass files, add autoprefixed CSS3 properties, minify the output CSS and finally concatenate into a single file for a single request
// @output: /public/stylesheets/main.css
// 
// Development Task
// - Complete minification, vendor-prefixing, sass compilation.
// - IMPORTANT: Sourcemaps are used to view sass file references in Chrome.
gulp.task('assets:css:dev', ['clean:assets:css'], function() {
    return gulp.src('src/stylesheets/main.scss')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass({ style: 'expanded',errLogToConsole: true }))
        .pipe(plugins.autoprefixer({browsers: ['last 3 versions']}))
        .pipe(plugins.minifycss({keepBreaks:false}))
        .pipe(plugins.concat('main.css'))
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest('public/stylesheets'))
        .pipe(plugins.size({showFiles:true,title:'Minfied CSS'}))
        .pipe(plugins.notify({
            message: 'Re-compilation of CSS file <%= file.relative %> complete | <%= options.date %>',
            templateOptions: {date: timeStamp},
            onLast:true
        }))
        .pipe(plugins.livereload());
});


// Production Task
// - Notifications taken out for production
gulp.task('assets:css:production', ['clean:assets:css'], function() {
    return gulp.src('src/stylesheets/main.scss')
        .pipe(plugins.sass({ style: 'expanded',errLogToConsole: true }))
        .pipe(plugins.autoprefixer({browsers: ['last 3 versions']}))
        .pipe(plugins.minifycss({keepBreaks:false}))
        .pipe(plugins.concat('main.css'))
        .pipe(gulp.dest('public/stylesheets'));
});