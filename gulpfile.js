'use strict';

const gulp = require('gulp');

const pug = require('gulp-pug');
const rename = require("gulp-rename");
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

const insert = require('gulp-insert');
const clean = require('gulp-clean');



const settings = require('./settings/gulp.json');
const tasks = [];



function errorHandler(name) {
  return function customErrorHandler(err) {
    console.error('########### ERROR ' + name.toUpperCase() + ' ############');
    console.error(err.message);
    console.error('########### ERROR ' + name.toUpperCase() + ' ############');
    this.emit('end');
  };
}

function cleanTask(task) {
  gulp.task(task + ':clean', function() {
    gulp.src(settings[task].clean, {read: false})
      .pipe(clean());
  });
  return task + ':clean';
}

function base(task) {
  return settings[task].base || settings.base;
}

function path(task, value, fallback = '') {
  return base(task) + (settings[task][value] || fallback);
}

function options(task, fallback = {}) {
  return settings[task].options;
}

function option(task, option, fallback = null) {
  return settings[task].options && settings[task].options[option] || fallback;
}

function dest(task) {
  return settings[task].destination;
}





gulp.task('index', function() {
  return gulp.src(path('index', 'source'))
    .pipe(pug(options('index')))
    .on('error', errorHandler('index'))
    .pipe(gulp.dest(dest('index')));
});
tasks.push('index');

if (option('pug', 'name', false)) {
  gulp.task('pug', [cleanTask('pug')], function() {
    return gulp.src(path('pug', 'source'))
      .pipe(pug(options('pug')))
      .on('error', errorHandler('pug'))
      .pipe(rename(function(path) {
        path.dirname = '';
      }))
      .pipe(insert.append('\nmodule.exports = ' + option('pug', 'name') + ';'))
      .pipe(gulp.dest(dest('pug')));
  });
  tasks.push('pug');
} else {
  console.log();
  console.warn('[WARNING]: pug task required the "name" option! No pug task was initiate!');
  console.log();
}

gulp.task('sass', [cleanTask('sass')], function() {
  return gulp.src(path('sass', 'source'))
    .pipe(sourcemaps.init())
    .pipe(sass(options('sass')))
    .on('error', errorHandler('sass'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest('sass')));
});
tasks.push('sass');





gulp.task('build', tasks);

gulp.task('watch', tasks, function() {
  for (var i in tasks) {
    gulp.watch(path(tasks[i], 'watch'), [tasks[i]]);
  }
});

gulp.task('default', [settings.default]);