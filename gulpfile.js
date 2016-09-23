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
	pump = require('pump'),
	gutil = require('gulp-util');


var basePath = __dirname.replace('shipyard', '');
var tips = "😘   😘   😘   😘   😘   😘   😘   ";
gutil.log(tips + basePath.replace('shipyard', ''));

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

// /////////////////////////////////////////////////////////
// Compass / Sass Tasks
// /////////////////////////////////////////////////////////

gulp.task('compass', function () {
	var sassPath = 'shipyard/js/app',
		cssPath = 'assets/js/app';
	gulp.src(basePath + sassPath + '/**/**/sass/*.scss')
		.pipe(plumber())
		.pipe(compass({
			config_file: 'config.rb',
			sass: basePath + sassPath + '/**/**/',
			css: basePath + cssPath + '/**/**/',
			require: ['susy', 'breakpoint']
		}))
		.on('error', function(error) {
	      console.log(basePath + sassPath + '/**/**/');
	      this.emit('end');
	    })
		.pipe(autoprefixer('last 2 versions'))
		.pipe(gulp.dest(basePath + cssPath))
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

gulp.task('default', ['compass', 'html', 'scripts', 'browser-sync', 'watch']);
