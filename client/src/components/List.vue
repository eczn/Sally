<template>
    <div>
        <header>
            <div class="header-inner">Sally</div>
        </header>


        <div class="list">
            <div @click="toDetail(blog)" class="blog"
                v-for="(blog, idx) in list" :key="idx">

                <div class="line top-line">
                    <div class="created_at">
                        <img src="../assets/icons/date.svg" class="blog-icon">
                        <span>{{ blog.created_at | sallyDate }}</span>
                    </div>

                    <div class="tags">
                        <img src="../assets/icons/tag.svg" class="blog-icon">
                        <span>Sally</span>
                    </div>
                </div>
                <div class="title">{{ blog.title }}</div>
                <div class="intro">{{ blog.md_src.slice(0, 20) }} ...</div>

                <div class="line">
                    <div class="cate">分类于{{ blog.cname }}, @{{ blog.uname }}</div>
                </div>
            </div>

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
        },
        toDetail(blog){
            // :to="'/detail/' + blog.bid"
            this.$router.push({
                path: '/detail/' + blog.bid
            }); 
        }
    }
}
</script>

<style scoped>

header {
    border-bottom: 1px solid #DDD; 
    margin-bottom: 20px; 
}

.header-inner {
    font-size: 24px;
    line-height: 80px; 
    max-width: 700px;
    margin: 0 auto; 
}

.list {
    max-width: 700px;
    margin: 0 auto; 
}

.blog {
    display: block; 
    cursor: pointer;
    margin-bottom: 3em; 
}

.blog .title {
    margin: .3em 0;
    transition: all .3s; 
    font-size: 160%; 
}

.blog .intro {
    opacity: .7;
    transition: all .3s; 
    margin-bottom: .5em; 
}

.blog .tags {
    opacity: .6;
    transition: all .3s; 
}

.blog .line {
    vertical-align: middle;
    font-size: 80%;
    transition: all .3s; 
    margin-bottom: .5em;
}

.blog .created_at {
    opacity: .6;
    transition: all .3s; 
    display: inline-block;
}

.blog > * > * {
    display: inline-block;
    vertical-align: middle;
}

.blog .cate {
    color: rgb(64, 158, 255);
    opacity: .6;
    transition: all .3s; 
}

.blog:hover .tags,
.blog:hover .created_at,
.blog:hover .cate,
.blog:hover .intro {
    opacity: 1;
}
.blog:hover .title {
    margin-left: -16px;
    margin-top: .5em;
    margin-bottom: .8em; 
    text-shadow: 44px  12px 0 rgba(0, 0, 0, .1),
                 16px -6px 0 rgba(0, 0, 0, .05);
    color: #222;
}
.blog:hover .top-line,
.blog:hover .intro {
    margin-left: 6px;
}
.blog:hover .cate {
    margin-left: 14px;
}
</style>

