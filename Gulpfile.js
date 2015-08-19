var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var del = require('del');
var ngAnnotate = require('gulp-ng-annotate');

src = './src';
dest = 'build';

var paths = {
  scripts: ['src/**/*.js', 'bower_components/tooltipster/js/jquery.tooltipster.js'],
  stylesheets: ['src/**/*.css', 'bower_components/tooltipster/css/**/*.css']
};

gulp.task('clear', function(cd) {
  del(['build'], cd);
});

gulp.task('scripts', ['clear'], function() {
  return gulp.src(paths.scripts)
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(concat('ng-places-autocomplete.js'))
    .pipe(gulp.dest(dest));
});

gulp.task('stylesheets', ['clear'], function() {
  return gulp.src(paths.stylesheets)
    .pipe(uglifycss())
    .pipe(concat('ng-places-autocomplete.css'))
    .pipe(gulp.dest(dest));
})

gulp.task('default', ['scripts', 'stylesheets']);
