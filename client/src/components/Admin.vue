<template>
    <el-container class="admin">
        <el-header class="admin-header">Sally Admin</el-header>
        <el-container>
            <el-aside width="200px">
                <div class="preview" v-if="SELECTED">
                    <div class="title">
                        <span grey>[标题]</span>
                        {{ SELECTED.title }}
                    </div>
                    <div class="title">
                        <span grey>[字数]</span>
                        {{ SELECTED.content.length }}
                    </div>
                    <div class="uname">
                        <span grey>[作者]</span>
                        {{ SELECTED.uname }}
                    </div>
                    <div class="cname">
                        <span grey>[分类]</span>
                        {{ SELECTED.cname }}
                    </div>
                    <div class="time">
                        <span grey>[创建于]</span>
                        {{ SELECTED.created_at | sallyTime }}
                    </div>
                </div>
            </el-aside>
            <el-main>
                <div class="tools">
                    <el-button @click="add">新建</el-button>
                    <el-button type="primary" @click="edit">编辑</el-button>
                    <el-button type="danger" @click="rm">删除</el-button>                        
                </div>
                
                <el-checkbox-group v-model="selectedList" :max="1">
                    <el-checkbox class="blog" :label="blog"
                        v-for="(blog, idx) in list" :key="idx"
                    >
                        <h1>{{ blog.title }}</h1>
                        <span class="who">
                            <span grey>by</span>
                            {{ blog.uname }}
                            <span grey>
                                | {{ blog.cname }} @ {{ blog.created_at | sallyDate }}
                            </span>
                        </span>
                    </el-checkbox>  
                </el-checkbox-group>
            
                <div class="pagination">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :size="param.N"
                        :page-count="PAGE_COUNT"
                        @current-change="pageChange"
                    >
                    </el-pagination>
                </div>

                <el-footer>
                    <h1>共计</h1>
                    <p>
                        <span bigger>{{ COUNTER.Blogs | preFill('00') }}</span> 篇博文
                    </p>
                    <p>
                        <span bigger>{{ COUNTER.Users | preFill('00') }}</span> 只用户
                    </p>
                    <p>
                        <span bigger>{{ COUNTER.Cates | preFill('00') }}</span> 个分类
                    </p>
                    <p>
                        <span bigger>{{ COUNTER.Comments | preFill('00') }}</span> 条评论
                    </p>
                    <p>
                        <span bigger>{{ COUNTER.Images | preFill('00') }}</span> 张图片
                    </p>
                </el-footer>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import http from '@/utils/http.client'; 

export default {
    name: 'Admin', 
    data(){
        return {
            param: {
                p: 0, 
                N: 8
            },
            list: [],
            count: 0,
            user: null,
            selectedList: [],
            COUNTER: {}
        }
    }, 
    computed: {
        SELECTED(){
            return this.selectedList[0] || null; 
        },
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
        this.initAll(); 
        this.countAll(); 
    },
    methods: {
        countAll(){
            return http.get('/api/sys/count-all').then(res => {
                let { code, data } = res; 

                this.COUNTER = data; 
            })
        },
        initAll(){
            return Promise.all([
                this.listing(),
                this.initPage(),
                this.userInit()
            ]); 
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
        pageChange(e){
            let next = e - 1; 
            this.param.p = next; 

            this.listing(); 
        },
        listing(){
            return http.get('/api/blog', this.param).then(res => {
                this.selectedList.pop(); 
                let { code, data } = res; 

                this.list = data; 
            }); 
        },
        edit(){
            let target_blog = this.selectedList[0]; 

            if (!target_blog) return this.$message({
                type: 'warning',
                message: '请选择后继续'
            });

            this.$router.push({
                // params: target_blog,
                query: {
                    bid: target_blog.bid
                },
                name: 'Edit'
            }); 
        }, 
        add(){
            this.$router.push({
                path: '/edit'
            }); 
        },
        rm(){
            let target_blog = this.selectedList[0]; 

            if (!target_blog) return this.$message({
                type: 'warning',
                message: '请选择后继续'
            });

            return this.$confirm('此操作将永久删除该博客, 是否继续 ?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                return http.post('/api/blog/del', {
                    bid: target_blog.bid
                }).then(res => {
                    
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });

                    this.selectedList.pop(); 

                    return this.initAll(); 
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });
            });
        }
    }
}
</script>

<style lang="sass">

.admin 
    [grey]
        color: #BBB

    .admin-header 
        font-size: 150%
        background: #409EFF
        color: #FFF
        line-height: 60px
    
    .tools 
        margin-bottom: 1em
    
    .blog 
        padding: 1em 0
        display: block
        margin: 0
    
    .blog .el-checkbox__label, .blog .el-checkbox__input 
        vertical-align: middle
        display: inline-block

    h1 
        font-size: 150%
        font-weight: normal
        line-height: 1.7

    .pagination 
        margin: 1.5em 0

    .preview 
        [grey]
            text-align: left
            display: block
        > * 
            margin-bottom: .5em
            margin-left: .25em

    .el-footer 
        width: 500px 
        position: relative
        padding-left: 100px

        * 
            vertical-align: middle

        [bigger]
            color: #555
            font-size: 28px
        h1 
            color: #888
            position: absolute 
            text-align: center
            left: 0
            width: 100px
            top: 0%
        p 
            color: #888
            display: inline-block
            width: 25%
            font-size: 12px 
            margin-bottom: 1em
</style>
