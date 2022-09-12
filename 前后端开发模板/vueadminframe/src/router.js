import Vue from 'vue';
import Router from 'vue-router';
import store from "./store";
Vue.use(Router);

let router=new Router({
    mode:"hash", //1、hash哈希：有#号。2、history历史：没有#号
    base:process.env.BASE_URL,
    //记录滚动的位置解决白屏问题，必须配合keep-alive
    scrollBehavior (to, from, savedPosition){
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    },
    routes:[
        {
            path:"/",
            name:"main",
            component:()=>import("./pages/home/index/index")
        }
    ]
});

//将store内部的routes模块下的routesData数据源拼接成一维数组
let oneRoutes=[];
function setOneRoutes(data){
    if(data.length>0){
        for(let i=0;i<data.length;i++){
            //如果有component属性
            if(data[i].component){
                //将component属性的值转成路由懒加载函数，重新赋值给component属性
                let tmpComponent=data[i].component;
                data[i].component=()=>import(`./pages/${tmpComponent}`);
                oneRoutes.push(data[i]);//将路由数据存放到oneRoutes变量中
            }
            //如果存在子数据，递归进行子查询
            if(data[i].children && data[i].children.length>0){
                setOneRoutes(data[i].children)
            }
        }
    }
}
//使用setTimeout模拟异步请求数据
setTimeout(()=>{
    //服务端接口请求的数据源
    let routesData=[
        {
            name:"栏目管理",//路由名称
            path:"column",//路由中的path
            component:"admin/column/index",//路由映射的组件
            meta:{
                auth:true,//会员登录验证标识
                keepAlive:false,//是否开启keep-alive。true:开启，false:关闭
                isActive:false,//点击后的颜色
                isLnkActive:false//点击链接后的颜色
            }
        },
        {
            name:"会员管理",
            meta:{
                auth:true,
                keepAlive:false,
                isActive:false,
                isLnkActive:false,
            },
            children:[
                {
                    name:"查看会员",
                    path:"user",
                    component:"admin/column/index",
                    meta:{
                        auth:false,
                        keepAlive:true,
                        isActive:false,
                        isLnkActive:false
                    }
                },
                {
                    name:"添加会员",
                    path:"add_user",
                    component:"admin/user/add",
                    meta:{
                        auth:true,
                        keepAlive:false,
                        isActive:false,
                        isLnkActive:false
                    }
                }
            ]
        },
        {
            name:"订单管理",
            meta:{
                auth:true,
                keepAlive:false,
                isActive:false,
                isLnkActive:false
            },
            children:[
                {
                    name:"查看订单",
                    path:"order",
                    component:"admin/order/index",
                    meta:{
                        auth:true,
                        keepAlive:false,
                        isActive:false,
                        isLnkActive:false
                    }
                },
            ]
        },
        {
            name:"百度",
            path:"http://www.baidu.com",
            meta:{
                isActive:false,
                isLnkActive:false,
                isLink:true,//是否外链
            }
        }
    ]
    store.dispatch("routes/setRoutes",{routesData:routesData}).then(()=>{
        setOneRoutes(store.state.routes.routesData);
        //使用addRoutes方法，添加动态路由
        router.addRoutes([
            {
                path:"/admin",
                name:"admin",
                component:()=>import("./pages/admin/index/index"),
                redirect:"/admin/column",
                meta:{auth:true},
                children:oneRoutes//将组装好的子路由配置数据赋值给children属性
            }
        ]);
    })
},300)

router.beforeEach((to,from,next)=>{
    if(to.meta.auth){
        if(Boolean(localStorage['isLogin'])){
            next();
        }else{
            next("/");
        }
    }else {
        next();
    }
});

export default router;
