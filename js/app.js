requirejs.config({
    paths:{
        vueRouter:'lib/vue-router',    
        editor:'component/editor',    
        temp:'component/template',         
        resize:'component/resizeWindow'               
    }         
});
requirejs(['vueRouter','temp','resize','editor'],function(VueRouter,tempModule,resizeWindow,editor){   
    const reqUrl ='http://localhost:8089/StockAnalyse';   
    // const reqUrl ='/myBlog';  
    window.onresize =resizeWindow.resizeWindow;   
    document.querySelector('.off-canvas-launcher').addEventListener('click', resizeWindow.showNav); 
    document.querySelector('aside.shadeLayer').addEventListener('click',resizeWindow.hideNav);  
    document.querySelector("#loginEnable").addEventListener('click',function(){
        login.showForm();         
    });         
    /*fetch请求配置项参数初始化*/      
    /*为解决fetch请求时，设置Content-Type为application/json时,后台采用
    getPrameters获取不到参数,所以在发送前，手动将js对象转换为名值对格式，即
    application/x-www-form-urlencoded格式，然后在传给body*/
    function fetchInitOption(json){
        let sendData; 
        if(json instanceof Object) {  
            let res=new Array();   
            for(let item in json){          
                res.push(item+'='+json[item])    
            }  
            sendData =res.join('&') ;         
        }else{
            sendData = json ;  
        }
    //    console.log('callback:'+sendData); 
        return {  
            method:'post',
            mode:'cors', 
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body:sendData           
        };                   
    }        
    document.querySelector("#loginOut").addEventListener('click',function(){
       document.querySelector("#showInfo").classList.remove("isLogin");
       sessionStorage.removeItem("token");  
    });     
    /*此处设置vue-resource 拦截器，用于设置http请求头*/
/*    Vue.http.interceptors.push((request,next)=>{
        let token =sessionStorage.getItem("token");
        next((response) => {
            return response
        }); 
    });*/ 
/*     Vue.component('editor',{   
        render:function(createElement){
            return editor.component(createElement);}   
    });   */
      
    Vue.component('navlist',{    
    render:function(createElement){  
        return tempModule.navTemp(createElement,this.item);
    },
    props:['item']            
    }); 
    Vue.component('countlist',{
    render:function(createElement){
        return tempModule.countTemp(createElement,this.item);
    },
    props:['item']               
    });          
    /*注册markdown编辑器组件*/
    const markdownEditor = {
        render:function(createElement){
                    return editor.component(createElement,this);
                },
         data: function() {
             return {
                 arcticle:{  
                        index:0,
                        title:'', 
                        itemName:'',
                        itemId:3,
                        tags:'',
                        content:''
                }
             }
         },
        methods:{
            fetchDataById:function(indexId,that){
                fetch(reqUrl+'/BlogServlet', fetchInitOption({flag:"getEditContent",queryId:indexId}))            
                .then(function(response){
                    if(response.ok){
                        return response.json();
                    } else {
                        console.error('服务器繁忙，请稍后再试；\r\nCode:' + response.status)
                    }  
                }).then(function(data){
                that.arcticle =data;
                that.arcticle.content = editor.toOrigin(that.arcticle.content);
                that = null;
                })  
            },
            uploadImg:function(data,callback){
                    fetch(reqUrl+'/imgUploadServlet',{
                                method:'post',
                                mode:'cors', 
                                body:data                       
                    })
                    .then(function(response){
                        if(response.ok){
                            console.log('suc')
                            return response.text();
                        }else{
                            console.log('网络错误，请稍后再试')
                            return ;
                        }
                    }).then(function(data){
                       callback(reqUrl+data);//函数回调
                    })
            },
            editContent:function(data){
                let token =sessionStorage.getItem('token');
                console.log('token:',token)
                if(token===null){
                    alert("请先登录");
                    return ;
                }
                if(token.length<10){
                    alert("请确保你已正确登录");
                    return ;                   
                }
                data.token = token ;
                console.log(data);
              //  data = data + "&token ="+token;
                    fetch(reqUrl+'/BlogServlet',fetchInitOption(data))
                    .then(function(response){
                        if(response.ok){
                            return response.text();
                        }else{
                            console.log('网络错误，请稍后再试');
                        }
                    }).then(function(data){
                        console.log('index',data);
                        router.push({path: '/coninfo',query:{arcindex:data}})
                    })
            }
        },
        beforeRouteEnter(to, from, next){
            next(function(k){
                let query = k.$route.query
                console.log(query.hasOwnProperty('arcindex'))
                if(query.hasOwnProperty('arcindex')){
                  k.fetchDataById(query.arcindex,k);
                }
            });
        }       
    }
    /*注册列表视图组件*/    
    const listInfo ={
       render:function(createElement){
            return tempModule.contentTemp(createElement,this)
        },
        data: function() {  
            return {    
                items: [{  
                        index:0,
                        username:' ',
                        postdate:' ',
                        itemName:' ',
                        title:' '
                }]
            }    
        },
        beforeRouteEnter(to, from, next){
         next(function(k){  
            fetch(reqUrl+'/BlogServlet', fetchInitOption({flag:"getList"}))
            .then(function(response){
                    if(response.ok){
                            return response.json();
                    } else {
                        console.error('服务器繁忙，请稍后再试；\r\nCode:' + response.status)
                    }
                }).then(function(data){
                    k.items =data;
                })                
            });
        },
        methods:{
            gotodetail:function(num){
                router.push({path: '/coninfo',query:{arcindex:num}});
            },
            godie:function(){
                console.log("i got it");
            }
        }
    }; 
    /*注册文章详情页视图组件*/
    const content = {
        render:function(createElement){
            return tempModule.detailTemp(createElement,this)
        },
        data: function() {
            return {item:{
                currentInfo:{
                        count:0,
                        index:0,
                        username:' ',
                        itemId:0,
                        imgurl:'img/front.png',
                        postdate:' ',
                        itemName:' ',
                        content:'',                        
                        title:''
                    },
                relatedInfo:{
                    last:{
                        title:'这是他的上一篇',
                        index:''
                    },
                    next:{
                        title:'这是他的下一篇',
                        index:''
                    }
                }
             }
        }},
        methods:{
            gotodetail:function(num){
                console.log("lastinput:"+num);
                if(num>0){
                  router.replace({path: '/coninfo',query:{arcindex:num}});
                }else{
                  alert("已经到列表的尽头");
                }
                     
            }, 
            changeUrl:function(){
                let itemId =this.item.currentInfo.itemId;
                switch (itemId) {
                    case 1:  
                        this.item.currentInfo.imgurl = 'img/js.png';
                        break;
                     case 2:
                        this.item.currentInfo.imgurl = 'img/css.png';
                        break;               
                    default:
                        this.item.currentInfo.imgurl = 'img/front.png';                    
                        break;  
                } 
            },
            setEditEnable:function(){
                let token =sessionStorage.getItem('token');
                if(token!==null&&token.length>10){
                    document.querySelector('.artheader').classList.toggle('editEnable');
                }else{
                    (document.querySelector('.artheader').classList.contains('editEnable'))&&(
                        document.querySelector('.artheader').classList.remove('editEnable')
                    );
                }
            }, 
            editContent:function(index){
               router.push({path:'/markdown',query:{arcindex:index}}) 
            }, 
            fetchDataById:function(){
              let indexId = this.$route.query.arcindex;
              let that = this;
            fetch(reqUrl+'/BlogServlet', fetchInitOption({flag:"getContentById",queryId:indexId}))            
            .then(function(response){
                if(response.ok){
                    return response.json();
                } else {
                    console.error('服务器繁忙，请稍后再试；\r\nCode:' + response.status)
                }
            }).then(function(data){
               that.item =data;
               that.item.currentInfo.content = editor.toPreview(that.item.currentInfo.content);
               that = null;
            })  
            }
        },
        created(){
           this.fetchDataById();
        },
        mounted(){
            this.setEditEnable(); 
        },
        watch:{
            '$route':'fetchDataById',
            'item':'changeUrl'
        },
        beforeRouteEnter(to, from, next){
            next(function(k){
                console.log('entered');
            });
        },
        beforeRouteUpdate (to, from, next) {
            console.log("beforeRouteUpdate-queryid:");
            next(function(k){
             //console.log(k.$route);
             console.log('update');
            });

        }
    };      
     var vm = new Vue({
        el:"#linkList",
        data:{
            navlist:[
                    {"cname":"个人简介"},
                    {"cname":"项目经验"},   
                    {"cname":"个人经历"},
                    {"cname":"所获荣誉"},
                    {"cname":"插件演示"}                                                      
                ],
            detCount:[
                {"count":18},
                {"count":21},
                {"count":3}
            ]    
        },
        methods:{     
            btnClick:function(msg){               
               if(msg==='item'){
                  api.activeTag= '文章列表';;
                   router.push({path: '/foo'});                                    
               }
               if(msg==='list'){ 
                   api.activeTag= '文章编辑';
                   router.push({path: '/markdown'});                                    
               } 
               if(msg==='more'){
                   api.activeTag= '文章列表';
                   router.push({name:'detailInfo'});                                      
               }                            
        }
        }
     });   
    const routes = [
    { path: '/', redirect: '/detInfo' },       
    { path: '/foo', component: listInfo },
    { path: '/detInfo',name:'detailInfo', component: listInfo },
    { path: '/conInfo',name:'conInfo', component: content},
    { path: '/markdown',name:'markdown', component: markdownEditor}
    ];

    const router = new VueRouter({
        routes
    })

    var api =new Vue({
    router,
    el:"#api",
    data:{
        activeTag:'',
        myinput:''
    },
    created:function(){    
        this.setTagName();  
    },    
    watch:{       
        '$route':'setTagName'
    },    
    methods:{     
        goback:function(event){    
            event.stopPropagation();
            if(this.activeTag==="返回列表"){
                router.go(-1);  
            }
        },
        setTagName:function(){
            let path = this.$route.name;
            const con_exc =/^conInfo/;
            const list_exc =/^detail/;
            const mark_exc =/^markdown/;
            if(con_exc.test(path)){ 
                 this.activeTag="返回列表";        
            }  
            if(list_exc.test(path)){
                 this.activeTag="文章列表" ;         
            }  
            if(mark_exc.test(path)){
                 this.activeTag="文章编辑" ;         
            }               
        }
    }      
}); 
var login = new Vue({
    el:"#login",
    router,        
    data:function(){
        return{
            isActive:false,
            userInfo:{
                userName:'',
                userPsd:''
            }
        }
    },
    created:function(){
        this.showInfo()
    },
    methods:{
            handle:function(curVal,oldVal){
    　　　　　　　console.log(curVal,'are old and the new are:',oldVal)
    　　　　 } ,   
            showForm:function(){
                this.isActive = !this.isActive;    
            },
            showInfo:function(){
                this.isActive =false; 
                let that = this;   
                let token =sessionStorage.getItem('token'); 
                if(token!==null && token!=='undefined'){
                    if(this.userInfo.userName===''){
                        fetch(reqUrl+'/LoginServlet', fetchInitOption({flag:"checklogin",token:token}))
                        .then(function(response){
                            if(response.ok){
                                return response.json();
                            } else {
                                console.error('服务器繁忙，请稍后再试；\r\nCode:' + response.status)
                            } 
                        }).then(function(data){
                            that.userInfo = data;
                            document.querySelector("#showInfo").classList.toggle("isLogin");
                            document.querySelector("#showrName").innerHTML=that.userInfo.userName;                 
                            that =null;
                        });                      
                    }else{                                          
                            document.querySelector("#showInfo").classList.toggle("isLogin");
                            document.querySelector("#showrName").innerHTML=that.userInfo.userName;
                            that =null;                         
                    }
                }
            },   
            userLogin:function(){
                let that = this;
                fetch(reqUrl+'/LoginServlet', fetchInitOption({flag:"ajaxlogin",loginName:this.userInfo.userName,loginPwd:this.userInfo.userPsd})
                ).then(function(response){
                    if(response.ok) {
                      return response.text();
                    } else {
                      console.error('服务器繁忙，请稍后再试；\r\nCode:' + response.status)
                    }                   
                }).then(function(data){
                    console.log('fixed',data)
                    if(data.length>10){
                        sessionStorage.setItem("token",data);
                        that.isActive =false;
                        document.querySelector("#showInfo").classList.toggle("isLogin");
                        document.querySelector("#showrName").innerHTML=that.userInfo.userName;
                        that = null;
                    }else{
                        alert('请输入与用户名匹配的密码');
                        that.userInfo.userPsd='';
                    }
                })                 
            }
        }
});                      
})