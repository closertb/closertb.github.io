define(function(){
    function waitload(cr){
        return cr('div',{
            attrs:{
                class:'waitLoad'
            }
        },[cr('div',[
            cr('span',{
                attrs:{
                 class:'spanCenter'                   
                }
                },[cr('i',{
                    attrs:{
                    class:'fa fa-spinner fa-spin'                   
                    }                
                    })]),
                    cr('span',{
                        attrs:{
                        class:'span1rem'                   
                        },
                    domProps:{
                        innerHTML:'服务器响应缓慢，请耐心等待'
                    }
                })
        ])])
    }
return {
    
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
             },[
                 createElement('div',[
                     createElement('span',{
                    domProps:{innerHTML:info.username}
                    }),
                    createElement('span',{
                    attrs:{
                        id:"editContent"
                    },
                    domProps:{
                            innerHTML:'编辑'
                    },
                    on:{
                        click:function(){
                            vm.editContent(info.index);
                        }
                    } 
                    })
             ]),
                createElement('div',{
                 domProps:{innerHTML:info.postdate}
             }),]);
            }
/*             infoarr.map(function(key){
                 return createElement('div',{domProps:{innerHTML:key}});
             }) */
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
        return createElement('article',[waitload(createElement),infoTemp(vm.item.currentInfo),titleTemp('h1','arttitle',vm.item.currentInfo.title),titleTemp('p','artcontent',vm.item.currentInfo.content),relatedNav(vm.item.relatedInfo)]);        
    },
    itemTemp:function(createElement,vm){
        const stylelist = ['jsimg','cssimg','htmlimg','htmlimg','htmlimg'];
        function tagTemp(item,sty){
            return createElement('h3',[createElement('label',{
                attrs:{
                    class:sty
                }
            }),createElement('span',{
                domProps:{
                    innerHTML:item.count
                }
            })]);
        }
        function itemList(item){
            return createElement('ul',item.list.map(function(data){
                return createElement('li',[createElement('i',{
                    attrs:{
                        class:'fa fa-fw fa-caret-right'
                    }
                }),createElement('a',{
                    attrs:{
                        href:'javaScript:;'
                    },
                    domProps:{
                        innerHTML:data.title
                    },
                    on:{
                        click:function(){
                            vm.gotodetail(data.index);
                        }
                    }
                }),createElement('span',{
                domProps:{
                    innerHTML:data.postdate
                }
            })])
            }))
        }
        return createElement('article',vm.items.map(function(item){
            let imgstyle = stylelist[item.tid-1];
            return createElement('div',{
                attrs:{
                    class:'item-list'
                }
            },[waitload(createElement),tagTemp(item,imgstyle),itemList(item)])
        }))
    },
    contentTemp:function(createElement,vm){
        function titleTemp(item){
            return createElement('div',{
            attrs:{
                "class":'listTitle'
            },
            domProps:{
                innerHTML:item.title
            },                    
            on:{
                 click:function(event){
                        vm.gotodetail(item.index)
                  }
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
                }
            },[waitload(createElement),infoTemp(item),titleTemp(item)]);
        })]
        );
    },
    versionTemp:function(createElement,items){
        function baseSpan(style,ele){
            return createElement('span',{attrs:{
                class:style
            },
            },[ele])
        }
        function conSpan(style,data){
            return createElement('span',{attrs:{
                class:style
            },
            domProps:{
                innerHTML:data
            }})
        }
        return createElement('article',[createElement('ul',{
            attrs:{
                class:'skcontainer'
            }
        },items.map(function(item){
            return createElement('li',{attrs:{
                class:'skitem'
            }}, [conSpan('skdate',item.date),baseSpan('skborder',baseSpan('skdot','')),baseSpan('skline',''),
         baseSpan('skcontent',[conSpan('skversion',item.version+':'),conSpan('skversion',item.content)])])})
        )]);
    }
};
});