// /////////////////////////////////////////////////////////
// Required
// /////////////////////////////////////////////////////////

var gulp = require('gulp'),
	minifier = require('gulp-uglify/minifier'),
	uglify = require('gulp-uglify'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	compass = require('gulp-compass'),
	plumber = require('gulp-plumber'),
	autoprefixer = require('gulp-autoprefixer'),
	del = require('del'),
	rename = require('gulp-rename'),
	pump = require('pump');

// /////////////////////////////////////////////////////////
// Scripts Task
// /////////////////////////////////////////////////////////

gulp.task('scripts', function (cb) {
	var options = {
    	compress: false,
    	mangle: false
  	};
 
	pump([
	    gulp.src('js/app/**/**/*.js'),
	    uglify(options),
	    gulp.dest('../js/app'),
	    reload({stream: true})
	],
	cb
	);
});

gulp.task('lib', function (cb) {
	var options = {
    	compress: false,
    	mangle: false
  	};
 
	pump([
	    gulp.src('js/lib/*.js'),
	    uglify(options),
	    gulp.dest('../js/lib'),
	    reload({stream: true})
	],
	cb
	);
});

// /////////////////////////////////////////////////////////
// Compass / Sass Tasks
// /////////////////////////////////////////////////////////

gulp.task('compass', function () {
	gulp.src('sass/*.scss')
		.pipe(plumber())
		.pipe(compass({
			config_file: 'config.rb',
			css: '../css',
			sass: 'sass',
			require: ['susy']
		}))
		.pipe(autoprefixer('last 2 versions'))
		.pipe(gulp.dest('../css'))
		.pipe(reload({stream: true}));
});

// /////////////////////////////////////////////////////////
// HTML Task
// /////////////////////////////////////////////////////////
gulp.task('html', function () {
	gulp.src('js/app/**/**/*.html')
		.pipe(gulp.dest('../js/app'))
		.pipe(reload({stream: true}));
});

// /////////////////////////////////////////////////////////
// Browser-Sync Task
// /////////////////////////////////////////////////////////
gulp.task('browser-sync', function () {
	browserSync({
		proxy: "cp01-rdqa04-dev117.cp01.baidu.com:8024",
		host: "cp01-rdqa04-dev117.cp01.baidu.com",
		port: 8124
	});
});


// /////////////////////////////////////////////////////////
// Watch Task
// /////////////////////////////////////////////////////////

gulp.task('watch', function () {
	gulp.watch('js/app/**/**/*.js', ['scripts']);
	gulp.watch('js/lib/*.js', ['lib']);
	gulp.watch('sass/*.scss', ['compass']);
	gulp.watch('js/app/**/**/*.html', ['html']);
});

// /////////////////////////////////////////////////////////
// Default Task
// /////////////////////////////////////////////////////////

gulp.task('default', ['compass', 'html', 'scripts', 'lib', 'browser-sync', 'watch']);
