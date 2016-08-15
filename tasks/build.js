const {babel, plumber} = require('gulp-load-plugins')();
const del = require('del');
const gulp = require('gulp');
const mergeStream = require('merge-stream');
const runSequence = require('run-sequence');
const webpackStream = require('webpack-stream');

gulp.task('clean', done => {
  del(['dist/*', '!dist/.gitkeep']).then(() => done(), done);
});

gulp.task('build', done => runSequence('clean', 'babel', done));

gulp.task('babel', () => {
  return mergeStream(
    gulp.src(['src/**/*.js'], {base: 'src'}).pipe(plumber()).pipe(babel()),
    gulp.src(['src/**/*.js'], {base: 'src'}).pipe(plumber()).pipe(webpackStream(require('../webpack.config'))),
    gulp.src(['LICENSE', 'README.md', 'package.json'], {base: '.'}).pipe(plumber())
  ).pipe(gulp.dest('dist'));
});

gulp.task('build', done => runSequence('clean', 'babel', done));

gulp.task('watch', ['build'], () => {
  gulp.watch(['index.js', 'src/**/*.js'], ['babel']);
});