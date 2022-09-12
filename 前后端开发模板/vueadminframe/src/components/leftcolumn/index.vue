<template>
    <div>
        <template v-for="(item,index) in routes">
            <div :style="level>0?'padding-left:'+level*60+'px':''" :class="{'column-name':true,active:item.meta.isActive,'lnk-active':item.meta.isLnkActive}"  :key="index" @click="item.path?goPage({path:item.path,name:item.name,meta:{isLink:item.meta.isLink}}):getColumnName(item.name)">
                <span>{{item.name}}</span>
                <div class="icon arrow" v-if="item.children && item.children.length>0"></div>
            </div>
            <div class="next-wrap" v-if="item.children && item.children.length>0">
                <!--如果routes数据中的children属性存在值，递归执行-->
                <left-column v-if="item.children && item.children.length>0" :routes="item.children" :level="level+1" @goPage="goPage($event)" @getColumnName="getColumnName($event)"></left-column>
            </div>
        </template>
    </div>
</template>

<script>
    export default {
        name:"LeftColumn",
        props:{
            routes:{
                type:Array,
                required:true
            },
            level:{
                type:Number,
                default:0
            }
        },
        methods:{
            goPage(data){
                //向父组件传值
                this.$emit("goPage",data);
            },
            getColumnName(data){
                //向父组件传值
                this.$emit("getColumnName",data);
            }
        }
    }
</script>

<style scoped>
    .left .column-name{color:#AFB5BC;font-size:16px;width:auto;box-sizing: border-box;margin-top:10px;padding-left:30px;display:flex;justify-content: space-between;align-items: center;padding-right:30px;cursor: pointer;height:40px;white-space: nowrap;}
    .left .column-name.active{color:#FFFFFF;}
    .left .column-name.active .icon.arrow{background-image:url("../../assets/images/admin/index/up-arrow.png");background-size:100%;background-repeat: no-repeat;background-position: center;}
    .left .column-name .icon{width:20px;height:20px;}
    .left .column-name.lnk-active{background-color:#2d8cf0;width:100%;height:40px;color:#FFFFFF;box-sizing: border-box;}
    .left .icon.arrow{background-image:url("../../assets/images/admin/index/down-arrow.png");background-size:100%;background-repeat: no-repeat;background-position: center;}
    .left .next-wrap{width:auto;display:none;background-color:#000000;}
    .left .column-name.active+.next-wrap{display:block;}
</style>
