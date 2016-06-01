// classes
var Table = require('cli-table2');


// dependencies
var gulp = require('gulp');

var pug = require('gulp-pug');
var sass = require('gulp-sass');

var insert = require('gulp-insert');
var concat = require('gulp-concat');


// Path variables
var paths = {

};

gulp.task('sass', function() {
  return gulp.src(paths.sass_gulp)
    .pipe(insert.prepend('@import ./mixins \n\n'))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.sass_dest))
    .pipe(browserSync.stream());
});

gulp.task('pug', function() {
  return gulp.src(paths.pug_gulp)
    .pipe(insert.prepend('include /drupal.pug \n\n'))
    .pipe(pug({
      basedir: 'pug',
    }))
    .pipe(rename(function(path) {
      path.extname = '.tpl.php';
    }))
    .pipe(gulp.dest(paths.pug_dest));
});

gulp.task('build', function() {

});