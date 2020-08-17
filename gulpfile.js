const gulp = require('gulp');
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const del = require('del');
const browserSync = require('browser-sync').create();

const sourcemaps = require('gulp-sourcemaps');
const less = require('gulp-less');
//стили css
/* const cssFiles = [
    './src/css/main.css',
    './src/css/header.css'
]; */
const cssFiles = [
    './src/css/main.less',
    './src/css/header.less'
];
const jsFiles = [
    './src/js/lib.js',
    './src/js/main.js'
];
function styles(){  
    return gulp.src(cssFiles)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(concat('style.css'))
    .pipe(autoprefixer({
        overrideBrowserslist:['last 2 versions'],
        cascade: false
    }))
   
    //минификация
    .pipe(cleanCSS({level:2}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream())
}
//на скрипты
function scripts(){
    return gulp.src(jsFiles)
    .pipe(concat('script.js'))
    //минификация
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream())
}
function clean(){
    return del(['build/*'])
}
function watch(){
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    //обновление css файлов
    //gulp.watch('./src/css/**/*css styles)
    gulp.watch('./src/css/**/*less', styles)

    //обновление js файлов
    gulp.watch('./src/js/**/*js', scripts)

    gulp.watch("./*.html").on('change', browserSync.reload);
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);

gulp.task('del', clean);
gulp.task('watch',watch);
gulp.task('build', gulp.series(clean, gulp.parallel(styles,scripts)));
gulp.task('dev', gulp.series('build','watch'));