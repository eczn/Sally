<template>
    <div class="detail" v-if="blog && user">
        <!-- <header>Sally Blog</header> -->
        <div class="blog-header">
			<div class="vally-header">{{ user.uname }}'s blog</div>
			
			<div class="blog-info blog-content">
				<div class="tags">
					<span class="tag">
						<img inline-icon class="blog-icon" src="../assets/icons/tag.svg" />
						<span>Wow</span>
					</span>

					<span class="date">
						<img inline-icon class="blog-icon" src="../assets/icons/date.svg" />
						<span>{{ blog.created_at | sallyTime }}</span>
					</span>
				</div>
				<h1>{{ blog.title }}</h1>
			</div>
		</div>

        <div class="blog">
            <div class="md" v-html="blog.content"></div>
        </div>

        <div class="bottom">
            <div class="numbers">
                <p>- 本文由 {{ blog.uname }} 完成于 {{ blog.created_at | sallyTime }}</p>
                <p>- 约 {{ blog.md_src.length }} 字, 分类于 {{ blog.cname }}</p>
            </div>
        </div>

        <div class="comment-area">
            <div class="user">
                <span :style="{
                    backgroundImage: `url(${user.avatar})`
                }"></span>
                <div class="user-info">
                    <p>{{ user.uname }}</p>
                </div>
            </div>
            <textarea class="user-input" placeholder="在此输入评论内容" v-model="comment_input"></textarea>

            <div class="tools">
                <div class="submit" @click="toComment">提交</div>
            </div>
        </div>

        <div class="user-comments-here">以下为用户评论</div>

        <div>
            <li class="comment-area" v-for="(comment, idx) in comments" :key="idx">
                <div class="user">
                    <span :style="{
                        backgroundImage: `url(${comment.avatar})`
                    }"></span>
                    <div class="user-info">
                        <p>{{ comment.uname }}</p>
                    </div>
                </div>
                <pre class="user-input">{{ comment.text }}</pre>
                <div class="tools comment-ctime">
                    {{ comment.created_at | sallyTime }}
                </div>
            </li>
        </div>
        <div class="no-comments" v-if="comments.length === 0">
            暂无评论
        </div>
        <div class="user-comments-here" v-else>共计 {{ comments.length }} 条</div>
    </div>
</template>

<script>
import http from '@/utils/http.client'; 

require('../assets/css/mark-vally.css'); 
require('../assets/css/blog.css'); 

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
            blog: null,
            user: null, 
            comments: [],
            comment_input: '',
            toolbars: {
                save: true,
                navigation: true,
                subfield: true,
                preview: true
            }
        }
    }, 
    created(){
        this.initBlog(); 
        this.initComment(); 
        this.initMyself(); 
    },
    methods: {
        save(){

        }, 
        initBlog(){
            return http.get('/api/blog/one', {
                bid: this.bid
            }).then(res => {
                let { code, data } = res; 

                this.blog = data.pop(); 
            }); 
        },
        initMyself(){
            return http.get('/api/user/me').then(({ code, data }) => {
                this.user = data; 
            }); 
        },
        initComment(){
            return http.get('/api/comment', {
                bid: this.bid
            }).then(res => {
                let { code, data } = res; 

                this.comments = data;
            })
        },
        toComment(){
            return http.post('/api/comment', {
                bid: this.bid,
                text: this.comment_input
            }).then(({ code, data }) => {
                return this.initComment(); 
            }); 
        }
    }
}
</script>


<style lang="sass">
.detail 
    max-width: 700px
    margin: 0 auto
    header 
        line-height: 500px
        text-align: center
        font-family: Consolas, Menlo

    .title 
        font-size: 24px
        text-align: right

    .blog 
        min-height: 300px
        margin-bottom: 1em

    .bottom
        padding: 2em 0
        border-top: 1px solid #DDD
        // border-bottom: 1px solid #DDD
        margin-bottom: 3em
    
    .no-comments
        text-align: center
        padding: 5em 0
        font-size: 20px
        color: #BBB

    .user-comments-here 
        text-align: center
        padding: 5em 0
        font-size: 20px
        color: #BBB

    .comment-area 
        position: relative
        font-size: 0
        > * 
            font-size: 16px
            display: inline-block
            vertical-align: top
        .user
            width: 100px
            position: absolute 
            left: 0 
            top: 0
            span 
                width: 100%
                padding-top: 100%
                background-size: cover
                display: inline-block
            p 
                text-align: center
                white-space: nowrap

            .user-info 
                margin: 1em 0
        .user-input

            width: 100%
            min-height: 100px
            word-wrap: break-word
            word-break: break-all
            
            // background-color: #EEE
            resize: none
            border: 1px solid #EEE
            // padding: .5em 1em
            padding-left: 120px
            padding-top: .5em
            padding-bottom: .5em
            padding-right: 1em
            box-sizing: border-box
            box-shadow: 0 0px 3px rgba(0,0,0,0.157), 0 0px 3px rgba(0,0,0,0.227)

        .tools
            text-align: right
            display: block
            padding: 1em 0
            
            .submit
                cursor: pointer
                display: inline-block
                width: 3em
                background-color: #409EFF
                color: #FFF
                text-align: center
                padding: .3em .6em
                border-radius: 4px
                margin-right: 1em

        .comment-ctime 
            color: #BBB
            margin-right: 1em
                
</style>
