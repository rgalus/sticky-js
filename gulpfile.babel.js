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



/*
 * Clean dist directory
 */
const clean = () => del([ './dist' ]);
export { clean };



/*
 * Build
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
 * Builder
 */
const build = gulp.series(clean, js);



/*
 * Export a default task
 */
export default build;