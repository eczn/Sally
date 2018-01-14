<template>
    <div class="detail">
        <div class="blog" v-if="blog">
            {{ blog }}

            <h1>{{ blog.title }}</h1>
        </div>
    </div>
</template>

<script>
import http from '@/utils/http.client'; 

export default {
    name: 'detail', 
    props: {
        bid: {
            type: String, 
            required: true
        }
    },
    data(){
        return {
            blog: null
        }
    }, 
    created(){
        this.init(); 
    },
    methods: {
        init(){
            return http.get('/api/blog/one', {
                bid: this.bid
            }).then(res => {
                let { code, data } = res; 

                this.blog = data.pop(); 
            }); 
        }
    }
}
</script>


<style>

</style>
