// パッケージの読み込み
// ------------------------------------------
var gulp            = require('gulp'),
    iconfont        = require('gulp-iconfont'),
    consolidate     = require('gulp-consolidate');
 
/***************************************************************************
* アイコンフォント
***************************************************************************/
var runTimestamp = Math.round(Date.now()/1000);
gulp.task('iconfonts', function(){
 
  return
      gulp.src('src/assets/icofont/_icons.css') // 【B】のパスを指定
      .pipe(consolidate('lodash', {
        glyphs: glyphs.map(function(glyph) {
          return { fileName: glyph.name, codePoint: glyph.unicode[0].charCodeAt(0).toString(16).toUpperCase() };
        }),
        fontName: 'icofont',
        fontPath: 'src/assets/icofont/',
        cssClass: 'ico'
      }))
      .pipe(gulp.dest('src/assets/icofont/')); // 【D】のパスを指定
});
