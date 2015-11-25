var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();

// Create icon font dynamically from 'icons' folder which holds svg images. Also creates '_icons.scss' sass file automatically
// @output: /fonts/blueprint/blueprint.woff
gulp.task('iconfont', function(){
    gulp.src(['private/images/icons/*.svg'])
        .pipe(plugins.iconfontCss({
            fontName: 'Blueprint',
            path: 'scss',
            targetPath: '../../private/sass/tag-level-styles/_icons.scss',
            fontPath: '../private/fonts/blueprint/'
        }))
        .pipe(plugins.iconfont({
            fontName: 'Blueprint',
            normalize: true
        }))
        .pipe(gulp.dest('private/fonts/blueprint/'));
});