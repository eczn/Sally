<template>
    <el-container class="admin">
        <el-header class="admin-header" :class="{
            'err-header': err
        }">Sally Admin</el-header>
        <el-container v-if="!err">
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

                <div class="no-data" v-if="list.length === 0">
                    目前暂无数据
                </div>
            
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

                <div class="blogs-footer">
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
                </div>

                <div class="cate-manage">
                    <div class="tools">
                        <el-button @click="cMode = true">新建分类</el-button>
                        <el-button type="primary" @click="editCate">编辑分类</el-button>
                        <el-button type="danger" @click="rmCate">删除分类</el-button>
                    </div>

                    <div class="cates">
                        <!-- {{ selectedCate }} -->
                        <el-collapse-transition>
                            <div v-if="cMode" class="cate to-add">
                                <el-input v-model="newCate.cname" placeholder="分类名"></el-input>
                                <el-input v-model="newCate.intro" placeholder="分类简介"></el-input>
                                <el-button type="primary" @click="addCate">保存</el-button>
                                <el-button @click="cMode = false">取消</el-button>
                            </div>
                        </el-collapse-transition>

                        <el-collapse-transition>
                            <div v-if="eMode" class="cate to-add">
                                <el-input v-model="selectedCate.cname" placeholder="分类名"></el-input>
                                <el-input v-model="selectedCate.intro" placeholder="分类简介"></el-input>
                                <el-button type="primary" @click="updateCate">提交</el-button>
                                <el-button @click="eMode = false">取消</el-button>
                            </div>
                        </el-collapse-transition>
                        
                        <div class="cate" v-for="(cate, idx) in cates" :key="idx">
                            <el-radio v-model="selectedCate" :label="cate">
                                {{ cate.cname }}
                                <div class="cate-inner">
                                    {{ cate.intro }} by {{ cate.uname }}
                                    <p>{{ cate.created_at | sallyTime }}</p>
                                </div>
                            </el-radio>
                        </div>
                    </div>
                </div>

                <div class="user-manage cates">
                    <div class="tools">
                        <el-button type="primary" @click="editUser">编辑用户</el-button>
                        <el-button type="danger" @click="rmUser">删除用户</el-button>
                    </div>
                    
                    <el-collapse-transition>
                        <div v-if="eUMode" class="cate to-add">
                            <el-input disabled v-model="selectedUser.uname" placeholder="用户名"></el-input>
                            <el-input disabled v-model="selectedUser.uintro" placeholder="用户介绍"></el-input>

                            <el-select v-model="selectedUser.role" placeholder="用户身份">
                                <el-option label="管理员" :value="0"></el-option>
                                <el-option label="普通用户" :value="1"></el-option>
                            </el-select>

                            <el-button type="primary" @click="updateUser">提交</el-button>
                            <el-button @click="eUMode = false">取消</el-button>
                        </div>
                    </el-collapse-transition>

                    <div class="cate" v-for="(user, idx) in users" :key="idx">
                        <el-radio v-model="selectedUser" :label="user">
                            {{ user.uname }}
                            <div class="cate-inner">
                                {{ user.uintro }}
                                <p>{{ user.created_at | sallyTime }}</p>
                            </div>
                        </el-radio>
                    </div>
                </div>
            </el-main>
        </el-container>
        <el-container>
            <div class="deny">
                <p>拒绝访问，权限不足</p>

                <el-button type="danger" @click="$router.back()">返回</el-button>
            </div>
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
            COUNTER: {},
            cates: [],
            selectedCate: null,
            cMode: false,
            newCate: {
                cname: '',
                intro: ''
            },
            eMode: false,
            users: [],
            selectedUser: null,
            eUMode: false,
            err: false
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

        this.userInit().then(userOK => {
            return this.judge(); 
        }).then(judgeOk => {
            return this.initAll(); 
        }).catch(err => {
            this.err = true; 
            return this.$notify.error({
                title: '权限不足，拒绝访问',
                message: '只有管理员可以访问后端控制台'
            });
        }); 
    },
    methods: {
        countAll(){
            return http.get('/api/sys/count-all').then(res => {
                let { code, data } = res; 
    
                this.COUNTER = data; 
            })
        },
        judge(){
            if (this.user.role !== 0){
                return Promise.reject('permission deny');
            } else {
                return Promise.resolve('permission resolve'); 
            }
        },
        initAll(){
            return Promise.all([
                this.listing(),
                this.initPage(),
                this.countAll(),
                this.cateInit(),
                this.initUsers()
            ]); 
        },
        initUsers(){
            return http.get('/api/user').then(res => {
                this.users = res.data; 
            })
        }, 
        cateInit(){
            return http.get('/api/cate').then(res => {
                this.cates = res.data; 
            })
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
        },
        addCate(){
            let { cname, intro } = this.newCate;

            return http.post('/api/cate', {
                cname, intro
            }).then(res => {
                this.cMode = false; 
                return this.cateInit();
            })
        },
        rmCate(){
            if (!this.selectedCate) return this.$message({
                type: 'warning',
                message: '请选择后继续'
            }); 

            return http.post('/api/cate/remove', {
                caid: this.selectedCate.caid
            }).then(res => {
                return this.cateInit();
            })
        },
        editCate(){
            if (!this.selectedCate) return this.$message({
                type: 'warning',
                message: '请选择后继续'
            }); 

            this.eMode = true; 
        },
        updateCate(){
            let { caid, cname, intro } = this.selectedCate; 

            return http.post('/api/cate/update', {
                caid, cname, intro, 
            }).then(res => {
                this.eMode = false; 
                return this.cateInit(); 
            }); 
        },
        editUser(){
            if (!this.selectedUser) return this.$message({
                type: 'warning',
                message: '请选择后继续'
            }); 

            this.eUMode = true; 
        },
        rmUser(){
            if (!this.selectedUser) return this.$message({
                type: 'warning',
                message: '请选择后继续'
            }); 

            return http.post('/api/user/delete', {
                uid: this.selectedUser.uid
            }).then(res => {
                return this.initUsers(); 
            })
        },
        updateUser(){
            return http.post('/api/user/update-role', this.selectedUser).then(res => {
                return this.initUsers(); 
            }); 
        }
    }
}
</script>

<style lang="sass">

.admin 
    [grey]
        color: #BBB
    
    .no-data 
        color: #BBB
        font-size: 150%
        padding-top: 1.5em
        padding-bottom: 1em

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

    .blogs-footer 
        width: 500px 
        position: relative
        padding-left: 100px
        margin-bottom: 2em

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

    .cates 
        .to-add 
            width: 300px
            > * 
                display: inline-block
                margin-bottom: 1em
        .cate 
            
            font-size: 24px

            .cate-inner 
                margin: 8px 0
                line-height: 1.5

    .user-manage 
        margin-top: 2em

    
    .deny 
        font-size: 40px
        text-align: center
        color: #BBB
        margin: 4em 0 
        width: 100%

        p 
            margin-bottom: .5em

    .err-header 
        text-align: center
</style>
