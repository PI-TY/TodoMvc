(function(window){
    'use strict';
    // 里面的变量都是局部变量,除非绑定在window上
    // 书写本地存储的存取方法
    window.storage = {
        getStorage(){
            // 获取本地存储,并转换成json对象
            return JSON.parse(window.localStorage.getItem('u')||'[]');
        },
        setStorage(json){
            // 把传入的json对象转成json字符串,存入本地存储
            window.localStorage.setItem('u',JSON.stringify(json));
        }
    }

    window.app = new Vue({
        el:'.todoapp',
        data:{
            tasks:window.storage.getStorage(),
            newTask:'',
            isEditing:-1,
            status:true,
            count:0,
            flag:location.hash == "#/active"?({completed:false}):
            (location.hash=="#/completed"?({completed:true}):)
        },
        computed:{
            activeNum(){
                this.count = 0;
                this.tasks.forEach((task)=>{
                    if(!task.completed){
                        this.count++;
                    }
                })
                return this.count;
            },
            isShow(){
                for(var i = 0 ; i < this.tasks.length ; i++){
                    if(this.tasks[i].completed){
                        return true;
                    }
                }
                return false;
            }
        },
            
        directives:{
            "focus":function(el,binding){
                if(binding.value){
                    el.focus()
                }
            }
        },
        //     focus:{
        //         inserted:function(el,binding){
        //             if(binding.value){
        //                 el.focus()
        //             }
        //         }
        //     }
        // },
        methods:{
            // dd(id,e){
            //     this.isEditing = id;
            //     console.log(e.target.parentNode.parentNode.children[1].focus)

            // },
            show(i){
                if(this.flag===''){
                    return true;
                }else if(this.flag.completed===i){
                    console.log(this.flag.completed)
                    return true;
                }
            },
            clearAll(){
                this.tasks = this.tasks.filter(task=>!task.completed)
            },
            toggleAll(){
                this.tasks.forEach((task)=>{
                    task.completed = this.status
                });
                this.status = !this.status;
                // 同步到本地存储中
                window.storage.setStorage(this.tasks);
            },
            remove(id){
                this.tasks = this.tasks.filter(task=>{
                    return task.id!=id;
                })
                // 同步到本地存储中
                window.storage.setStorage(this.tasks);
            },
            add(){
                var task = {
                    title:this.newTask,
                    completed:false,
                    id:Date.now()
                };
                this.tasks.push(task);
                // 输入完成后,清空文本框
                this.newTask = ""
                // 同步到本地存储中
             window.storage.setStorage(this.tasks);
            }
        }
    });
    // vue实例外面添加hash变化监听
    window.onhashchange = function(){
        console.log(location.hash);
        // 专门在vue实例里面声明一个变量由于标识当前是在哪个路由
        if(location.hash == '#/active'){
            window.app.flag = {completed:false};
            //completed就是要显示已完成任务,flag最好有意义
            return;
        }else if(location.hash=="#/completed"){
            window.app.flag = {completed:true};
            return;
        }else{
            // 如果是其他路由,都显示全部任务
            window.app.flag = '';
            return;
        }
    }
})(window);
