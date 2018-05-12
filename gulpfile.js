var gulp = require('gulp'),
    sass = require('gulp-sass'),
    pug = require('gulp-pug'),
    spritesmith = require('gulp.spritesmith'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync").create();

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
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest('dist'));
});

/*------ sass -----*/
gulp.task('sass', function () {
    return gulp.src('src/styles/**/main.sass')
        .pipe(sass().on('error', sass.logError))
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

gulp.task('copy:fonts', function () {
    return gulp.src('src/fonts/**/*.*')
        .pipe(gulp.dest('dist/fonts'));
});


gulp.task('copy:img', function () {
    return gulp.src('src/img/**/*.*')
        .pipe(gulp.dest('dist/img'));
});


gulp.task('clean', function del(cb) {
    return rimraf('dist', cb);
});

gulp.task('copy', gulp.parallel('copy:fonts', 'copy:img'));

gulp.task('watch', function () {
   gulp.watch('src/styles/**/*.*', gulp.series('sass'));
   gulp.watch('src/template/*.*', gulp.series('html'));
});


gulp.task('default', gulp.series('clean',
    gulp.parallel('html', 'sass', 'copy:fonts', 'sprite', 'copy'),
    gulp.parallel('watch', 'server')
    )
);
