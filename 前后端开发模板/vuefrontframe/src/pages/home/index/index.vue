<template>
    <div class="page">
        首页<br>
        <button type="button" @click="goPage('/news')">新闻页面</button>
    </div>
</template>

<script>
    export default {
        methods:{
            goPage(url){
                this.$router.push(url);
            }
        },
        created(){
            console.log(this.$config.baseApi)
        }
    }
</script>

<style scoped>
    .page{width:100%;min-height:91vh;}
</style>
