// /////////////////////////////////////////////////////////
// Required
// /////////////////////////////////////////////////////////

// required for gulp plugin
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

// this is basic path
var project = __dirname.replace('shipyard', ''), // your project path
	shipyard = 'shipyard/js/app', // your shipyard path
	destination = 'assets/js/app', // your building path
	proxyAddr = 'cp01-rdqa04-dev117.cp01.baidu.com:8024', // your proxy address
	hostAddr = 'cp01-rdqa04-dev117.cp01.baidu.com', // host addr which browser could access
	hostPort = 8214,
    tips = '😘   😘   😘   😘   😘   😘   😘   '; // gutil prompts

gutil.log(tips + project);

// /////////////////////////////////////////////////////////
// Scripts Task
// /////////////////////////////////////////////////////////

gulp.task('scripts', function (cb) {
	var options = {
    	compress: false,
    	mangle: false
  	};
 
	pump([
	    gulp.src(project + shipyard + '/**/**/*.js'),
	    uglify(options),
	    gulp.dest(project + destination),
	    reload({stream: true})
	],
	cb
	);
});

// /////////////////////////////////////////////////////////
// Compass / Sass Tasks
// /////////////////////////////////////////////////////////

gulp.task('compass', function () {
	gulp.src(project + shipyard + '/**/**/sass/*.scss')
		.pipe(plumber())
		.pipe(compass({
			config_file: 'config.rb',
			sass: project + shipyard + '/**/**/',
			css: project + destination + '/**/**/',
			require: ['susy', 'breakpoint']
		}))
		.on('error', function(error) {
	      	console.log(project + shipyard + '/**/**/');
	      	this.emit('end');
	    })
		.pipe(autoprefixer('last 2 versions'))
		.pipe(gulp.dest(project + destination))
		.pipe(reload({stream: true}));
});

// /////////////////////////////////////////////////////////
// HTML Task
// /////////////////////////////////////////////////////////
gulp.task('html', function () {
	gulp.src(project + shipyard + '/**/**/*.html')
		.pipe(gulp.dest(project + destination))
		.pipe(reload({stream: true}));
});

// /////////////////////////////////////////////////////////
// Browser-Sync Task
// /////////////////////////////////////////////////////////
gulp.task('browser-sync', function () {
	browserSync({
		proxy: proxyAddr,
		host: hostAddr,
		port: hostPort
	});
});


// /////////////////////////////////////////////////////////
// Watch Task
// /////////////////////////////////////////////////////////

gulp.task('watch', function () {
	gulp.watch(project + shipyard + '/**/**/*.js', ['scripts']);
	gulp.watch(project + shipyard + '/**/**/sass/*.scss', ['compass']);
	gulp.watch(project + shipyard + '/**/**/*.html', ['html']);
});

// /////////////////////////////////////////////////////////
// Default Task
// /////////////////////////////////////////////////////////

gulp.task('default', ['compass', 'html', 'scripts', 'browser-sync', 'watch']);
