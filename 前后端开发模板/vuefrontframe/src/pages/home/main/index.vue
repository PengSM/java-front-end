<template>
    <div>
        <router-view></router-view>
        <div class="bottom-wrap">
            <div class="bottom-nav">
                <ul :class="{active:homeActive}" @click="goPage('/index')">
                    <li class="home"></li>
                    <li>首页</li>
                </ul>
                <ul :class="{active:cartActive}" @click="goPage('/cart')">
                    <li class="cart"></li>
                    <li>购物车</li>
                </ul>
                <ul :class="{active:myActive}" @click="goPage('/my')">
                    <li class="my"></li>
                    <li>我的</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                homeActive:false,//底部导航首页样式
                cartActive:false,//底部导航购物车样式
                myActive:false//底部导航我的样式
            }
        },
        methods:{
            goPage(url){
                //子路由跳转不需要进入到历史记录,所以使用replace进行路由跳转
                this.$router.replace(url);
            },
            //改变底部导航的样式函数
            changeNavStyle(name){
                //根据文件router.js文件中路由配置选项routes内部name属性值判断跳转到的当前页面，改变底部导航样式
                switch (name) {
                    case "index":
                            this.homeActive=true;
                            this.cartActive=false;
                            this.myActive=false;
                        break;
                    case "cart":
                            this.homeActive=false;
                            this.cartActive=true;
                            this.myActive=false;
                        break;
                    case "my":
                            this.homeActive=false;
                            this.cartActive=false;
                            this.myActive=true;
                        break;
                    default:
                        this.homeActive=true;
                        this.cartActive=false;
                        this.myActive=false;
                }
            }
        },
        created(){
            /*
               使用this.$route.name获取当前页面的路由，改变底部导航的样式，解决刷新页面不改变样式的问题
             */
            this.changeNavStyle(this.$route.name);
        },
        //使用组件内的守卫监听路由的变化
        beforeRouteUpdate(to,from,next){
            //改变底部导航的样式
            this.changeNavStyle(to.name);
            next();
        },
        //由于配置了keep-alive缓存，需要将动态改变的数据存放到activited钩子函数中，消除keep-alive数据缓存
        activated(){
            //动态设置页面的标题
            document.title=this.$route.meta.title;
            this.changeNavStyle(this.$route.name);
        }
    }
</script>

<style scoped>
    .bottom-wrap{width:100%;height:1.2rem;}
    .bottom-nav{width:100%;height:1.2rem;border-top:#EFEFEF 1px solid;background-color:#FFFFFF;position: fixed;bottom:0;left:0;z-index:10;display:flex;justify-content: space-between;align-items: center;padding-left:10%;padding-right:10%;box-sizing: border-box;}
    .bottom-nav ul{width:0.9rem;}
    .bottom-nav ul li:nth-child(1){width:0.6rem;height:0.6rem;margin:0 auto;}
    .bottom-nav ul li:nth-child(1).home{background-image:url("../../../assets/images/common/home1.png");background-size:100%;background-position: center;background-repeat: no-repeat;}
    .bottom-nav ul li:nth-child(2){font-size:0.28rem;text-align:center;color:#000000;width:100%;}
    .bottom-nav ul.active li:nth-child(1).home{background-image:url("../../../assets/images/common/home2.png");background-size:100%;background-position: center;background-repeat: no-repeat;}
    .bottom-nav ul.active li:nth-child(2){color:#eb1625}

    .bottom-nav ul li:nth-child(1).cart{background-image:url("../../../assets/images/common/cart1.png");background-size:100%;background-position: center;background-repeat: no-repeat;}
    .bottom-nav ul.active li:nth-child(1).cart{background-image:url("../../../assets/images/common/cart2.png");background-size:100%;background-position: center;background-repeat: no-repeat;}

    .bottom-nav ul li:nth-child(1).my{background-image:url("../../../assets/images/common/my1.png");background-size:100%;background-position: center;background-repeat: no-repeat;}
    .bottom-nav ul.active li:nth-child(1).my{background-image:url("../../../assets/images/common/my2.png");background-size:100%;background-position: center;background-repeat: no-repeat;}
</style>
