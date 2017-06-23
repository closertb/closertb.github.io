requirejs.config({
    paths:{
        vue:'lib/vue',
        temp:'app/template'
    }
});
requirejs(['vue','temp'],function(Vue,tempModule){
    //console.log("test:"+tempModule.conTemp());
    
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
               // this.$emit('btnClick',msg);
               console.log(msg);
        }
        }
     });
        /*this is a test demo*/
        function test(a){
            console.log(a);//Vue
        }

        function test1(a,b){
        　　console.log(a,"this is the second arg:"+b);//Vue hello
        }

        let oTest = {
            varlog:"are you right",
            install:function(a,b){
                console.log(a,b);//Vue hello1
            }
        }
        Vue.use(test);    

        Vue.use(test1,'hello');
        console.log(oTest.varlog);
      //  oTest.install("sub","is you");

        Vue.use(oTest,'hello world')
        console.log(oTest);       
})