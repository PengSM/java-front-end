<template>
    <div><button type="button" @click="goBack()">返回</button>新闻页面</div>
</template>

<script>
    export default {
       methods:{
           goBack(){
               this.$router.go(-1);
           }
       },
        mounted(){
            document.title=this.$route.meta.title
        }
    }
</script>

<style scoped>

</style>
