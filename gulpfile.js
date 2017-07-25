    var gulp = require('gulp'),
    reqOptimize =require('gulp-requirejs-optimize'),
    rename = require("gulp-rename"),
    changed = require("gulp-changed"),
    contact =require('gulp-concat'),
    rev =require('gulp-rev'),
    useref = require('gulp-useref'),    
    filter = require('gulp-filter'),
    replace =  require('gulp-replace'),
    revReplace =  require('gulp-rev-replace'),
 RevAll = require('gulp-rev-all'),   
    format =require('gulp-rev-format'),
    through2 = require('through2'),
    revCollector = require('gulp-rev-collector'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify'),
    runSequence = require('run-sequence'),
    minifyCss = require('gulp-minify-css'),
    webserver = require('gulp-webserver');
var livereload = require('gulp-livereload');
var browserSync = require("browser-sync").create();//创建服务 
var basePath ='../../gruntLearn/'
/*var flatten = require('gulp-flatten')*/
function modify(modifier) {
    console.log("modify");
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
/*将requireJs文件转移到发布目录*/+9-
gulp.task('revJs',function(){
    gulp.src('js/main/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
});
/*将所有的图片转移到发布目录*/
gulp.task('revImg',function(){
    gulp.src('img/**/*')
    .pipe(gulp.dest('dist/img'))
});


gulp.task("clean",function () {
    return gulp.src([
        'rev-manifest.json',
        'dist/js/*.js',
        'dist/css/*.css',
        'dist/index.html'
    ]).pipe(clean());
});
gulp.task("JSreload",function(){
    return gulp.src(
        ['rev-manifest.json', 'dist/css/*.cs','dist/js/*.js','dist/index.html']).pipe(clean());
})

//启动热更新  
 gulp.task('default', ['clean'], function() {  
    runSequence(       
        "revImg",
        "revCss",
        "optimizeJS",                  //- 文件合并与md5
        "updateHtml",                  //- 文件合并与md5
        "updateHtml");      //- 替换index.html文件名
     browserSync.init({  
        port: 80,  
        server: {  
            baseDir: ['dist']  
        }   
    });  
  //监控文件变化，自动更新 
    gulp.watch(['js/app.js','css/*.css','index.html'], function(){
            runSequence(
            "JSreload",
            "revCss",
            'optimizeJS',           
            "updateHtml", 
            "updateHtml",
            browserSync.reload     
        );       
    }); 
 })

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
    .pipe(format({  
      prefix: '.', // 在版本号前增加字符  
      suffix: '.cache', // 在版本号后增加字符  
      lastExt: false  
    }))   
    .pipe(gulp.dest('dist/js'))
    .pipe(rev.manifest({
        base:'dist',
        merge:true
    }))
  //  .pipe(modify(replaceSuffix))            //- 去掉.js后缀
    .pipe(gulp.dest('dist/'))       
    .on('end',cb);   
}); 

gulp.task('revJS', function (cb) {
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
    .pipe(format({  
      prefix: '.', // 在版本号前增加字符  
      suffix: '.cache', // 在版本号后增加字符  
      lastExt: false  
    }))   
    .pipe(gulp.dest('dist/js'))
    .pipe(rev.manifest({
        merge:true
    }))
  //  .pipe(modify(replaceSuffix))            //- 去掉.js后缀
    .pipe(gulp.dest('dist/'))       
    .on('end',cb);   
});

gulp.task('revCSS',function(cb){  
     gulp.src('css/*.css')
    .pipe(contact('index.css'))
    .pipe(minifyCss())//{compatibility: 'ie8'}
    .pipe(rev())
    .pipe(format({  
      prefix: '.', // 在版本号前增加字符  
      suffix: '.cache', // 在版本号后增加字符  
      lastExt: false  
    }))  
    .pipe(gulp.dest('dist/css'))
    .pipe(rev.manifest({
        base:'dist',
        merge:true
    }))
    .pipe(gulp.dest("dist"))
    .on('end',cb)
});

gulp.task('addv',['revJS','revCSS'] ,function() {  
    var manifest = gulp.src(["dist/rev-manifest.json"]);  
    function modifyUnreved(filename) {  
      return filename;  
    }  
    function modifyReved(filename) {  
      // filename是：admin.69cef10fff.cache.css的一个文件名  
      // 在这里才发现刚才用gulp-rev-format的作用了吧？就是为了做正则匹配，  
      if (filename.indexOf('.cache') > -1) {  
    // 通过正则和relace得到版本号：69cef10fff  
        const _version = filename.match(/\.[\w]*\.cache/)[0].replace(/(\.|cache)*/g,"");  
    // 把版本号和gulp-rev-format生成的字符去掉，剩下的就是原文件名：admin.css  
        const _filename = filename.replace(/\.[\w]*\.cache/,"");  
    // 重新定义文件名和版本号：admin.css?v=69cef10fff  
        filename = _filename + "?v=" + _version;  
    // 返回由gulp-rev-replace替换文件名  
        return filename;  
      }  
      return filename;  
    }  
    gulp.src('index.html')   
      // 删除原来的版本   
      .pipe(replace(/(\.[a-z]+)\?(v=)?[^\'\"\&]*/g,"$1"))   
      .pipe(revReplace({  
      manifest: manifest,  
      modifyUnreved: modifyUnreved,  
      modifyReved: modifyReved  
    }))    
    .pipe(gulp.dest('dist'));  
});  
gulp.task('com',()=>{
    runSequence('revJS','revCSS','addv');
})
gulp.task('def',()=>{
        var jsFilter = filter('**/app.js',{restore:true}),
        cssFilter = filter('**/index.css',{restore:true}),
        htmlFilter = filter(['**/index.html'],{restore:true});
        gulp.src('index.html')
        .pipe(useref())
        .pipe(jsFilter)
        .pipe(uglify())
        .pipe(jsFilter.restore)
        .pipe(cssFilter)                        // 过滤所有css
        .pipe(minifyCss())                           // 压缩优化css
        .pipe(cssFilter.restore)
        .pipe(RevAll.revision({                 // 生成版本号
            dontRenameFile: ['.html'],          // 不给 html 文件添加版本号
            dontUpdateReference: ['.html']      // 不给文件里链接的html加版本号
        }))
        .pipe(htmlFilter)                       // 过滤所有html                     // 压缩html
        .pipe(htmlFilter.restore)
        .pipe(gulp.dest('dist/'))               
})
gulp.task('cls',()=>{
   return gulp.src('dist')
    .pipe(clean());
});
gulp.task('test',['cls'],(cb)=>{
        gulp.src('css/*.css')
        .pipe(contact('index.css'))
        .pipe(gulp.dest("dist/css"))  
        .pipe(rev())     
        .pipe(rev.manifest())
        .pipe(gulp.dest("dist"))
        .on('end',cb)
}) ;
gulp.task('te',['test'],()=>{    
    gulp.src(['dest/rev-manifest.json', 'index.html'])  
        .pipe(revCollector())       
        .pipe(gulp.dest('dist'));  
}); 