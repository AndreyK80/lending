var gulp = require('gulp'),
    sass = require('gulp-sass'),
    pug = require('gulp-pug'),
    spritesmith = require('gulp.spritesmith'),
    rimraf = require('rimraf'),
    autoprefixer = require("gulp-autoprefixer"),
    browserSync = require("browser-sync").create(),
    plumber = require("gulp-plumber");

/*------ server -----*/
gulp.task("server", function () {
    browserSync.init({
        server: {
            baseDir: "dist"
        },
        //files: ['dist/**/*.*']
        //notify: false,
        //tunnel: true,
        //host: 'localhost',
        port: 9000
    });

gulp.watch("dist/**/*").on('change', browserSync.reload);
});

/*------ pug -----*/
gulp.task('html', function buildHTML() {
    return gulp.src('src/template/index.pug')
        .pipe(plumber())
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest('dist'));
});

/*------ sass -----*/
gulp.task('scss', function () {
    return gulp.src('src/styles/main.scss')
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/css'));
});

/*------ sprite -------*/
gulp.task('sprite', function (cb) {
    var spriteData = gulp.src('src/img/icons/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: '../img/sprite.png',
        cssName: 'sprite.scss'
    }));

    spriteData.img.pipe(gulp.dest('dist/img/'));
    spriteData.css.pipe(gulp.dest('src/styles/global/'));
    cb();
});

/*------ copy:fonts -----*/
gulp.task('copy:fonts', function () {
    return gulp.src('src/fonts/**/*.*')
        .pipe(gulp.dest('dist/fonts'));
});

/*------ copy:img -----*/
gulp.task('copy:img', function () {
    return gulp.src('src/img/**/*.*')
        .pipe(gulp.dest('dist/img'));
});

/*------ clean -----*/
gulp.task('clean', function del(cb) {
    return rimraf('dist', cb);
});

/*------ copy -----*/
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:img'));

/*------ watch -----*/
gulp.task('watch', function () {
   gulp.watch('src/styles/**/*.*', gulp.series('scss'));
   gulp.watch('src/template/**/*.*', gulp.series('html'));
});

/*------ default -----*/
gulp.task('default', gulp.series('clean',
    gulp.parallel('html', 'scss', 'copy:fonts', 'sprite', 'copy'),
    gulp.parallel('watch', 'server')
    )
);
