<template>
    <div class="user" v-if="user">
        <form ref="form" v-if="me">
            <input type="hidden" name="uid" v-model="me.uid" />
            <input type="file" name="img" id="my-bg" class="bg-input"
                @change="toUpload('bg_url')" />
            <input type="file" name="img" id="my-avatar" class="bg-input" 
                @change="toUpload('avatar')" />
        </form>

        <label for="my-bg" class="bg" :style="{
            backgroundImage: `url(${user.bg_url})`
        }">
            <div v-if="isMe" class="click-to-click">
                <span>点击上传</span>
            </div>
            <label for="my-avatar" class="user-avatar" :style="{
                backgroundImage: `url(${user.avatar})`
            }">
                <div v-if="isMe" class="click-to-click avatar">
                    <span>点击上传</span>
                </div>
            </label>
            <div class="username">
                {{ user.uname }}
            </div>
            <div class="userintro" @click="toUpdate('uintro')">
                {{ user.uintro || '该用户还没有写介绍喔' }}
            </div>
        </label>

        <div class="content">
            <div class="line" @click="toUpdate('mail')">
                <p class="l">@: </p>
                <p class="r">{{ user.mail || '未设置' }}</p>
            </div>
            <div class="line" @click="toUpdate('github')">
                <p class="l">>_ </p>
                <p class="r">{{ user.github || '未设置' }}</p>
            </div>
            <div class="line" @click="toUpdate('sf')">
                <p class="l">S<span style="color: rgba(20, 174, 117, .5);" class="sf-green">F</span> </p>
                <p class="r">{{ user.sf || '未设置' }}</p>
            </div>
            <div></div>
            <div class="line" @click="$message({
                message: '用户身份管理请到后台管理页',
                type: 'warning'
            });">
                <p class="l">$: </p>
                <p class="r">{{ ['管理员', '普通用户'][user.role] }}</p>
            </div>    
        </div>

        <div v-if="isMe" class="me-btns">
            <el-button @click="$router.push('/list')" type="primary">返回首页</el-button>
            <el-button @click="toLogout" type="danger">退出登陆</el-button>
        </div>

        <div class="middle-text" v-if="blogs.length !== 0">他最近的文章</div>
        <div class="middle-text" v-else>他还没有写过文章喔</div>
        <div class="blogs comments">
            <li v-for="(blog, idx) in blogs.slice(0, 5)" :key="idx" class="blog comment"
                @click="pageRouter('/detail/' + blog.bid)">
                <div class="line meta-top">字数：{{ blog.md_src.length }}</div>
                <div class="line">
                    <div class="c-text">{{ blog.title }}</div>
                </div>
                <div class="line meta-bottom">
                    <div class="c-blog">{{ blog.created_at | sallyTime }}</div>
                </div>
            </li>
        </div>

        <div class="middle-text" v-if="comments.length !== 0">他最近的留言</div>
        <div class="middle-text" v-else>他没有留过言喔</div>
        <div class="comments">
            <li v-for="(comment, idx) in comments.slice(0, 3)" :key="idx" class="comment">
                <div class="line meta-top">留言于《{{ comment.title }}》</div>
                <div class="line">
                    <div class="c-text">{{ comment.text }}</div>
                </div>
                <div class="line meta-bottom">
                    <div class="c-blog">{{ comment.created_at | sallyTime }}</div>
                </div>
            </li>
        </div>
    </div>
</template>

<script>
import http from '@/utils/http.client'; 
// import $ from 'jquery'; 
import axios from 'axios'; 

export default {
    name: 'user', 
    props: {
        uid: {
            type: String, 
            required: true
        }
    },
    data(){
        return {
            user: null,
            me: null, 
            comments: [],
            blogs: []
        }
    }, 
    created(){
        Promise.all([
            this.initUser(),
            this.initMe(),
            this.initComments(),
            this.initBlogs()
        ]).then(allDone => {
            if (this.isMe) this.$notify.info({
                title: 'Hello ~',
                message: '这是自己的资料页，点击字段可以进行编辑'
            });
        });
    },
    computed: {
        isMe(){
            return this.me && (this.me.uid === this.user.uid); 
        }
    }, 
    methods: {
        initMe(){
            return http.get('/api/user/me').then(({ code, data }) => {
                if (code === 2000) this.me = data; 
            }); 
        },
        initUser(){
            return http.get('/api/user/find', {
                uid: this.uid
            }).then(({ code, data }) => {
                if (code === 2000) this.user = data.pop(); 
            }); 
        },
        initComments(){
            return http.get('/api/comment/by-user', {
                uid: this.uid
            }).then(({ code, data }) => {
                this.comments = data; 
            })
        },
        initBlogs(){
            return http.get('/api/blog/by-user', {
                uid: this.uid
            }).then(({ code, data }) => {
                if (code === 2000) this.blogs = data; 
            })
        },
        pageRouter(path){
            this.$router.push({
                path
            }); 
        },
        toUpdate(key){
            if (this.isMe){
                return this.$prompt('请输入新值', `你正在修改 ${key} 字段`, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /./,
                    inputErrorMessage: '格式不正确'
                }).then(({ value }) => {
                    return this.pushUpdate(key, value); 
                }).catch(err => {

                    console.log(err); 
                    this.$message({
                        type: 'info',
                        message: '取消'
                    });
                });
            }
        },
        pushUpdate(key, val){
            this.$message({
                type: 'success',
                message: key + ' -> ' + val
            });

            return http.post('/api/user/update', {
                key, val
            }).then(res => {
                let { code, data } = res; 
                if (code === 2000) this.user[key] = val; 
            })
        },
        toUpload(toUpdateKey){
            let data = new FormData(this.$refs.form);  

            console.log(toUpdateKey)

            axios.request({
                url: '/api/img', 
                method: 'post', 
                data: data
            }).then(resp => {
                return resp.data; 
            }).then(res => {
                let { code, data, msg } = res; 
                console.log(res); 

                return this.pushUpdate(toUpdateKey, data.url); 
            }).then(ok => {
                setTimeout(() => location.reload(), 800); 
            }).catch(err => {
                console.log(err); 
            })
        },
        toLogout(){
            return http.get('/api/user/logout').then(res => {
                this.$notify({
                    title: '注销成功',
                    message: `回到登陆界面`,
                    type: 'success'
                });

                this.$router.replace('/login'); 
            }); 
        }
    }
}
</script>


<style lang="sass">
.user 
    .bg-input 
        display: none
    max-width: 700px
    margin: 0 auto
    .bg
        display: block 
        position: relative
        height: 300px
        background-position: center
        background-size: cover
        background-color: #DDD
        > * 
            position: absolute
        .user-avatar
            border: 3px solid rgba(255, 255, 255, .8)
            box-sizing: border-box
            left: 10%
            // transform: translateX(-50%)
            border-radius: 50%
            background-size: cover
            bottom: -60px
            width: 120px 
            height: 120px
        .username 
            right: 10%
            bottom: 0
            font-size: 200%
            color: #FFF
            text-shadow: 3px 2px 0 rgba(0, 0, 0, .4)

        .userintro
            cursor: pointer
            top: 100%
            right: 10%
            margin: .5em 0

        .click-to-click
            position: absolute
            line-height: 300px
            height: 300px
            left: 0%
            text-align: center
            color: #FFF
            width: 100%
            font-size: 0
            transition: all .3s
            background-color: rgba(0, 0, 0, .5)
            cursor: pointer
            font-size: 18px

            opacity: 0
            
            &:hover 
                opacity: 1

            &.avatar 
                height: 120px
                width: 120px
                margin-left: -3px
                margin-top: -3px
                font-size: 12px
                box-sizing: border-box;
                line-height: 120px
                border-radius: 120px

            span
                transition: all .3s
                background-color: #409EFF
                padding: .5em 1em
                border-radius: 4px
                transform: scale(1.5)

    .content
        padding-bottom: 50px
        border-bottom: 1px solid #DDD 
        margin-top: 100px
        font-size: 0
        > * 
            font-size: 16px
        .line  
            cursor: pointer
            max-width: 350px
            display: inline-block
            box-sizing: border-box
            margin-bottom: 1em
            padding-left: 10%
            white-space: nowrap
            > * 
                display: inline-block
                vertical-align: middle
            .l 
                font-size: 180%
                color: #BBB
            .r
                font-size: 110%

            &::after 
                content: ';'
                display: inline-block
                margin: 0 .4em
                color: #BBB

    .comments 
        .comment
            margin-bottom: 1.5em
            border: 1px solid #DDD
            padding: .5em 0
            .line 
                // display: flex
            .c-text
                position: relative
                padding: 1em 0
                text-align: center
                font-size: 150%
                &::after, &::before
                    content: '"'
                    display: inline-block
                    padding: 0 1em
                
            .meta-bottom, .meta-top
                margin: 0 3em 
                font-size: 90%
                color: #BBB
            .meta-bottom
                text-align: right

    .blog 
        cursor: pointer 
        transition: all .3s
        transform: scale(.9)
        &:hover 
            // font-size: 18px
            transform: scale(1)

    .me-btns 
        margin: 1em 0
        text-align: center
</style>
