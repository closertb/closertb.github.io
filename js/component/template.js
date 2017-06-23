define(function(){
return {
    navTemp:function(createElement,items){
    return createElement('div',items.map(function(data){
        return createElement('a',{
                attrs:{
                    "class":'nav-link',
                    "href":'#',
                },
                domProps:{
                    innerHTML:data.cname
                }
            })
    }))
    },
    countTemp:function(createElement,items){
        return createElement('ul',items.map(function(data){
            return createElement('li',{
                    on:{
                        click:function(){
                            console.log("click:"+data.count)
                        }
                    },
                    domProps:{
                        innerHTML:data.count
                    }
                })
        }));
    },
    contentTemp:function(createElement,vm){
        function titleTemp(title){
            return createElement('div',{
            attrs:{
                "class":'listTitle'
            },
            domProps:{
                innerHTML:title
            }
          });
        }
        function infoTemp(item){
            var info =[item.username,item.postdate,item.classitem];
            return createElement('div',{
            attrs:{
                "class":'listInfo'
            } 
          },info.map(function(data){
              return createElement('span',{
                  domProps:{
                      innerHTML:data
                  }
              })
          }))
        }          
        return createElement('div',vm.items.map(function(item){
            return createElement('div',{
                attrs:{
                    class:'arclist'
                },                    
                on:{
                    click:function(){
                        vm.gotodetail(item.index)
                    }
                }
            },[infoTemp(item),titleTemp(item.title)]);
        })
        );
    }
};
});