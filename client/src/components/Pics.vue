<template>
    <div class="pics">
        <div class="pics-title">照片墙</div>

        <div class="imgs">
            <li class="img" v-for="(img, idx) in imgs" :key="idx">

                <img :src="img.url">
                <p class="index"><span class="grey">#</span> {{ imgs.length - idx | preFill }}</p>
                <p class="user">By {{ img.uname }}</p>
                <p class="time">上传于 {{ img.created_at | sallyTime }}</p>
            </li>
        </div>

        <div class="no-data" v-if="imgs.length === 0">
            暂无照片喔
        </div>
        <div class="no-data bottom" v-else>
            共计 {{ imgs.length | preFill('000') }} 张照片
        </div>
    </div>
</template>

<script>
import http from '@/utils/http.client'; 

export default {
    name: 'pics',
    data(){
        return {
            imgs: []
        }
    },
    created(){
        this.initImg(); 
    },
    methods: {
        initImg(){
            return http.get('/api/img/all').then(res => {
                this.imgs = res.data; 
            })
        }
    }
}
</script>

<style lang="sass">
.pics 
    max-width: 700px
    margin: 0 auto 

    .pics-title 
        font-size: 36px 
        line-height: 500px

    .imgs 
    
        .img 
            position: relative
            // max-width: 300px
            margin-bottom: 150px
            .user 
                font-size: 24px
            img
                // margin-left: 2em
                max-width: 300px
                border-radius: 6px

            .index 
                position: absolute
                right: 0
                bottom: 2rem
                font-size: 40px
                .grey 
                    color: #BBB

    .no-data 
        font-size: 36px
        color: #BBB
        text-align: right
        &.bottom 
            // text-align: left
            margin: 170px 0 

</style>

