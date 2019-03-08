var gulp = require('gulp');
var iconfont = require('gulp-iconfont');
var runTimestamp = Math.round(Date.now() / 1000);
var async = require('async');
var consolidate = require('gulp-consolidate');

gulp.task('Iconfont_f', function () {
  return gulp.src(['src/assets/fonts/*.svg'])
    .pipe(iconfont({
      fontName: 'iconfont', // required
      prependUnicode: true, // recommended option
      formats: ['ttf', 'eot'], // default, 'woff2' and 'svg' are available
      timestamp: runTimestamp, // recommended to get consistent builds when watching files
    }))
    .on('glyphs', function (glyphs, options) {
      // CSS templating, e.g.
      console.log(glyphs, options);
    })
    .pipe(gulp.dest('src/assets/fonts/'));
});

gulp.task('Iconfont_c', function (done) {
  var iconStream = gulp.src(['src/assets/icons/*.svg'])
    .pipe(iconfont({ fontName: 'iconfont' }));

  async.parallel([
    function handleGlyphs(cb) {
      iconStream.on('glyphs', function (glyphs, options) {
        gulp.src('src/assets/fonts/iconfont.css')
          .pipe(consolidate('lodash', {
            glyphs: glyphs,
            fontName: 'iconfont',
            fontPath: 'src/assets/fonts/',
            className: 's'
          }))
          .pipe(gulp.dest('src/assets/fonts/'))
          .on('finish', cb);
      });
    },
    function handleFonts(cb) {
      iconStream
        .pipe(gulp.dest('src/assets/fonts/'))
        .on('finish', cb);
    }
  ], done);
});
