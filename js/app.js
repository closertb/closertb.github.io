requirejs.config({
    paths:{
/*  
        vue:'lib/vue',*/  
        vueRouter:'lib/vue-router',    
        editor:'component/editor',    
        temp:'component/template',         
        resize:'component/resizeWindow'               
    }         
});
//requirejs(['vue','vueRouter','vueResource','temp','resize'],function(Vue,VueRouter,VueResource,tempModule,resizeWindow){
requirejs(['vueRouter','temp','resize','editor'],function(VueRouter,tempModule,resizeWindow,editor){
    //Vue.use(VueRouter);    
    const reqUrl ='http://localhost:8089/StockAnalyse';   
    window.onresize =resizeWindow.resizeWindow;   
    document.querySelector('.off-canvas-launcher').addEventListener('click', resizeWindow.showNav); 
    document.querySelector('.shadeLayer').addEventListener('click',resizeWindow.hideNav);  
    document.querySelector("#loginEnable").addEventListener('click',function(){
        login.showForm();         
    });         
    /*fetch请求配置项参数初始化*/      
    /*为解决fetch请求时，设置Content-Type为application/json时,后台采用
    getPrameters获取不到参数,所以在发送前，手动将js对象转换为名值对格式，即
    application/x-www-form-urlencoded格式，然后在传给body*/
    function fetchInitOption(json){ 
        let res=new Array();      
        for(let item in json){          
            res.push(item+'='+json[item])    
        }  
        return { 
            method:'post',
            mode:'cors', 
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body:res.join('&')            
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
    Vue.component('editor',{   
        render:function(createElement){
            return editor.component(createElement);}   
    });  
      
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

    const Bar = { template: '<div>bar</div>' };
    const markdownEditor = {
        render:function(createElement){
                    return editor.component(createElement);
                },
         data: function() {
             return {
                 content:'nothing'
             }
         }       
    }
    const listInfo ={
       render:function(createElement){
            return tempModule.contentTemp(createElement,this)
        },
        data: function() {  
            return {    
                items: [{  
                        index:10,
                        username:'Denzel A',
                        postdate:'2017年02月20日',
                        itemName:'我的专栏',
                        title:'this is a title'
                }]
            }    
        },
        beforeRouteEnter(to, from, next){
            //console.log("get data");
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
    const content = {
/*        template: '<div><div class="artheader"><div class="authImg"><img v-bind:src ="imgurl"></div><div class="authInfo"><div class="name">{{username}}</div><div class="postdate">{{postdate}}</div>'
          +'</div></div><div class="arttitle">{{title}}</div><p class="artcontent">{{content}}</p></div>',*/
        render:function(createElement){
            return tempModule.detailTemp(createElement,this)
        },
        data: function() {
            return {item:{
                currentInfo:{
                        count:0,
                        username:'Denzel boss',
                        itemId:0,
                        imgurl:'img/front.png',
                        postdate:'2017年02月20日',
                        itemName:'我的专栏',
                        content:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',                        
                        title:'this is a title'
                    },
                relatedInfo:{
                    last:{
                        title:'这是他的上一篇',
                        index:'12'
                    },
                    next:{
                        title:'这是他的下一篇',
                        index:'14'
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
            fetchDataById:function(){
              let indexId = this.$route.query.arcindex;
              let that = this;
            fetch(reqUrl+'/BlogServlet', fetchInitOption({flag:"getContentById",queryId:indexId}))            
            .then(function(response){
                console.log('callback');
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
        watch:{
            '$route':'fetchDataById',
            'item':'changeUrl'
        },
        beforeRouteEnter(to, from, next){
            next(function(k){
                console.log(k.item); 
            });
        },
        beforeRouteUpdate (to, from, next) {
            console.log("beforeRouteUpdate-queryid:");
            next(function(k){
             console.log(k.$route);
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
        this.updateText();
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
        updateText:function(){
            const editor = this.$('#text-input');
            const preview = this.$('#preview');
           // preview.innerHTML = markdown.toHTML(editor.innerHTML);            
        },
        $:function(id) {     
            return document.querySelector(id);  
        }, 
        getSelText:function(){         
            let word ="";
            let target =window.getSelection() ; 
            console.log(target);
            console.log(target.getRangeAt(0)); 
            if(window.getSelection){
                var range=document.createRange();
                console.log('get');    
                if(target.rangeCount>0){ 
                  console.log(':'+target.rangeCount);  
                  console.log(target.text);
                }    
            }else{     
              console.log('getNothing');  
            }
        }, 
        setTagName:function(){
            let path = this.$route.name;
            const con_exc =/^conInfo/;
            const list_exc =/^detail/;
            if(con_exc.test(path)){ 
                 this.activeTag="返回列表"        
            }  
            if(list_exc.test(path)){
                 this.activeTag="文章列表"          
            }            
        },
        hideNav:resizeWindow.hideNav
    }      
}); 

/*var editDiv =new Vue({
    el:'#markdown',
    render:function(createElement){
        return editor.makeDom(createElement);
    },    
    component:editor.makeDom(createElement),
    created(){
        console.log('it is done')
    }
});  */
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
                            console.log(data);
                            that.userInfo = data;
                            document.querySelector("#showInfo").classList.toggle("isLogin");
                            document.querySelector("#showrName").innerHTML=that.userInfo.userName;                 
                            that =null;
                        });                      
                    }else{
                            console.log("alreadyLogin:");                                            
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
                    sessionStorage.setItem("token",data);
                    that.isActive =false;
                    document.querySelector("#showInfo").classList.toggle("isLogin");
                    document.querySelector("#showrName").innerHTML=that.userInfo.userName;
                    that = null;
                })                 
            }
        }
});                      
})