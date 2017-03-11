var gulp = require('gulp');
var sass = require("gulp-sass");
var browserSync = require('browser-sync').create();

        //Tasks executes when you type `gulp` in the console
        gulp.task('default', function(){
            console.log('task');
        });

         //Tasks executes when you type `gulp css` in the console
        gulp.task('sass', function(){
            return gulp.src('styles/**/*.scss')
                .pipe(sass())
                .pipe(gulp.dest('dist/styles'))
                .pipe(browserSync.reload({stream:true}));
        });

        gulp.task('browserSync', function(){
            browserSync.init({
                server:{
                    baseDir: ''
                }

            });
        });

        gulp.task('dev', ['sass', 'browserSync'], function(){
            gulp.watch('styles/**/*.scss', ['sass']);

            gulp.watch('*.html', browserSync.reload);
        });