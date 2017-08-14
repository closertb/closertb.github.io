    var gulp = require('gulp'),
    reqOptimize =require('gulp-requirejs-optimize'),
    babel = require('gulp-babel'),
    presets = require('babel-preset-es2015'),
    rename = require("gulp-rename"),
    contact =require('gulp-concat'),
    rev =require('gulp-rev'),
    replace =  require('gulp-replace'),
    revReplace =  require('gulp-rev-replace'),   
    format =require('gulp-rev-format'), 
    gutil = require('gulp-util'),   
    revCollector = require('gulp-rev-collector'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify'),
    runSequence = require('run-sequence'),
    minifyCss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer');
//var livereload = require('gulp-livereload');
var browserSync = require("browser-sync").create();//创建服务 
//var basePath ='../myBlog'
var basePath ='dist'

/*将所有的图片转移到发布目录*/
gulp.task('revImg',function(){
   return gulp.src('img/**/*')
    .pipe(gulp.dest(basePath+'/img'));
});

gulp.task("clean",function () {
    return gulp.src([
        'rev-manifest.json'
    ]).pipe(clean());
});
gulp.task('revJS', function (cb) {
    gulp.src('js/app.js')
    .pipe(reqOptimize({
    optimize:"none",
    paths:{
        vueRouter:'lib/vue-router',
        fetchPoly:'lib/fetch',
        marked:'component/marked',
        editor:'component/editor',
        temp:'component/template',
        resume:'component/resume',         
        resize:'component/resizeWindow'
    }
    }))
    .pipe(babel({  
            presets: ['es2015']  
        }))
    .pipe(uglify().on('error',function(err){
            gutil.log(err);
            this.emit('end');        
    }))
    .pipe(gulp.dest(basePath+'/js'))
  //  .pipe(uglify())
    .pipe(rev())
    .pipe(format({  
      prefix: '.', // 在版本号前增加字符  
      suffix: '.cache', // 在版本号后增加字符  
      lastExt: false  
    }))   
    .pipe(rev.manifest({
        merge:true
    }))
  //  .pipe(modify(replaceSuffix))            //- 去掉.js后缀
    .pipe(gulp.dest(''))       
    .on('end',cb);   
});

gulp.task('revCSS',function(cb){  
     gulp.src('css/*.css')
    .pipe(autoprefixer({
            browsers: ['last 3 Safari versions'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            remove:true //是否去掉不必要的前缀 默认：true
        }) )   
    .pipe(contact('index.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest( basePath+'/css'))    
    .pipe(rev())
    .pipe(format({  
      prefix: '.', // 在版本号前增加字符  
      suffix: '.cache', // 在版本号后增加字符  
      lastExt: false  
    }))  
    .pipe(rev.manifest({
        merge:true
    }))
    .pipe(gulp.dest(""))
    .on('end',cb)
});

gulp.task('updateHtml',function() {  
    var manifest = gulp.src(["rev-manifest.json"]);  
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
     // .pipe(replace(/(\.[a-z]+)\?(v=)?[^\'\"\&]*/g,"$1"))   
      .pipe(revReplace({  
      manifest: manifest,  
      modifyUnreved: modifyUnreved,  
      modifyReved: modifyReved  
    }))    
    .pipe(gulp.dest(basePath));  
}); 

//启动热更新  
 gulp.task('default', ['clean'], function() {  
    runSequence(       
        ["revImg",'revJS','revCSS'], 
        "updateHtml");      //- 替换index.html文件名
     browserSync.init({  
        port: 80,  
        server: {  
            baseDir: [basePath]  
        }   
    });  
  //监控文件变化，自动更新 
    gulp.watch(['js/app.js'], function(){
            runSequence(
            "revJS",                    
            "updateHtml", 
            browserSync.reload     
        );       
    }); 
    gulp.watch('css/*.css',  function(){
            runSequence(
            "revCSS",                    
            "updateHtml",
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

/*以下代码非构建代码，为算法速度测试*/
gulp.task('ug',()=>{
    return gulp.src('js/component/resizeWindow.js')
    .pipe(babel({  
            presets: ['es2015']  
        }))
    .pipe(uglify().on('error',function(err){
            gutil.log(err);
            this.emit('end');        
    }))
    .pipe(gulp.dest('dist'));
})
gulp.task('fun',()=>{
/*     console.log('satat');
    console.log(foo);
    var foo ='sabi';
    function foo(){
        console.log('first');
    }
    console.log('end');
    console.log(foo) */
    var arr = [1,2,3,4,5];
    console.log(arr.concat(arr));
})


