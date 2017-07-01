var gulp = require('gulp');
var reqOptimize =require('gulp-requirejs-optimize');
var rename = require("gulp-rename");
var changed = require("gulp-changed");
var contact =require('gulp-concat');
var rev =require('gulp-rev');
var through2 = require('through2');
var revCollector = require('gulp-rev-collector');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var minifyCss = require('gulp-minify-css');
var webserver = require('gulp-webserver');
var livereload = require('gulp-livereload');
var browserSync = require("browser-sync").create();//创建服务 
/*var flatten = require('gulp-flatten')*/
function modify(modifier) {
    console.log("modify");
    return through2.obj(function(file, encoding, done) {
        console.log("start")
        var content = modifier(String(file.contents));
        console.log("dealing")        
        file.contents = new Buffer(content);
        console.log("end");
        this.push(file);
        done();
    });
}

function replaceSuffix(data) {
    console.log("replaceSuffix");
    return data.replace(/\.js/gmi, "");
}

gulp.task('revJs',function(){
    gulp.src('js/main/*.js')
    .pipe(gulp.dest('dist/js/main'))
});
gulp.task('revImg',function(){
    gulp.src('img/**/*')
    .pipe(gulp.dest('dist/img'))
});
gulp.task('revCss',function(){  
 //   gulp.src('css/*.css')
     gulp.src('css/*.css')
    .pipe(contact('index.css'))
    .pipe(minifyCss())//{compatibility: 'ie8'}
  //  .pipe(minifyCss())//{compatibility: 'ie8'}
    .pipe(gulp.dest('dist/css'))
});

gulp.task('contactCss',function(){  
    gulp.src('css/*.css')
    .pipe(contact('index.css'))
    .pipe(minifyCss())//{compatibility: 'ie8'}
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
    .pipe(rev())
/*    .pipe(changed('dist/js/*.js', {hasChanged: changed.compareSha1Digest}))   */
    .pipe(gulp.dest('dist/js'))
    .pipe(rev.manifest({merge:true}))
    .pipe(gulp.dest(""))
    .pipe(modify(replaceSuffix))            //- 去掉.js后缀
    .pipe(gulp.dest(''))       
    .on('end',cb);
   // .pipe(browserSync.reload({stream:true}))     
});

/*//去掉.js后缀，因为requirejs的引用一般都不带后缀
gulp.task("repSuff",function (cb) {
    gulp.src(['rev-manifest.json'])
        .pipe(modify(replaceSuffix))            //- 去掉.js后缀
        .pipe(gulp.dest(''))      
        .on('end', cb);
});*/

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
    //    'dist/js/main/*.js',
        'dist/js/*.js',
        'dist/index.html'
    ]).pipe(clean());
});
gulp.task("JSreload",function(){
    return gulp.src(['rev-manifest.json', 'dist/js/*.js','dist/index.html']).pipe(clean());
})

//启动热更新  
 gulp.task('serve', ['clean'], function() {  
    runSequence(       
        "revImg",
        "revCss",
        "revJs",
        "hello",                  //- 文件合并与md5
      //  "repSuff",        //- 替换.js后缀
        "repHome");      //- 替换index.html文件名
    browserSync.init({  
        port: 80,  
        server: {  
            baseDir: ['dist']  
        }  
    });  
/*    gulp.watch('js/app.js', ["JSreload",'hello']);         //监控文件变化，自动更新  */
//    gulp.watch('dist/js/**', ['reloadHtml']);         //监控文件变化，自动更新 
    gulp.watch('js/app.js', function(){
            runSequence(
            "JSreload",
            'hello',           
            "repHome", 
            browserSync.reload     
        );       
    });  
    gulp.watch('css/*.css',  function(){
            runSequence(
            "revCss",
            browserSync.reload     
        );       
    });
    gulp.watch('index.html',  function(){
            runSequence(
            "repHome", 
            browserSync.reload    
        );       
    });
           //监控文件变化，自动更新 
  // gulp.watch('src/less/*.less', ['less']);  
   // gulp.watch('src/*.html', ['html']);  
  //  gulp.watch('src/images/*.*', ['images']);  
});

gulp.task('default',['serve']); 

/*gulp.task("startServer",function(){
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
*/
/*gulp.task('hot',function(){
    livereload.listen();
    gulp.watch('js/.js',function(event){
        console.log("hot");
     livereload.changed(event.path);
    })

})*/