'use strict';

var gulp = require('gulp');

// UTILS
var gutil = require('gulp-util');
var notifier = require('node-notifier');

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
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

var NPM_FILES = [
    './public/node_modules/angular/angular.js',
    './public/node_modules/angular-sanitize/angular-sanitize.js',
    './public/node_modules/angular-resource/angular-resource.js',
    './public/node_modules/angular-ui-router/release/angular-ui-router.js',
    './public/node_modules/angular-animate/angular-animate.js',
    './public/node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
    './public/node_modules/ng-lodash/build/ng-lodash.js',
    './public/node_modules/ng-img-crop-full-extended/compile/unminified/ng-img-crop.js',
    './public/node_modules/angular-translate/dist/angular-translate.js',
    './public/node_modules/angular-ui-utils/modules/keypress/keypress.js',
    './public/node_modules/angular-md5/angular-md5.min.js',
    './public/node_modules/jsencrypt/bin/jsencrypt.min.js'
];

var CSS_FILES = [
    './public/node_modules/angular/angular-csp.css',
    './public/node_modules/bootstrap/dist/css/bootstrap.css',
    './public/node_modules/angular-ui-bootstrap/dist/ui-bootstrap-csp.css',
    './public/node_modules/ng-img-crop-full-extended/compile/unminified/ng-img-crop.css',
    './public/node_modules/font-awesome/css/font-awesome.css',
    './public/node_modules/animate.css/animate.min.css'
];

var ASSETS_PATH = ['./public/assets/**/*'];
var JS_PATH = ['./public/**/*.js', '!./public/lib/**/*.js', '!./public/node_modules/**/*.js'];
var CSS_PATH = ['./public/modules/**/*.css'];
var HTML_PATH = ['./public/**/*.html', '!./public/index.html'];
var INJECT_PATH;
var TMP_PATH;
var INDEX_PATH;

gulp.task('clean', ['prod:path'], function () {
    del.sync(TMP_PATH);
});

gulp.task('all:path', ['dev:path', 'prod:path']);

gulp.task('dev:path', function () {
    INJECT_PATH = _.union(JS_PATH, CSS_PATH, CSS_FILES);
    INDEX_PATH = 'public';
});

gulp.task('prod:path', function () {
    INJECT_PATH = ['./dist/css/*.css', './dist/js/*.js'];
    TMP_PATH = ['./dist'];
    INDEX_PATH = 'dist';
    JS_PATH.unshift('./dist/npm.js');
});

gulp.task('prod:style', [], function () {
    return gulp.src(_.union(CSS_PATH, CSS_FILES))
        .pipe(concat('style.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('prod:assets', function () {
    return gulp.src(ASSETS_PATH)
        .pipe(gulp.dest('dist/assets/'));
});

gulp.task('prod:npm', function () {
    return gulp.src(NPM_FILES)
        .pipe(concat('npm.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('prod:scripts', ['prod:npm'], function () {
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

gulp.task('prod:files', ['prod:style', 'prod:scripts', 'prod:html', 'prod:assets']);

/**
 * Injects all JS and CSS files in 'INJECT_PATH' into index.html
 *
 * relative parameter removed part of the path
 */

gulp.task('inject', function () {
    return gulp.src('public/layout.server.view.html')
        .pipe(inject(gulp.src(NPM_FILES, {read: false}), {relative: true, name: 'node-modules'}))
        .pipe(inject(gulp.src(INJECT_PATH, {read: false}), {relative: true}))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(INDEX_PATH));
});

gulp.task('prod:inject', ['prod:files'], function () {
    return gulp.src('public/layout.server.view.html')
        .pipe(inject(gulp.src(INJECT_PATH, {read: false}), {relative: true}))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(INDEX_PATH));
});

gulp.task('watch', ['inject'], function () {
    gulp.watch(CSS_PATH, ['inject']);
    gulp.watch(JS_PATH, ['lint', 'inject']);
    gulp.watch(HTML_PATH, ['inject']);
});

gulp.task('lint', function () {
    return gulp.src(JS_PATH)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
});

gulp.task('default', ['lint', 'dev:path', 'watch'], function () {
    notifier.notify('Gulp watch is completed');
});

gulp.task('build', ['clean', 'prod:inject'], function () {
    del.sync(['./dist/npm.js', './dist/layout.server.view.html']);
    notifier.notify('Gulp build is completed');
});

gulp.task('build:dev', ['dev:path', 'inject'], function () {
    notifier.notify('Gulp build is completed');
});
