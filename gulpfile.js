var gulp = require('gulp');

var sass = require('gulp-sass');

var minCss = require('gulp-clean-css');

var server = require('gulp-webserver');

var url = require('url');

var path = require('path');

var fs = require('fs');

var data = require('./mock/data')
    //开发css
gulp.task('devScss', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(minCss())
        .pipe(gulp.dest('./src/css'))
})

//监听scss
gulp.task('watch', function() {
    return gulp.watch('./src/scss/*.scss', gulp.series('devScss'))
})

//启服务
gulp.task('server', function() {
    return gulp.src('src')
        .pipe(server({
            port: 8989,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                if (pathname === '/favicon.ico') {
                    res.end('');
                    return
                }
                if (pathname === '/api/swiper') {
                    res.end(JSON.stringify({ code: 1, data: data }))
                } else {
                    pathname = pathname === '/' ? 'index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))
                }
            }
        }))
})

//开发环境
gulp.task('dev', gulp.series('devScss', 'server', 'watch'))