// classes
var Table = require('cli-table2');


// dependencies
var gulp = require('gulp');
var rename = require('gulp-rename');

var pug = require('gulp-pug');
var sass = require('gulp-sass');

var autoprefixer = require('gulp-autoprefixer');
var insert = require('gulp-insert');
var concat = require('gulp-concat');

var shell = require('gulp-shell');
// var iconfont = require('gulp-iconfont');

// expiremental
var browserSync = require('browser-sync').create();


// Path variables
var paths = {
  sass_gulp: ['sass/*.sass', '!sass/mixins.sass'],
  sass: 'sass/**/*.sass',
  sass_dest: 'styles',

  pug_gulp: ['pug/*/**/*.pug', '!pug/*/**/_*.pug'],
  pug: 'pug/**/*.pug',
  pug_dest: 'templates',

  // icons_gulp: 'res/icons/*.svg',
  // icons: 'res/icons/*.svg',
  // icons_dest: 'res/fonts/icons/',

  styleguide: 'sass/**/*.twig',
  styleguide_css: '../styles/csu.css',
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


// gulp.task('icons', function() {
//   return gulp.src(paths.icons_gulp)
//     .pipe(iconfont({
//       fontName: 'icons',
//       prependUnicode: true,
//       formats: ['ttf', 'woff']
//     }))
//     .on('glyphs', function(glyphs, options) {
//       console.log('Create font "' + options.fontName + '"');

//       var table = new Table({
//         'head': ['NAME', 'UNICODE'],
//       });

//       for (var index in glyphs) {
//         table.push([glyphs[index].name, glyphs[index].unicode[0]])
//       }
//       console.log(table.toString());
//     })
//     .pipe(gulp.dest(paths.icons_dest));
// });



gulp.task('styleguide', shell.task([
  'node_modules/.bin/kss ' +
  '--source sass ' +
  '--css ' + paths.styleguide_css + ' ' +
  '--title "CSU Landesgruppe" ' +
  '--builder "builder/twig" '
]));

gulp.task('dummy', ['sass', 'styleguide'], function() {
  gulp.watch(paths.sass, ['sass', 'styleguide']);
  gulp.watch(paths.styleguide, ['styleguide']);
  // gulp.watch(paths.icons, ['icons']);
});

gulp.task('watch', ['sass', 'pug'], function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.pug, ['pug']);
});

gulp.task('all', ['sass', 'pug', 'styleguide'], function() {
  gulp.watch(paths.sass, ['sass', 'styleguide']);
  gulp.watch(paths.styleguide, ['styleguide']);
  // gulp.watch(paths.icons, ['icons']);
  gulp.watch(paths.pug, ['pug']);
});

gulp.task('sync', ['sass', 'pug', 'styleguide'], function() {
  browserSync.init();

  gulp.watch(paths.sass, ['sass', 'styleguide']);
  gulp.watch(paths.styleguide, ['styleguide']);
  // gulp.watch(paths.icons, ['icons']);
  gulp.watch(paths.pug, ['pug']);
});

gulp.task('style-sync', ['sass', 'styleguide', 'pug'], function() {
  browserSync.init({
    proxy: 'cducsu.dev/sites/all/themes/csu/styleguide/index.html',
  })

  gulp.watch(paths.sass, ['sass', 'styleguide']);
  gulp.watch(paths.styleguide, ['styleguide']);
  // gulp.watch(paths.icons, ['icons']);
  gulp.watch(paths.pug, ['pug']);
});

gulp.task('default', ['all']);
