import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

let router=new Router({
    mode:"hash", //1、hash哈希：有#号。2、history历史：没有#号
    base:process.env.BASE_URL,
    //记录滚动的位置解决白屏问题，必须配合keep-alive
    scrollBehavior(to,from,position){
        if(position){
            return position
        }else{
            return {x:0,y:0}
        }
    },
    routes:[
        {
            path:"/",
            name:"main",
            component:()=>import("./pages/home/main/index"),
            redirect:"/index",
            children:[
                {
                    path:"index",
                    name:"index",
                    component:()=>import("./pages/home/index/index"),
                    meta:{title:"首页",keepAlive:true}
                },
                {
                    path:"cart",
                    name:"cart",
                    component:()=>import("./pages/home/cart/index"),
                    meta:{title:"购物车",keepAlive:false}
                },
                {
                    path:"my",
                    name:"my",
                    component:()=>import("./pages/user/ucenter/index"),
                    meta:{title:"会员中心",keepAlive:false}
                }
            ]
        },
        {
            path:"/news",
            name:"news",
            component:()=>import("./pages/home/news/index"),
            meta:{title:"新闻",keepAlive:false}
        }
    ]
});

router.beforeEach((to,from,next)=>{
    if(to.meta.auth){
        if(Boolean(localStorage['isLogin'])){
            next();
        }else{
            next("/login");
        }
    }else {
        next();
    }
});

export default router;
