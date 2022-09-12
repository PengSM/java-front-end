<template>
    <div>
        <div :class="{left:true,slide:!isLeftShow}">
            <div class="logo">后台管理</div>
            <div class="column-wrap">
                <!--
                左侧栏目组件
                routes:左侧栏目数据源，数据结构和路由配置一样
                goPage:单击左侧栏目跳转的页面
                getColumnName:记录单击哪个栏目并改变单击后的样式
                -->
                <LeftColumn :routes="routesData" @goPage="goPage($event)" @getColumnName="getColumnName($event)"></LeftColumn>
            </div>
        </div>
        <div :class="{main:true,full:!isLeftShow}">
            <div class="header">
                <div :class="{'slider-icon':true,rotate:!isLeftShow}" @click="changeLeft()">
                    <div class="line"></div>
                </div>
                <div class="nav-position">
                    首页 {{positionName}}
                </div>
                <div class="out-login" @click="outLogin()">安全退出</div>
            </div>
            <div class="nav" v-if="tags.length>1">
                <!--选项卡左移-->
                <div class="arrow" @click="moveLeft()">&lt;</div>
                <div class="tags" ref="tags">
                    <div class="tags-data" ref="tags-data" :style="{left:moveVal+'px'}">
                        <!--选项卡数据-->
                        <div v-for="(item,index) in tags" :key="index" :class="{item:true ,active:item.meta.isLnkActive}" @click="goTabgsPage(item.path,index)">{{item.name}}<div class="close"  v-show="index>0" @click.stop="closeTags(index)">X</div></div>
                    </div>
                </div>
                <!--选项卡右移-->
                <div class="arrow" @click="moveRight()">&gt;</div>
            </div>
            <div style="width:100%;height:87vh;overflow:hidden;">
                <keep-alive>
                    <router-view v-if="$route.meta.keepAlive"></router-view>
                </keep-alive>
                    <router-view v-if="!$route.meta.keepAlive"></router-view>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    //导入左侧栏目组件
    import LeftColumn from '../../../components/leftcolumn';
    export default {
        data(){
            return {
               isLeftShow:true,//是否显示左侧栏目。true：是，false：否
                positionName:"",//位置名称
                //右侧上面选项卡
                tags:[
                    {
                        name:"首页",
                        path:"/admin/column",
                        meta:{
                            auth:true,//是否需要会员认证
                            keepAlive:false,//是否启用keep-alive
                            isLnkActive:true//如果是当前页，改变字体颜色
                        }
                    }
                ],
                moveVal:0//记录选项卡移动的位置
            }
        },
        components:{
            LeftColumn//左侧栏目组件
        },
        computed:{
            ...mapState({
                //左侧栏目数据源
                routesData:state=>state.routes.routesData
            })
        },
        created(){
            //刷新页面后，改变左侧栏目的样式
            this.changeColumnPathStyle(this.$route.path);
        },
        beforeRouteUpdate(to, from, next){
            let path=to.path?to.path.replace(/\/admin\//,''):"";
            this.clearColumnStyle();
            //改变左侧栏目的样式
            this.changeColumnPathStyle(path);
            next();
        },
        methods:{
            goPage(data){
                if(data.meta.isLink){//如果是外链
                    //跳转到新窗口
                    window.open(data.path,'_blank');
                }else {
                    this.$router.replace(data.path);
                }
            },
            getColumnName(name){
                this.changeColumnStyle(name)
            },
            //递归改变左侧栏目的样式
            changeColumnPathStyle(path,parentData,data){
                data=data || this.routesData;
                if(data && data.length>0){
                    for(let i=0;i<data.length;i++){
                        //如果是当前页面
                        if(data[i].path==path){
                            //如果没有子数据
                            if(!data[i].children || data[i].children.length<=0){
                                this.positionName="";
                                //改变当前栏目的样式
                                data[i].meta.isLnkActive=true;
                                if(parentData) {
                                    //改变父级数据的样式
                                    parentData.meta.isActive=true;
                                    //拼接当前的位置
                                    this.positionName +=" / "+ parentData.name + " / " + data[i].name;
                                }else{
                                    this.positionName=" / "+data[i].name;
                                }
                                //添加右侧上面选项卡的数据
                                this.addTags({
                                    name:data[i].name,
                                    path:data[i].path,
                                    meta:{
                                        isLnkActive:data[i].meta.isLnkActive
                                    }
                                })
                            }
                            break;
                        }
                        //如果有子数据
                        if(data[i].children && data[i].children.length>0){
                            //调用自己实现递归
                            this.changeColumnPathStyle(path,data[i],data[i].children);
                        }
                    }
                }

            },
            //添加tags数据
            addTags(data){
                let isSame=false;
                if(this.tags.length>0){
                    //将选项卡的字体样式设置初始化
                    for(let key in this.tags){
                        if(this.tags[key].meta.isLnkActive){
                            this.tags[key].meta.isLnkActive=false;
                        }
                    }
                    for(let key in this.tags){
                        //选项卡里面的path，和源数据this.routesData内部的path做比较，如果相同
                        if(this.tags[key].path===data.path){
                            isSame=true;//表示tags数组里面存着该path
                            this.tags[key].meta.isLnkActive=true;//改变tags字体样式
                            break;
                        }
                    }
                }
                if(!isSame){//如果不存在数据源this.routesData的数据，添加this.routesData内部的一行数据
                    this.tags.push(data)
                }
            },
            //关闭右侧上面的选项卡
            closeTags(index){
                let prevPath=this.tags[index-1].path;//获取上一个选项卡的path
                this.tags[index-1].meta.isLnkActive=true;//改变上一个选项卡的样式
                this.$set(this.tags,index-1,this.tags[index-1]);//解决视图不及时更新的问题
                this.clearColumnStyle();//清除左侧栏目的样式
                this.changeColumnPathStyle(prevPath);//改变上一个选项卡对应的左侧栏目的样式
                this.$router.replace(prevPath);//跳转到上一个选项卡页面
                this.tags.splice(index,1);//删除当前选项卡
            },
            //点击选项卡切换页面
            goTabgsPage(path,index){
                this.clearColumnStyle();//清除左侧栏目的样式
                this.changeColumnPathStyle(path);//改变上一个选项卡对应的左侧栏目的样式
                if(this.tags.length>0){
                    for(let key in this.tags){
                        if(this.tags[key].meta.isLnkActive){
                            this.tags[key].meta.isLnkActive=false;
                            break;
                        }
                    }
                }
                this.tags[index].meta.isLnkActive=true;
                this.$set(this.tags,index,this.tags[index]);
                this.$router.replace(path);
            },
            //递归清除左侧栏目单击后的样式
            clearColumnStyle(data){
                data=data || this.routesData;
                for(let i=0;i<data.length;i++){
                    if(data[i].meta.isLnkActive==true){
                        data[i].meta.isLnkActive=false;
                        break;
                    }
                    if(data[i].children && data[i].children.length>0){
                        this.clearColumnStyle(data[i].children);
                    }
                }
            },
            //单击左侧栏目改变样式
            changeColumnStyle(name,parentName,data){
                data=data || this.routesData;
                if(data.length>0){
                    this.clearColumnStyle();
                        for(let i=0;i<data.length;i++){
                            if(data[i].name==name){
                                data[i].meta.isActive=!data[i].meta.isActive;
                                break;
                            }
                            //如果有子数据
                            if(data[i].children && data[i].children.length>0){
                                //递归查找改变样式
                                this.changeColumnStyle(name,data[i].name,data[i].children);
                            }
                        }
                }
            },
            //安全退出
            outLogin(){
                this.$store.commit("admin/OUT_LOGIN");
                this.$router.replace("/");
            },
            //隐藏/显示左侧栏目
            changeLeft(){
                this.isLeftShow=!this.isLeftShow;
            },
            //单击右侧上面选项卡右箭头调用的方法
            moveRight(){
                let tags=this.$refs['tags'];
                let tagsData=this.$refs['tags-data'];
                let offsetVal=Math.abs(parseInt(tagsData.style.left));
                if(tagsData.offsetWidth>tags.offsetWidth && offsetVal<tags.offsetWidth){
                    //选项卡右移
                    this.moveVal+=-300;
                }
            },
            //单击右侧上面选项卡左侧箭头调用的方法
            moveLeft(){
                let tagsData=this.$refs['tags-data'];
                let offsetVal=parseInt(tagsData.style.left);
                if(offsetVal<0){
                    //选项卡左移
                    this.moveVal-=-300;
                }
            }
        }
    }
</script>

<style scoped>
    .left{width:270px;min-height:100%;position: fixed;z-index: 1;left:0;top:0;background-color:#001529;overflow: auto;transition: width .3s;}
    .left.slide{width:0px;}
    .left .logo{width:60%;height:40px;margin:0 auto;background-color:#2d8cf0;margin-top:20px;border-radius: 5px;font-size:18px;color:#FFFFFF;line-height:40px;text-align:center;font-weight: bold;}
    .left .column-wrap{width:100%;}

    .main{width:auto;min-height:100vh;overflow-y: auto;margin-left:270px;}
    .main.full{width:100%;margin-left:0px;}
    .main .header{width:auto;height:60px;display:flex;align-items: center;padding-left:50px;position: relative;z-index:1;}
    .main .slider-icon{width:30px;height:auto;cursor:pointer;transition: transform 1s;}
    .main .slider-icon.rotate{transform: rotate(90deg);}
    .main .slider-icon .line{width:100%;height:4px;background-color:#5C6B77;margin-bottom:5px;}
    .main .slider-icon:before{width:100%;height:4px;background-color:#5C6B77;content:'';display:block;margin-bottom:5px;}
    .main .slider-icon:after{width:100%;height:4px;background-color:#5C6B77;content:'';display:block;}
    .main .header .nav-position{margin-left:20px;font-size:16px;}
    .main .out-login{width:auto;height:auto;position: absolute;right:40px;top:25px;cursor: pointer}

    .main .nav{width:100%;height:50px;background-color:#F0F0F0;display:flex;}
    .main .nav .arrow{width:30px;height:100%;background-color:#FFFFFF;font-size:20px;text-align:center;line-height:50px;cursor:pointer;}
    .main .nav .tags{width:auto;height:100%;flex:1;position: relative;z-index:1;overflow:hidden;}
    .main .nav .tags .item{width:auto;height:auto;background-color:#FFFFFF;font-size:16px;padding:8px 20px;margin-top:6px;margin-left:5px;margin-right:5px;position:relative;z-index:1;cursor:pointer;}
    .main .nav .tags .item.active{color:#2d8cf0}
    .main .nav .tags .item .close{width:auto;height:auto;position: absolute;right:5px;top:5px;z-index:1;font-size:12px;}
    .main .nav .tags .tags-data{width:auto;height:100%;position: absolute;z-index:1;left:0;top:0;display:-webkit-box;transition: left 1s;}
</style>
