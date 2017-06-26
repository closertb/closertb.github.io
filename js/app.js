requirejs.config({
    paths:{
        vue:'lib/vue',
        vueRouter:'lib/vue-router',
        vueResource:'lib/vue-resource',
        temp:'component/template',
        resize:'component/resizeWindow'
    }
});
requirejs(['vue','vueRouter','vueResource','temp','resize'],function(Vue,VueRouter,VueResource,tempModule,resizeWindow){
    //console.log("test:"+tempModule.conTemp());
  //  console.log(VueRouter);
    Vue.use(VueRouter);
    Vue.use(VueResource);
    window.onresize =resizeWindow.resizeWindow;
    document.querySelector('.off-canvas-launcher').addEventListener('click', resizeWindow.showNav);  
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
            },
            {
                    index:13,
                    username:'Denzel B',
                    postdate:'2017年02月20日',
                    classitem:'我的专栏',
                    title:'this is a title'
            },
            {
                    index:14,
                    username:'Denzel C',
                    postdate:'2017年02月20日',
                    classitem:'我的专栏',
                    title:'this is a title'
            },
            {
                    index:15,
                    username:'Denzel D',
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
                },
                {
                        index:13,
                        username:'Denzel B',
                        postdate:'2017年02月20日',
                        itemName:'我的专栏',
                        title:'this is a title'
                },
                {
                        index:14,
                        username:'Denzel C',
                        postdate:'2017年02月20日',
                        itemName:'我的专栏',
                        title:'this is a title'
                },
                {
                        index:15,
                        username:'Denzel D',
                        postdate:'2017年02月20日',
                        itemName:'我的专栏',
                        title:'this is a title'
                }]
            }
        },
        beforeRouteEnter(to, from, next){
            console.log("get data");
            next(function(k){
                console.log("start");
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
                console.log("input:"+num);
                router.push({path: '/coninfo',query:{arcindex:num}});
                api.activeTag= '返回列表';;
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
                  api.activeTag= '返回列表';
                }else{
                  alert("已经到列表的尽头");
                }
               
            },
            changeUrl:function(){
                let itemId =this.item.currentInfo.itemId;
                console.log("imgId:"+itemId);
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
           console.log("created:"+this.$route.query.arcindex); 
           this.fetchDataById();
        //   console.log(this.$route);
        },
        watch:{
            '$route':'fetchDataById',
            'item':'changeUrl'
        },
        beforeRouteEnter(to, from, next){
            console.log("beforeRouteEnter");
            next(function(k){
              //  k.item.currentInfo.username ="denzel funck";
                console.log(k.item);
            });
        },
        beforeRouteUpdate (to, from, next) {
            console.log("beforeRouteUpdate--queryid:");
            next(function(k){
             console.log(k.$route);
            });

        }
    };      
    const routes = [
    { path: '/foo', component: Bar },
    { path: '/bar', component: Bar },
    { path: '/detInfo',name:'detailInfo', component: listInfo },
    { path: '/conInfo',name:'conInfo', component: content}
    ];

    const router = new VueRouter({
        routes
    })
    document.querySelector('.off-canvas-launcher').addEventListener('click', function(){
        console.log("123")
    });

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
                   api.activeTag= '返回列表';
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
    var api =new Vue({
    router,
    el:"#api",
    data:function(){
        return {activeTag:'文章列表',
        };
    },
    methods:{
        godie:function(){
            console.log("fuck you ");
        },
        goback:function(event){
            event.stopPropagation();
            if(this.$data.activeTag==="返回列表"){
                router.go(-1);
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
                console.log("get ajax");
            })
         //   this.$http.get('');
        },
        hideNav:resizeWindow.hideNav
    }      
});           
})