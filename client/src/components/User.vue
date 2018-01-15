<template>
    <div class="user" v-if="user">
        <div class="bg" :style="{
            backgroundImage: `url(${user.avatar})`
        }">
            <div class="user-avatar" :style="{
                backgroundImage: `url(${user.avatar})`
            }"></div>
            <div class="username">
                {{ user.uname }}
            </div>
            <div class="userintro">
                {{ user.uintro || '该用户还没有写介绍喔' }}
            </div>
        </div>

        <div class="content">
            
            <div class="line">
                <p class="l">@: </p>
                <p class="r">{{ user.mail || '-' }}</p>
            </div>
            <div class="line">
                <p class="l">>_ </p>
                <p class="r">{{ user.github || '-' }}</p>
            </div>
            <div class="line">
                <p class="l">S<span style="color: rgba(20, 174, 117, .5);" class="sf-green">F</span> </p>
                <p class="r">{{ user.sf || '-' }}</p>
            </div>
            <div></div>
            <div class="line">
                <p class="l">$: </p>
                <p class="r">{{ ['管理员', '普通用户'][user.role] }}</p>
            </div>    
        </div>

        <div class="middle-text" v-if="blogs.length !== 0">他最近的文章</div>
        <div class="middle-text" v-else>他还没有写过文章喔</div>
        <div class="blogs comments">
            <li v-for="(blog, idx) in blogs" :key="idx" class="blog comment"
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
            comments: [],
            blogs: []
        }
    }, 
    created(){
        this.initUser(); 
        this.initComments();
        this.initBlogs();
    },
    methods: {
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
        }
    }
}
</script>


<style lang="sass">
.user 
    max-width: 700px
    margin: 0 auto
    .bg 
        position: relative
        height: 300px
        background-position: center
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
            top: 100%
            right: 10%
            margin: .5em 0

    .content 
        margin-top: 100px
        font-size: 0
        > * 
            font-size: 16px
        .line 
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
</style>
