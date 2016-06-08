'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');

// CSS packages
var minifycss = require('gulp-minify-css');
// JS packages
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
// Common packages
var rename = require('gulp-rename');
var del = require('del');
var inject = require('gulp-inject');
var _ = require('lodash');

var JS_PATH = ['./public/**/*.js', '!./public/lib/**/*.js', '!./public/node_modules/**/*.js'];
var CSS_PATH = ['./public/**/*.css'];
var HTML_PATH = ['./public/**/*.html', '!./public/index.html'];
var INJECT_PATH;
var TMP_PATH;
var INDEX_PATH;

gulp.task('clean', ['all:path'], function () {
    del.sync(TMP_PATH);
});

gulp.task('all:path', ['dev:path', 'prod:path']);

gulp.task('dev:path', function () {
    INJECT_PATH = _.union(JS_PATH, CSS_PATH);
    INDEX_PATH = 'public';
});

gulp.task('prod:path', function () {
    INJECT_PATH = ['./dist/css/*.css', './dist/js/*.js'];
    TMP_PATH = ['./dist'];
    INDEX_PATH = 'dist';
});

gulp.task('prod:style', [], function () {
    return gulp.src(CSS_PATH)
        .pipe(concat('style.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('prod:scripts', [], function () {
    return gulp.src(JS_PATH)
        .pipe(concat('app.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('prod:html', [], function () {
    return gulp.src(HTML_PATH)
        .pipe(gulp.dest('dist'));
});

gulp.task('prod:files', ['prod:style', 'prod:scripts', 'prod:html']);

/**
 * Injects all JS and CSS files in 'INJECT_PATH' into index.html
 *
 * relative parameter removed part of the path
 */

var injectCallbcack = function () {
    return gulp.src('public/layout.server.view.html')
        .pipe(inject(gulp.src(INJECT_PATH, {read: false}), {relative: true}))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(INDEX_PATH));
};

gulp.task('inject', [], injectCallbcack);

gulp.task('prod:inject', ['prod:files'], injectCallbcack);

gulp.task('watch', ['inject'], function () {
    gulp.watch(CSS_PATH, ['inject']);
    gulp.watch(JS_PATH, ['inject']);
    gulp.watch(HTML_PATH, ['inject']);
});

gulp.task('default', ['dev:path', 'watch']);

gulp.task('build', ['prod:path', 'prod:inject']);
