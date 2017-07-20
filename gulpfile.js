    var gulp = require('gulp'),
    reqOptimize =require('gulp-requirejs-optimize'),
    rename = require("gulp-rename"),
    changed = require("gulp-changed"),
    contact =require('gulp-concat'),
    rev =require('gulp-rev'),
    through2 = require('through2'),
    revCollector = require('gulp-rev-collector'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify'),
    runSequence = require('run-sequence'),
    minifyCss = require('gulp-minify-css'),
    webserver = require('gulp-webserver');
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
/*将requireJs文件转移到发布目录*/+9-
gulp.task('revJs',function(){
    gulp.src('js/main/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/main'))
});
/*将所有的图片转移到发布目录*/
gulp.task('revImg',function(){
    gulp.src('img/**/*')
    .pipe(gulp.dest('dist/img'))
});
/*将css文件合并压缩转移到发布目录*/
gulp.task('revCss',function(){  
     gulp.src('css/*.css')
    .pipe(contact('index.css'))
    .pipe(minifyCss())//{compatibility: 'ie8'}
    .pipe(gulp.dest('dist/css'))
});
    /*将主文件依赖管理合并、压缩、重命名、并去掉.js操作，然后转移到发布目录*/ 
gulp.task('optimizeJS', function (cb) {
    gulp.src('js/app.js')
    .pipe(reqOptimize({
    optimize:"none",
    paths:{
        vueRouter:'lib/vue-router',
        marked:'component/marked.js',
        editor:'component/editor',
        temp:'component/template',
        resume:'component/resume',         
        resize:'component/resizeWindow'
    }
    }))
    .pipe(rev())
    .pipe(gulp.dest('dist/js'))
    .pipe(rev.manifest({merge:true}))
    .pipe(gulp.dest(""))
    .pipe(modify(replaceSuffix))            //- 去掉.js后缀
    .pipe(gulp.dest(''))       
    .on('end',cb);   
});

/*//去掉.js后缀，因为requirejs的引用一般都不带后缀
gulp.task("repSuff",function (cb) {
    gulp.src(['rev-manifest.json'])
        .pipe(modify(replaceSuffix))            //- 去掉.js后缀
        .pipe(gulp.dest(''))      
        .on('end', cb);
});*/
/*由于对app.js重命名加入了md5序列号值，所以需要替换原始index.html中关于app.js的引用*/ 
gulp.task("updateHtml",function (cb) {
    gulp.src(['rev-manifest.json', 'index.html'])  
        .pipe(revCollector())                   //- 替换为MD5后的文件名
        .pipe(rename("index.html"))
        .pipe(gulp.dest('dist'))
        .on('end', cb);
});

gulp.task("clean",function () {
    return gulp.src([
        'rev-manifest.json',
        'dist/js/*.js',
        'dist/index.html'
    ]).pipe(clean());
});
gulp.task("JSreload",function(){
    return gulp.src(['rev-manifest.json', 'dist/js/*.js','dist/index.html']).pipe(clean());
})

//启动热更新  
 gulp.task('default', ['clean'], function() {  
    runSequence(       
        "revImg",
        "revCss",
      //  "revJs",
        "optimizeJS",                  //- 文件合并与md5
        "updateHtml");      //- 替换index.html文件名
    browserSync.init({  
        port: 80,  
        server: {  
            baseDir: ['dist']  
        }  
    });  
  //监控文件变化，自动更新 
    gulp.watch('js/app.js', function(){
            runSequence(
            "JSreload",
            'optimizeJS',           
            "updateHtml", 
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
            "updateHtml", 
            browserSync.reload    
        );       
    }); 
});

//gulp.task('default',['server']); 

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

/*gulp.task('default', function(callback) {
    runSequence(
        "clean",                //- 上一次构建的结果清空   
        "revImg",
        "revCss",
        "revJs",
        "optimizeJS",                  //- 文件合并与md5
        "updateHtml",
        "startServer",
        callback);
});*/
/*gulp.task('hot',function(){
    livereload.listen();
    gulp.watch('js/.js',function(event){
        console.log("hot");
     livereload.changed(event.path);
    })

})*/