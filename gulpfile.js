var gulp = require('gulp');
var watch = require('gulp-watch');
var pug = require('gulp-pug');
var coffee = require('gulp-coffee');
var sass = require('gulp-sass');

const path = {
  pug: './project/src/*.pug',
  coffee: './project/src/coffee/*.coffee',
  scss: './project/src/scss/*.scss'
}

gulp.task('pug', function(done) {
  gulp.src(path.pug)
    .pipe(pug())
    .pipe(gulp.dest('./project/dist/'));
  done();
});

gulp.task('coffee', function(done) {
  gulp.src(path.coffee)
    .pipe(coffee({ bare: true }))
    .pipe(gulp.dest('./project/dist/js/'));
  done();
});

gulp.task('sass', function(done) {
  gulp.src(path.scss)
    .pipe(sass())
    .pipe(gulp.dest('./project/dist/css/'));
  done();
});

gulp.task('watch', function(done) {
  gulp.watch(path.pug, gulp.series('pug'));
  gulp.watch(path.coffee, gulp.series('coffee'));
  gulp.watch(path.scss, gulp.series('sass'));
});

gulp.task('default', gulp.parallel('pug', 'coffee', 'sass', 'watch'), function(done) {
  done();
});