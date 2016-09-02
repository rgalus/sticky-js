'use strict';


//
// Gulp
// --------------------------------------------------



/*
 * Import gulp modules
 */
import gulp from 'gulp';
import del from 'del';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import size from 'gulp-size';
import gzip from 'gulp-gzip';
import browser_sync from 'browser-sync';



/*
 * Create browserSync instance
 */
const browserSync = browser_sync.create();



/*
 * Clean dist directory
 */
const clean = () => del([ './dist' ]);
export { clean };



/*
 * Compile js
 */
export function js() {
  return gulp.src('./src/sticky.js')
    .pipe(babel())
    .pipe(rename('sticky.compile.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(size({ title: 'compiled:' }))
    .pipe(uglify())
    .pipe(size({ title: 'minified:' }))
    .pipe(rename('sticky.min.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(gzip())
    .pipe(size({ title: 'gzipped:' }))
    .pipe(gulp.dest('./dist/'));
}



/*
 * Serve
 */
export function serve() {
  gulp.watch('./src/*.js', gulp.series(js))

  gulp.watch('./demo/*.html').on('change', browserSync.reload);
  gulp.watch('./dist/*.js').on('change', browserSync.reload);

  return browserSync.init({
    server: {
      baseDir: './',
      directory: true,
    },

    startPath: '/demo/index.html',
  });
}



/*
 * Builder
 */
const build = gulp.series(clean, js);
export { build };

const server = gulp.series(clean, js, serve);
export { server };



/*
 * Export a default task
 */
export default server;
