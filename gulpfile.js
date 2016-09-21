// dependencies
var gulp = require('gulp');

var pug = require('gulp-pug');
var rename = require("gulp-rename");
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

var insert = require('gulp-insert');
var concat = require('gulp-concat');


// Options variables
var options = {
  index: 'ignore/index.pug',
  indexDest: './',
  sass: 'ignore/sass/**/*.sass',
  sassFile: 'ignore/sass/register.sass',
  sassDest: 'src/css',
  sassOptions: {
    outputStyle: 'compressed',
  },
  js: 'ignore/js/**/*.js',
  jsDest: 'src/js',
};


gulp.task('index', function() {
  return gulp.src(options.index)
    .pipe(pug())
    .pipe(gulp.dest(options.indexDest));
});

gulp.task('templates', function() {
  return gulp.src('core/**/*.pug')
    .pipe(pug({
      client: true,
      name: 'template',
      compileDebug: true,
    }))
    .pipe(rename(function(path) {
      path.dirname = '';
    }))
    .pipe(insert.append('\nmodule.exports = template;'))
    .pipe(gulp.dest('src/tpl'));
});

gulp.task('sass', function() {
  return gulp.src(options.sassFile)
    .pipe(sourcemaps.init())
    .pipe(sass(options.sassOptions).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(concat('styles.css'))
    .pipe(gulp.dest(options.sassDest));
});

gulp.task('js', function() {
  return gulp.src(options.js)
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(options.jsDest));
});

gulp.task('build', ['index', 'sass', 'js']);

gulp.task('watch', ['sass', 'js'], function() {
  gulp.watch(options.sass, ['sass']);
  gulp.watch(options.js, ['js']);
});

gulp.task('default', ['watch']);