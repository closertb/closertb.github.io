define(["./component/marked.js"],function(marked){
  const makeIndex={
      index:0,
      posLink:''
  } 
  const complexMethod = (obj, {prefix, subfix, str},linkIndex) => {
    obj.focus()
    if (document.selection) {
        alert('your browser is too lower')
    } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
        let startPos = obj.selectionStart;
        let endPos = obj.selectionEnd;
        let tmpStr = obj.value;
        if (startPos === endPos) {
            // 直接插入图片，光标选项
            obj.value = tmpStr.substring(0, startPos) + prefix + str + subfix + tmpStr.substring(endPos, tmpStr.length);
            obj.selectionStart = startPos + prefix.length;
            obj.selectionEnd = startPos + (str.length + prefix.length);
            if(linkIndex){
                (linkIndex.index===1)&&(obj.value +='\n\n');
                obj.value += '\n['+linkIndex.index+']:'+linkIndex.posLink;
            }
        } else {
            // 存在选中区域（链接）
            if (tmpStr.substring(startPos - prefix.length, startPos) === prefix && tmpStr.substring(endPos, endPos + subfix.length) === subfix) {
                // 取消
                obj.value = tmpStr.substring(0, startPos - prefix.length) + tmpStr.substring(startPos, endPos) + tmpStr.substring(endPos + subfix.length, tmpStr.length);
                obj.selectionStart = startPos - prefix.length;
                obj.selectionEnd = endPos - prefix.length;
            } else {
                // 确定
                obj.value = tmpStr.substring(0, startPos) + prefix + tmpStr.substring(startPos, endPos) + subfix + tmpStr.substring(endPos, tmpStr.length);
                obj.selectionStart = startPos + prefix.length;
                obj.selectionEnd = startPos + (endPos - startPos + prefix.length);
                if(linkIndex){
                    (linkIndex.index===1)&&(obj.value +='\n\n');
                    obj.value += '\n['+linkIndex.index+']:'+linkIndex.posLink;
                }
            }
        }
    } else {
       ;//console.log('else')
    }
    obj.focus()
  }   
  const editorClick = (target, editType,poslink) => {
      const privateMethod ={
          undo:function(obj){
            ;//console.log('undo');
          },          
          redo:function(obj){
             ;//console.log('redo');             
          },
          trash:function(obj){
           ;// console.log('trash');              
          },
          save:function(obj){
           ;// console.log('save');              
          },
      }   
      const complexEdit = {
            'bold': {
                prefix: '**',
                subfix: '**',
                str: '粗体'
            },
            'italic': {
                prefix: '*',
                subfix: '*',
                str: '斜体'
            },
            'title': {
                prefix: '## ',
                subfix: ' ##',
                str: '标题'
            },
            'underline': {
                prefix: '++',
                subfix: '++',
                str: '下划线'
            },
            'strikethrough': {
                prefix: '~~',
                subfix: '~~',
                str: '中划线'
            },
            'mark': {
                prefix: '==',
                subfix: '==',
                str: '标记'
            },
            'superscript': {
                prefix: '^',
                subfix: '^',
                str: '上角标'
            },
            'subscript': {
                prefix: '~',
                subfix: '~',
                str: '下角标'
            },
            'quote': {
                prefix: '> ',
                subfix: '',
                str: '引用'
            },
            'ol': {
                prefix: '1. ',
                subfix: '',
                str: '有序列表'
            },
            'ul': {
                prefix: '- ',
                subfix: '',
                str: '无序列表'
            },
            'link': {
                prefix: '[',
                subfix: '][]',
                str: '链接地址'
            },
            'imagelink': {
                prefix: '![图片描述][',
                subfix: ']',
                str: ''
            },
            'code': {
                prefix: '```',
                subfix: '\n\n```\n',
                str: 'code'
            },
            'table': {
                prefix: '',
                subfix: '',
                str: '|column1|column2|column3|\n|-|-|-|\n|content1|content2|content3|\n'
            }
        };
        function change(_type){
            makeIndex.index +=1;
            makeIndex.posLink = poslink;
            if(_type==='link'){
                complexEdit[_type].subfix =']['+makeIndex.index+ ']';
            }else{
                complexEdit[_type].str = makeIndex.index;
            }

        }
        if (complexEdit.hasOwnProperty(editType)) {
            // 插入对应的内容
            (poslink!==undefined&&poslink!=='')&&change(editType);
            if(poslink){
              complexMethod(target,complexEdit[editType],makeIndex);
            }else{
            complexMethod(target,complexEdit[editType]);   
            }

        }else{  //除以上操作，其余的操作都在私有函数内解决；
            privateMethod[editType](target);
        }
  }
  const method ={
        updateText:function(){
                              const editor  = $('#text-input');
                              const preview =$('#preview');
                              preview.innerHTML = marked(editor.value); 
                    },
        doEdit:function(item){
            const editor  =$('#text-input');
            item = item.split('_')[1];
            if(document.getSelection){             
                if(item.indexOf('link')!==-1){ //需要弹出对话框
                    const dialog =document.querySelector('.newWindow');  
                    (item.indexOf('image')!==-1)&&(dialog.classList.toggle('imgAdd'))
                    dialog.style.display ='block';
                }else{
                    editorClick(editor,item);
                }
                this.updateText();
            }
        }
    }

    function $(id) { 
       return document.querySelector(id); 
    }    
     function debounce(fn, delay) {
        var timer = null;
        return function () {
           ;// console.log('start')
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context);
            }, delay);
        };
    }
  function makeDom(createElement,vm){
    let content = vm.arcticle;
    let editState = (content.index>0)?'add':'update';
    function makeContent(createElement,arcticle){
        function makeInputDiv(){
            return createElement('textarea',{
            attrs:{
                    id:"text-input",
                    placeholder:'输入你的内容',
                },
                domProps:{
                    innerHTML:arcticle.content
                },
                on:{
                    input:method.updateText
                }
            })
        }
        function makePreviewDiv(){
            return createElement('div',{
                attrs:{
                    id:"preview",
                    class:'artcontent'
                },
                domProps:{innerHTML:"这是内容"}
            })
        }
        return createElement('ul',{
            attrs:{
                class:"contentBox"
            }
        },[makeInputDiv(),makePreviewDiv()]) 
    } 
    function makeFormHeader(createElement,arcticle){
        function makeSelect(){
            const items =[{index:1,name:'JS'},{index:2,name:'CSS'},{index:3,name:'HTML'},{index:4,name:'综合'}]          
            return createElement('div',{
                attrs:{
                    class:'multiSelect'
                }
            },[createElement('input',{
                    attrs:{
                        id:'classInput',
                        placeholder:'输入类别名称',
                        value:arcticle.itemName
                    }
                }),
                createElement('select',{
                    attrs:{
                        id:'itemInput'
                    }
                },items.map(function(item){
                     if(item.index===arcticle.itemId){
                        return createElement('option',{
                            attrs:{
                                value:item.index,
                                selected:'selected'
                            },
                            domProps:{
                                innerHTML:item.name
                            }
                        })
                    }else{ 
                        return createElement('option',{
                            attrs:{
                                value:item.index,
                            },
                            domProps:{
                                innerHTML:item.name
                            }
                        })
                    }

                })),createElement('input',{
                    attrs:{
                        id:'tagInput',
                        placeholder:'输入标签',
                        value:arcticle.tags
                    }
                })
            ])

        }
        return createElement('form',{
            attrs:{
                class:'headerFotm'
            }
        },[createElement('div',[
            createElement('input',{
            attrs:{
                id:'titleInput',
                type:'text',
                placeholder:'输入你的标题',
                value:arcticle.title
            }
        }),createElement('input',{
            attrs:{
                id:'titleInput',
                type:'hidden',
                value:arcticle.index
            }
        })
        ]),makeSelect()])
    }   
    function makeEditor(createElement){
        const items =[
            {name:'eidt_title',index:8},
            {name:'eidt_bold',index:0},
            {name:'eidt_italic',index:1},
            {name:'eidt_link',index:2},
            {name:'eidt_mark',index:3},
            {name:'eidt_code',index:4},
            {name:'eidt_imagelink',index:5},
            {name:'eidt_ol',index:6},
            {name:'eidt_ul',index:7}/* ,
            {name:'eidt_hr',index:9},
            {name:'eidt_undo',index:10} */
        ];
        function makeAtag(index){
            return createElement('a',{
                attrs:{
                    class:'tagImg',
                    href:'javaScript:;',
                    style:"background-position-x:"+index*(-20)+"px"
                }
            })           
        };
        return createElement('ul',{
            attrs:{
                class:'editorBox', 
            }
        },items.map(function(data){
            return createElement('li',{
                attrs:{
                    id:data.name
                },
                on:{
                        click:function(){
                            method.doEdit(data.name); 
                    }
                      //  click:method.doEdit(data.name)                            
                }
            },[makeAtag(data.index)]);
        }))
    }
    function shadeDialog(createElement){
        let item= {
            dialogTitle:'插入链接',
            dialogCancel:'x'
        };
        function makeDialog(){
            function title(){
                return createElement('div',{
                    attrs:{
                        class:'dialogHeader'
                    }
                },[createElement('span',{
                    attrs:{
                        id:'linkTitle',
                        class:'dialogTitle'
                    },
                    domProps:{
                        innerHTML:'插入链接'
                    }
                }),createElement('span',{
                    attrs:{
                        id:'imgTitle',
                        class:'dialogTitle'
                    },
                    domProps:{
                        innerHTML:'插入图片'
                    }
                }),createElement('span',{
                    attrs:{
                        id:'dialogCancel'
                    },
                    domProps:{
                        innerHTML:'x'
                    },
                    on:{
                        click:function(){
                            document.querySelector('.newWindow').style.display='none';
                        }
                    }
                })])
            }
            function content(){
                function imgUpload(){
                 return createElement('div',{
                    attrs:{
                        class:'imgUpload'
                    }
                },[createElement('input',{
                   attrs:{
                        type:'text',
                        placeholder:'拖动图片到这里',
                        id:'fakeFile'
                    }                    
                }),createElement('a',{
                   attrs:{
                        href:'javaScript:;'
                    },domProps:{
                            innerHTML:'选择图片'
                        }                    
                }),createElement('input',{
                   attrs:{
                        type:'file',
                        id:'realFile'
                    },
                    on:{
                        change:function(){ 
                            document.querySelector('#fakeFile').value = document.querySelector('#realFile').value    
                        }
                    }                   
                })]);  
                }
                return createElement('div',{
                    attrs:{
                        class:'dialogContent'
                    }
                },[createElement('input',{
                   attrs:{
                        type:'text',
                        placeholder:'请输入链接地址',
                        id:'linkInput'
                    }                    
                }),imgUpload()])
            }
            function footer(){
                let item =['取消','插入'];
                return createElement('div',{
                    attrs:{
                        class:'dialogFooter'
                    }                  
                },[createElement('button',{
                    attrs:{
                        id:'linkCancel'
                    },
                    domProps:{
                        innerHTML:'取消'
                    },                    
                    on:{
                        click:function(){
                            const dialog =document.querySelector('.newWindow');
                            (dialog.classList.length===3)&&(dialog.classList.remove("imgAdd")); 
                            dialog.style.display='none';
                        }
                    }
                }),createElement('button',{
                    attrs:{
                        id:'linkInsert'
                    },
                    domProps:{
                        innerHTML:'插入'
                    },
                    on:{
                        click:function(){
                            const dialog =document.querySelector('.newWindow');
                            let flag =dialog.classList.contains("imgAdd");
                            const linkInput =$('#linkInput');
                            let link =linkInput.value;
                            const act = (_link,_type)=>{
                               if(_link.trim()){
                                    const editor  = $('#text-input');
                                    editorClick(editor,_type,_link);
                                }else{
                                    alert('链接不能为空');
                                    return ;
                                }
                                linkInput.value ='';                                                 
                                (_type.indexOf('image')!==-1)&&(dialog.classList.remove('imgAdd'))
                                dialog.style.display='none';  
                            };
                            /*业务处理*/
                        if(flag){  //图片上传
                        let data =new FormData();
                        data.append('file',$("#realFile").files[0]);
                        vm.uploadImg(data,function(data){
                            $("#realFile").value ='';
                            $("#fakeFile").value ='';
                            act(data,'imagelink');
                        })
                        }
                      (!flag)&&(act(link,'link'))                          
                      }
                    }
                })])
            }                       
            return createElement('div',{
                attrs:{
                    class:'smallDialog'
                }
            },[title(),content(),footer()])
        }
        return createElement('div',{
            attrs:{
                class:'newWindow shadeLayer',
                role:'dialog'
            }
        },[makeDialog()])

    }
    function submitFooter(createElement,content){
        let editFlag = content.index;
        let submitHTML = (editFlag>0) ? '保存编辑' : '发布文章' ;
        return createElement('footer',{
            class:'fixFooter'
        },[createElement('button',{
            attrs:{
            id:'tempButton'
            },
            domProps:{
                innerHTML:'定时发布'
            },
            on:{
                click:function(){
                    vm.tokenTest();
                }
            }

        }),createElement('button',{
            attrs:{
            id:'submitButton'
            },
            domProps:{
                innerHTML:submitHTML
            },
            on:{
                click:function(){
                    let formdata ={
                        title:$("#titleInput"),
                        itemClass:$("#classInput"),
                        item:$("#itemInput"),
                        tags:$("#tagInput"),
                        content:$("#text-input")
                    };
                    /*替换内容中的单引号，双引号，按位与，百分号*/
                    const cdecode =(str)=>{ 
                       // console.log('change');
                        str=str.replace(/['"]/gm,'@gt@');
                        str=str.replace(/&/gm,'@pt@');
                        str= str.replace(/%/gm,'@lt@')  
                        return str;
                    }
                    let urlform =new Array();
                    let check =Object.keys(formdata).every(function(key){
                        if(formdata[key].value.trim() ===''){
                            formdata[key].focus();
                            alert('该项为必填,不能为空');
                            return false;
                        }
                        if(key ==='content'){
                           formdata[key] = cdecode(formdata[key].value);
                           return true;                            
                        }
                        formdata[key] = formdata[key].value;
                        return true; 
                    })
                    if(!check){
                        return ;  
                    }
                    let sendData ='';
                    if(editFlag){
                        formdata.queryId = editFlag;
                        formdata.version = content.version;
                        formdata.flag = 'update';
                    }else{  
                        formdata.flag = 'update';
                    }
                    vm.editContent(formdata);
                }
            }            
        })]);
    }
        return createElement('div',{
            attrs:{
               class:'markdown', 
            }
        },[ makeFormHeader(createElement,content),makeEditor(createElement,content),makeContent(createElement,content),shadeDialog(createElement),submitFooter(createElement,content)])
    }   
    return {
        component:makeDom,
        method:'',
        toOrigin:function(str){
            str =str.replace(/@gt@/gm,"'");
            str =str.replace(/@lt@/gm,"%");
            str = str.replace(/@pt@/gm,'&')
            return str;  //输出一个方法，供markdown转换；
        }  ,
        toPreview:function(str){
            str =str.replace(/@gt@/gm,"'");
            str =str.replace(/@lt@/gm,"%");
            str = str.replace(/@pt@/gm,'&')
            return marked(str);  //输出一个方法，供markdown转换；
        }  
    }    
})