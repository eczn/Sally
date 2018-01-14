<template>
    <el-container>
        <el-header class="admin-header">Sally Admin</el-header>
        <el-container>
            <el-aside width="200px">
                <div class="preview" v-if="selectedList.length !== 0">
                    {{ selectedList[0] }}
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
                        
                        
                        {{ blog.title }}

                        by {{ blog.uname }}
                        
                        
                    </el-checkbox>
                    
                    
                </el-checkbox-group>
            

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
            selectedList: []
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
        this.initAll(); 
    },
    methods: {
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

<style scoped>
.admin-header {
    font-size: 150%; 
    background: #409EFF; 
    color: #FFF; 
    line-height: 60px; 
}

.tools {
    margin-bottom: 1.5em; 
}

.blog {
    display: block; 
    margin: 0; 
}
</style>
