var iconfont = require('gulp-iconfont');
var runTimestamp = Math.round(Date.now() / 1000);

gulp.task('Iconfont', function () {
  return gulp.src(['src/assets/fonts/*.svg'])
    .pipe(iconfont({
      fontName: 'myfont', // required
      prependUnicode: true, // recommended option
      formats: ['ttf', 'eot', 'woff'], // default, 'woff2' and 'svg' are available
      timestamp: runTimestamp, // recommended to get consistent builds when watching files
    }))
    .on('glyphs', function (glyphs, options) {
      // CSS templating, e.g.
      console.log(glyphs, options);
    })
    .pipe(gulp.dest('src/assets/fonts/'));
});
