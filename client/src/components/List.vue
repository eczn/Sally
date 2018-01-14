<template>
    <div class="list">
        <router-link class="blog" :to="'/detail/' + blog.bid" v-for="(blog, idx) in list" :key="idx">
            <div class="title">{{ blog.title }}</div>
            <div class="created_at">{{ blog.created_at }}</div>
            <div class="intro">{{ blog.content.slice(0, 10) }} ...</div>
            <div class="cate">{{ blog.cname }}</div>
            <div class="user">
                {{ blog.uname }}
                {{ blog.avatar }}
            </div>
        </router-link>

        <div class="block">
            <el-pagination
                background
                layout="prev, pager, next"
                :size="param.N"
                :page-count="PAGE_COUNT"
                @current-change="pageChange"
            >
            </el-pagination>
        </div>

        <router-link to="/admin">Admin</router-link>
    </div>
</template>

<script>
import http from '@/utils/http.client'; 

export default {
    name: 'list', 
    data(){
        return {
            param: {
                p: 0, 
                N: 5
            },
            list: [],
            count: 0,
            user: null
        }
    }, 
    computed: {
        ALL_PAGE(){
            let pages = Math.ceil(this.count / this.param.N);
            
            return new Array(pages).fill(0).map((_, idx) => idx + 1); 
        },
        PAGE_COUNT(){
            // return this.count % this.param.N === 0 ? 
            //     this.count / this.param.N : 
            return Math.ceil(this.count / this.param.N); 
        }
    },
    created(){
        this.listing(); 
        this.initPage();
        this.userInit(); 
    },
    methods: {
        userInit(){
            return http.get('/api/user/me').then(res => {
                let { code, data } = res; 

                if (code === 2000) this.user = data; 
            })
        }, 
        initPage(){
            return http.get('/api/blog/count').then(res => {
                let { code, data } = res; 

                this.count = data; 
            }); 
        }, 
        pageChange(e){
            let next = e - 1; 
            this.param.p = next; 

            this.listing(); 
        },
        listing(){
            return http.get('/api/blog', this.param).then(res => {
                let { code, data } = res; 

                this.list = data; 
            }); 
        }
    }
}
</script>

<style scoped>
.list {
    max-width: 700px;
    margin: 0 auto; 
}

.blog {
    display: block; 
    margin-bottom: 3em; 
}
</style>

