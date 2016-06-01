// dependencies
var gulp = require('gulp');

var pug = require('gulp-pug');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

var insert = require('gulp-insert');
var concat = require('gulp-concat');


// Path variables
var paths = {
  index: 'ignore/index.pug',
  indexDest: './',
  sass: 'ignore/sass/**/*.sass',
  sassDest: 'src/css',
  sassOptions: {
    outputStyle: 'compressed',
  },
};


gulp.task('index', function() {
  return gulp.src(paths.index)
    .pipe(pug())
    .pipe(gulp.dest(paths.indexDest));
});

gulp.task('sass', function() {
  return gulp.src(paths.sass)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(concat('styles.css'))
    .pipe(gulp.dest(paths.sassDest));
});

gulp.task('build', ['index', 'sass']);



gulp.task('watch', ['sass'], function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('default', ['watch']);