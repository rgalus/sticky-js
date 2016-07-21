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
    .pipe(uglify())
    .pipe(rename('sticky.min.js'))
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