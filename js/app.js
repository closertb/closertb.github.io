requirejs.config({
    paths:{
/*
        vue:'lib/vue',*/
        vueRouter:'lib/vue-router',
        vueResource:'lib/vue-resource',
        temp:'component/template',
        resize:'component/resizeWindow'
    }
});
//requirejs(['vue','vueRouter','vueResource','temp','resize'],function(Vue,VueRouter,VueResource,tempModule,resizeWindow){
requirejs(['vueRouter','vueResource','temp','resize'],function(VueRouter,VueResource,tempModule,resizeWindow){
    Vue.use(VueRouter);
    Vue.use(VueResource);
    window.onresize =resizeWindow.resizeWindow;
    document.querySelector('.off-canvas-launcher').addEventListener('click', resizeWindow.showNav);  
    document.querySelector("#loginEnable").addEventListener('click',function(){
        login.showForm();
    });
    document.querySelector("#loginOut").addEventListener('click',function(){
       document.querySelector("#showInfo").classList.remove("isLogin");
       login.userInfo = "";
       sessionStorage.removeItem("token");
    });     
    /*此处设置vue-resource 拦截器，用于设置http请求头*/
    Vue.http.interceptors.push((request,next)=>{
        let token =sessionStorage.getItem("token");
      //  console.log("token:"+token);    
/*        if(token !==null ){
            request.headers.set('AuthKey',token);
        }*/
     //   console.log(request.headers)
        next((response) => {
         //   console.log(response.status)
            return response
        });
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
    const Foo = { 
        render:function(createElement){
            console.log(this.item);
            return tempModule.contentTemp(createElement,this)
        },
        data:function(){
                return {items:[{
                    index:10,
                    username:'Denzel A',
                    postdate:'2017年02月20日',
                    classitem:'我的专栏',
                    title:'this is a title'
            }]
        }}
    };
    const Bar = { template: '<div>bar</div>' };
      //  const detInfo ={template:'<div class="arclist"><div class="listInfo"><span>{{$route.params}}</span><span>{{$route.params}}</span><span>{{$route.params.username}}</span></div><div class="listTitle">{{$route.params.username}}</div></div>'}
    const listInfo ={
/*        template: '<div><div class="arclist" v-for="item in items" v-on:click="gotodetail(item.index)"><div class="listInfo"><span>{{item.username}}</span><span>{{item.postdate}}</span><span>{{item.classitem}}</span></div><div class="listTitle">{{item.title}}</div></div></div>',
*/      render:function(createElement){
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
               // console.log("start");
              //  k.item.username ="denzel funck";
                k.$http({
                method:'post',
                url:'http://localhost:8089/StockAnalyse/BlogServlet',
                params:{"flag":"getList"}, 
                headers: {"X-Requested-With": "XMLHttpRequest"},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
                credientials:false, 
                emulateJSON: true                    
            }).then(function(response){
            //    console.log(response.data);
                k.items = response.data;
            })                
              //  console.log(k);
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
             }};
        },
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
              this.$http({
                method:'post',
                url:'http://localhost:8089/StockAnalyse/BlogServlet',
                params:{"flag":"getContentById","queryId":indexId}, 
                headers: {"X-Requested-With": "XMLHttpRequest"},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
                credientials:false, 
                emulateJSON: true                    
            }).then(function(response){
                this.item = response.data;
            })  
            }
        },
        created(){
         //  console.log("created:"+this.$route.query.arcindex); 
           this.fetchDataById();
        //   console.log(this.$route);
        },
        watch:{
            '$route':'fetchDataById',
            'item':'changeUrl'
        },
        beforeRouteEnter(to, from, next){
           // console.log("beforeRouteEnter");
            next(function(k){
              //  k.item.currentInfo.username ="denzel funck";
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
/*    document.querySelector("#test").addEventListener("click",function(){
        console.log(123);
        console.log("value:");
        console.log(login);
        login.checkLogin();
    })*/
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
                   console.log("got it:"+14) 
                   router.push({path: '/coninfo',query:{arcindex:14}});                                    
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
    { path: '/conInfo',name:'conInfo', component: content}
    ];

    const router = new VueRouter({
        routes
    })
var api =new Vue({
    router,
    el:"#api",
    data:{
        activeTag:''
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
            if(con_exc.test(path)){ 
                 this.activeTag="返回列表"        
            }
            if(list_exc.test(path)){
                 this.activeTag="文章列表"          
            }            
        },
        ajaxTest:function(){
            let user={
                name:'Dom',
                id:'123456'
            };
            console.log("start");
            this.$http({
                method:'post',
                url:'http://localhost:8089/StockAnalyse/LoginServlet',
                params:{"flag":"ajaxlogin","loginName":user.name,"loginPwd":user.id}, 
                headers: {"X-Requested-With": "XMLHttpRequest"},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
                credientials:false, 
                emulateJSON: true                    
            }).then(function(response){
                console.log("get ajax:"+response.data);
                sessionStorage.setItem("token",response.data);
            })
        },
        hideNav:resizeWindow.hideNav
    }      
});    
var login = new Vue({
    el:"#login",
    router,        
        data:{
            isActive:false,
            userInfo:{
                userName:'',
                userPsd:''
            }
        },
/*    watch:{     
            '$route':'showInfo'
    },*/
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
                let token =sessionStorage.getItem('token'); 
                if(token!==null){
                    if(this.userInfo.userName===''){
                        this.$http({
                            method:'post',
                            url:'http://localhost:8089/StockAnalyse/LoginServlet',
                            params:{"flag":"checklogin","token":token}, 
                        //    headers: {"X-Requested-With": "XMLHttpRequest"},
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},                   
                            credientials:false, 
                            emulateJSON: true                    
                        }).then(function(response){
                            this.userInfo = response.data;
                            document.querySelector("#showInfo").classList.toggle("isLogin");
                            document.querySelector("#showrName").innerHTML=this.userInfo.userName;                    
                        })                     
                    }else{
                            console.log("alreadyLogin:");                                            
                            document.querySelector("#showInfo").classList.toggle("isLogin");
                            document.querySelector("#showrName").innerHTML=this.userInfo.userName;                         
                    }
                }
            },
            userLogin:function(){
                this.$http({
                    method:'post',
                    url:'http://localhost:8089/StockAnalyse/LoginServlet',
                    params:{"flag":"ajaxlogin","loginName":this.userInfo.userName,"loginPwd":this.userInfo.userPsd}, 
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
                    credientials:false, 
                    emulateJSON: true                    
                }).then(function(response){
                    sessionStorage.setItem("token",response.data);
                    this.isActive =false;
                    document.querySelector("#showInfo").classList.toggle("isLogin");
                    document.querySelector("#showrName").innerHTML=this.userInfo.userName;
                })                 
            },
            checkLogin:function(){
                let token =sessionStorage.getItem('token');
                console.log("start check:"+token);
                this.$http({
                    method:'post',
                    url:'http://localhost:8089/StockAnalyse/LoginServlet',
                    params:{"flag":"checklogin","isLogin":true,"token":token}, 
                //    headers: {"X-Requested-With": "XMLHttpRequest"},
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
                    headers:{'token':token},                    
                    credientials:true, 
                    emulateJSON: true                    
                }).then(function(response){
                    console.log("get check:"+response.data);
                })                 
            }
        }
});                      
})