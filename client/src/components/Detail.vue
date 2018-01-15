<template>
    <div class="detail" v-if="blog && user">
        <!-- <header>Sally Blog</header> -->
        <div class="blog-header">
			<div class="vally-header">eczn's blog</div>
			
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
                <img :src="user.avatar" />
                <p>{{ user.uname }}</p>
            </div>
            <div class="user-input">
                <mavon-editor :style="{
                        
                    }" v-model="comment_input" 
                    ref="md"
                    :toolbars="toolbars"
                    @save="save"
                />
            </div>
        </div>
        <div>
            <li v-for="(comment, idx) in comments" :key="idx">
                {{ comment }}
            </li>
        </div>
        <div class="no-comments" v-if="comments.length === 0">
            暂无评论
        </div>
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
        border-bottom: 1px solid #DDD
        margin-bottom: 2em
    
    .no-comments
        text-align: center
        padding: 5em 0
        font-size: 20px
        color: #BBB

    .comment-area 
        font-size: 0
        > * 
            font-size: 16px
            display: inline-block
            vertical-align: top
        .user
            width: 15%
            img 
                width: 100%
            p 
                text-align: center
        .user-input
            width: 80%
            min-height: 120px
            // background-color: #EEE
            margin-left: 2.5%
            border: 1px solid #EEE
</style>
