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
            }
        },
        methods:{
            gotodetail:function(num){
                console.log("input:"+num);
                router.push({path: '/coninfo'});
            },
            godie:function(){
                console.log("i got it");
            }
        }
    }; 
        const content = {
        template: '<div><div class="artheader"><div class="authImg"><img v-bind:src ="imgurl"></div><div class="authInfo"><div class="name">{{username}}</div><div class="postdate">{{postdate}}</div>'
          +'</div></div><div class="arttitle">{{title}}</div><p class="artcontent">{{content}}</p></div>',
        data: function(temp) {
            var returndata;
            let item= {
                        count:0,
                        username:'Denzel boss',
                        imgurl:'img/mine.jpg',
                        postdate:'2017年02月20日',
                        classitem:'我的专栏',
                        title:'this is a title',
                        content:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
             }
            if(arguments.length===0){
                returndata = item;
            }else{
                returndata = temp;
            }
          //  console.log(returndata);
            return returndata;
        },
        beforeRouteEnter(to, from, next){
            console.log("get data");
            next(function(k){
                k.username ="denzel funck";
                console.log(k);
            });
        },
        beforeRouteUpdate (to, from, next) {
            console.log("update data"+this.$data);
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
                   api.isActive.a = false;
                   api.isActive.b = true;
                   api.isActive.c = true;  
                   router.push({path: '/foo'});                                    
               }
               if(msg==='list'){
                   api.isActive.a = true;
                   api.isActive.b = false;
                   api.isActive.c = true;   
                   router.push({path: '/coninfo'});                                    
               } 
               if(msg==='more'){
                   api.isActive.a = true;
                   api.isActive.b = true;
                   api.isActive.c = false; 
                   router.push({name:'detailInfo'});                                      
               }                            
        }
        }
     });       
    var api =new Vue({
    router,
    el:"#api",
    data:{
        isActive:{
            a:true,
            b:false,
            c:true
        }
    },
    methods:{
        godie:function(){
            console.log("fuck you ");
        },
        hideNav:resizeWindow.hideNav
    }      
}); 

          
})