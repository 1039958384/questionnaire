//引入 gulp
var gulp = require('gulp');
 
//引入组件
var minifycss = require('gulp-minify-css'),//css压缩
    jshint = require('gulp-jshint'),//js检测
    uglify = require('gulp-uglify'),//js压缩
    concat = require('gulp-concat'),//文件合并
    rename = require('gulp-rename'),//文件更名
    notify = require('gulp-notify');//提示信息
 
 
//合并、压缩、重命名css
gulp.task('css', function() {
  return gulp.src('src/css/*.css')
    .pipe(concat('main.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css'))
    .pipe(notify({ message: 'css task ok' }));
});
 
//检查js
gulp.task('lint', function() {
  return gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(notify({ message: 'lint task ok' }));
});
 
//合并、压缩js文件
gulp.task('js', function() {
  return gulp.src([
                  "src/js/util.js",
				  "src/js/calendar.js",
				  "src/js/layer.js",
				  "src/js/editPage.js",
				  "src/js/newBuilt.js",
				  "src/js/qnPage.js",
				  "src/js/resultPage.js",
				  "src/js/listPage.js",
				  "src/js/index.js"
		        ])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'js task ok' }));
});
 
//默认任务
gulp.task('default', function(){
	server.listen(port, function(err){
        if (err) {
            return console.log(err);
        }

        //监听css文件
        gulp.watch('./src/scss/*.scss', function(){
            gulp.run('css');
        });

        //监听js文件
        gulp.watch('./src/js/*.js', function(){
            gulp.run('js');
        });

    });
 
});