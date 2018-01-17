<template>
    <div>
        <header>
            <div class="header-inner">
                <div class="to-admin" @click="gotoAdmin"></div>
                <!-- <div class="to-admin"></div> -->
                Sally Blog

                <div class="user-info" v-if="user" @click="toMyInfo">
                    <span class="user-avatar" :style="{
                        backgroundImage: `url(${user.avatar})`
                    }"></span>
                </div>
                <div class="user-info" v-else @click="toLogin">
                    <span class="user-avatar" :style="{
                        backgroundColor: '#BBB'
                    }"></span>
                </div>
            </div>
        </header>


        <div class="list">
            <div class="cates">
                <h2>分类</h2>
                <el-button v-for="(cate, idx) in cates" :key="idx"
                    @click="chooseCate(cate)">
                    {{ cate.cname }}
                </el-button>
                <el-button
                    @click="$router.push('/list')">
                    返回首页
                </el-button>
            </div>

            <div class="no-cate-selected" v-if="!selectedCate">
                选择分类进行查询
            </div>
            <div class="cate-intro" v-else>
                <p class="i-came">{{ selectedCate.cname }}</p>
                <p class="i-cintro">{{ selectedCate.intro }}</p>
                <p class="i-uname">由
                    <span
                        style="color: #409EFF; text-decoration: underline; cursor: pointer;"
                        @click="$router.push('/user/' + selectedCate.uid)"
                    >{{ selectedCate.uname }}</span>
                创建，于 {{ selectedCate.created_at | sallyTime }}</p>
            </div>

            <div class="blogs-inner">
                <div @click="toDetail(blog)" class="blog"
                    v-for="(blog, idx) in list" :key="idx"
                    v-if="selectedCate">

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
            </div>

            <div class="middle-text" v-if="selectedCate">共计 {{ list.length }} 篇</div>
        </div>

    </div>
</template>

<script>
import http from '@/utils/http.client'; 

export default {
    name: 'cates', 
    data(){
        return {
            param: {
                p: 0, 
                N: 5
            },
            list: [],
            count: 0,
            cates: [], 
            user: null,
            selectedCate: null
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

        this.userInit();
        this.catesInit();
    },
    methods: {
        toLogin(){
            this.$router.push({
                path: '/login', 
                query: {
                    back: '/list'
                }
            }); 
        },
        catesInit(){
            return http.get('/api/cate').then(res => {
                this.cates = res.data; 
            })
        },
        toMyInfo(){
            this.$router.push({
                path: '/user/' + this.user.uid
            }); 
        },
        chooseCate(cate){
            let { cname } = cate; 

            this.selectedCate = cate;

            return this.listing(); 
        },
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
        listing(){
            return http.get('/api/blog/by-cate', this.selectedCate).then(res => {
                let { code, data } = res; 

                this.list = data; 
            }); 
        },
        toDetail(blog){
            // :to="'/detail/' + blog.bid"
            this.$router.push({
                path: '/detail/' + blog.bid
            }); 
        },
        gotoAdmin(){
            if (this.user.role === 0) {
                this.$router.push('/admin'); 
            } else {
                this.$message({
                    type: 'warning',
                    message: '只有管理员才能进入管理页喔'
                }); 
            }
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
    position: relative;
    font-size: 24px;
    line-height: 80px; 
    max-width: 700px;
    margin: 0 auto; 
}

.to-admin {
    cursor: pointer;
    position: absolute;
    left: -2em;
    width: 1em;
    height: 1em;
    border-radius: 1em; 
    background-color: #FEFEFE; 
    box-shadow: 4px 4px 0 #BBB;
    top: 50%; 
    transform: translateY(-60%);
    margin: 0;
    transition: all .3s; 
}

.to-admin:hover {
    /* background-color: rgba(64, 158, 255, 1); */
    background-color: #BBB;
    box-shadow: -0px -0px 0 rgba(64, 158, 255, .2);
}

.user-info {
    cursor: pointer;
    position: absolute; 
    display: flex; 
    align-items: center;
    right: 0;
    top: 0;
    height: 100%;
}

.user-avatar {
    display: inline-block;
    width: 2em;
    height: 2em; 
    margin-top: -.2em;
    background-size: cover;
    border-radius: 4px;
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
    /* margin-left: -16px;
    margin-top: .5em;
    margin-bottom: .8em; 
    text-shadow: 44px  12px 0 rgba(0, 0, 0, .1),
                 16px -6px 0 rgba(0, 0, 0, .05);
    */
    color: #222; 
}
.blog:hover .top-line,
.blog:hover .intro {
    margin-left: 10px;
}
.blog:hover .cate {
    margin-left: 16px;
}

.bottom-btn {
    margin: 4em 0; 
}

.cates {
    margin-bottom: 20px; 
    text-align: right;
}

.cates h2 {
    font-weight: normal; 
    margin-bottom: 20px; 
}

.no-cate-selected {
    font-size: 24px;
    text-align: center; 
    margin: 4em 0;
    color: #BBB; 
}

.cate-intro {
    margin-bottom: 1.5em; 
}

.i-came {
    font-size: 36px; 
}

.blogs-inner {
    padding-left: 2em; 
}
</style>

