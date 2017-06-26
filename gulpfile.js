var gulp = require('gulp');
var reqOptimize =require('gulp-requirejs-optimize');
var rename = require("gulp-rename");
var rev =require('gulp-rev');
var through2 = require('through2');
var revCollector = require('gulp-rev-collector');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var minifyCss = require('gulp-minify-css');
var webserver = require('gulp-webserver');
/*var flatten = require('gulp-flatten')*/

gulp.task('revJs',function(){
    gulp.src('js/main/*.js')
    .pipe(gulp.dest('dist/js/main'))
});
gulp.task('revImg',function(){
    gulp.src('img/**/*')
    .pipe(gulp.dest('dist/img'))
});
gulp.task('revCss',function(){
    gulp.src('css/*.css')
  //  .pipe(minifyCss())//{compatibility: 'ie8'}
    .pipe(gulp.dest('dist/css'))
});

gulp.task('hello', function (cb) {
	console.log('Hello, fuck World!');
    gulp.src('js/app.js')
    .pipe(reqOptimize({
        optimize:"none",
    paths:{
        vue:'lib/vue',
        vueRouter:'lib/vue-router',
        vueResource:'lib/vue-resource',
        temp:'component/template',
        resize:'component/resizeWindow'
    }
    }))
  //  .pipe(rename("main-min.js"))
    .pipe(rev())
    .pipe(gulp.dest('dist/js'))
    .pipe(rev.manifest({merge:true}))
    .pipe(gulp.dest(""))
    .on('end',cb);
});

function modify(modifier) {
    return through2.obj(function(file, encoding, done) {
        var content = modifier(String(file.contents));
        file.contents = new Buffer(content);
        this.push(file);
        done();
    });
}

function replaceSuffix(data) {
    return data.replace(/\.js/gmi, "");
}

//去掉.js后缀，因为requirejs的引用一般都不带后缀
gulp.task("repSuff",function (cb) {
    gulp.src(['rev-manifest.json'])
        .pipe(modify(replaceSuffix))            //- 去掉.js后缀
        .pipe(gulp.dest(''))
        .on('end', cb);
});

gulp.task("repHome",function (cb) {
    gulp.src(['rev-manifest.json', 'index.html'])
        .pipe(revCollector())                   //- 替换为MD5后的文件名
        .pipe(rename("index.html"))
        .pipe(gulp.dest('dist'))
        .on('end', cb);
});

gulp.task("clean",function () {
    return gulp.src([
        'rev-manifest.json',
        'dist/js/main/*.js',
        'dist/js/*.js',
        'dist/index.html'
    ]).pipe(clean());
});

gulp.task("startServer",function(){
    gulp.src('dist')
    .pipe(webserver({
        port:80,
        host:'127.0.0.1',
        liveload:true,
        directoryListing:{
            path:'index.html',
            enable:true
        }
    }))
});

gulp.task('default', function(callback) {
    runSequence(
        "clean",                //- 上一次构建的结果清空
        "revImg",
        "revCss",
        "revJs",
        "hello",                  //- 文件合并与md5
        "repSuff",        //- 替换.js后缀
        "repHome",      //- 首页路径替换为md5后的路径
        "startServer",
        callback);
});

