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
    detailTemp:function(createElement,vm){
         function titleTemp(el,classname,content){
            return createElement(el,{
            attrs:{
                "class":classname
            },
            domProps:{
                innerHTML:content
            }
          });
        }
        function infoTemp(infodata){
            function createImg(imgurl){
                return createElement('div',{
                attrs:{
                    "class":'authImg'
                }
                },[createElement('img',{attrs:{
                    "src":imgurl
                }})]); 
            }
            function createInfo(info){
              var infoarr =[info.username,info.postdate];
              return createElement('div',{
                attrs:{
                    "class":'authInfo'
                }               
             },infoarr.map(function(key){
                 return createElement('div',{domProps:{innerHTML:key}});
             }));
            }
            return createElement('div',{
            attrs:{
                "class":'artheader'
            }
          },[createImg(infodata.imgurl),createInfo(infodata)]); 
        }
        function relatedNav(item){
            function createDiv(inputObj){
                var navItems=['上一篇','下一篇'];
                if(arguments.length===0){
                    return createElement('div',navItems.map(function(key){
                        return createElement('span',{domProps:{innerHTML:key}})
                    }));
                }else if(arguments.length===1){
                    navItems=[inputObj.last,inputObj.next]; 
                    return createElement('div',navItems.map(function(key){
                        return createElement('a',{                        
                            on:{
                                click:function(){
                                    vm.gotodetail(key.index);
                                }
                            },
                            domProps:{
                                innerHTML:key.title}
                            })
                    }));
                }
            }           
            var ar =[1,2];
            return createElement('div',{
                        attrs:{
                            "class":'relatedNav'
                        } 
                    },[createDiv(),createDiv(item)])           
        }        
        return createElement('article',[infoTemp(vm.item.currentInfo),titleTemp('h1','arttitle',vm.item.currentInfo.title),titleTemp('p','artcontent',vm.item.currentInfo.content),relatedNav(vm.item.relatedInfo)]);        
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
            var info =[item.username,item.postdate,item.itemName];
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
        return createElement('article',[vm.items.map(function(item){
            return createElement('div',{
                attrs:{
                    class:'arclist'
                },                    
                on:{
                    click:function(event){
                        /*考虑这里是否需要冒泡*/
                     //   event.stopPropagation();
                        vm.gotodetail(item.index)
                    }
                }
            },[infoTemp(item),titleTemp(item.title)]);
        })]
        );
    }
};
});