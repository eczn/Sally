<template>
    <div class="edit">
        <div class="inner">
            <input class="title-input" type="text" v-model="editing.title" placeholder="在此输入标题" />
            <mavon-editor :style="{
                    height: innerHeight - 250 + 'px'
                }" v-model="editing.md_src" 
                ref="md"
                @save="save"
                @imgAdd="$imgAdd"
            />

            <!-- <div class="t">{{ editing }}</div> -->

            <div class="cates">
                <div class="add-new">
                    <span>文章分类选择：</span>
                    <i @click="addNewCate" class="add-btn el-icon-circle-plus"></i>
                </div>
                <el-radio v-for="(cate, idx) in cates"
                    v-model="editing.caid" :label="cate.caid" :key="idx">
                    {{ cate.cname }}
                </el-radio>
            </div> 
        </div>
    </div>
</template>

<script>
import http from '@/utils/http.client'; 
import axios from 'axios'; 

export default {
    name: 'edit', 
    data(){
        return {
            innerHeight: window.innerHeight,
            editing: {
                md_src: '',
                content: "",
                title: "",
                caid: null,
                uid: null,
                intro: "",
                // uname: null
            },
            user: null, 
            cates: [], 
            aMode: false
        }
    }, 
    computed: {
        md(){
            return this.$refs.md; 
        },
        getSelectedIntro(){
            
        }
    }, 
    created(){
        let bid = this.$route.query.bid;
        if (bid) {
            // this.editing = JSON.parse(JSON.stringify(this.$route.params));
            this.initEditting(bid); 
        } else {
            this.aMode = true; 
        }

        this.initUser(); 
        this.initCates(); 
    },
    methods: {
        initEditting(bid){
            return http.get('/api/blog/one', {
                bid
            }).then(res => {
                this.editing = res.data.pop(); 
            }); 
        }, 
        initUser(){
            return http.get('/api/user/me').then(res => {
                let { code, data } = res; 

                 this.user = data; 
                 this.editing.uid = data.uid; 
            }); 
        },
        initCates(){
            return http.get('/api/cate').then(res => {
                let { code, data } = res; 

                this.cates = data; 
            })
        },
        save(value, rendered){
            this.editing.content = rendered; 
            this.editing.intro = this.editing.md_src.substring(0, 20); 

            if (this.aMode) this.uploadNew();
            else this.upadte(); 
        },
        uploadNew(){
            if (!this.editing.uid || !this.editing.caid) return this.$message.error('请选择分类');
            if (!this.editing.title) return this.$message.error('请输入标题');
            if (!this.editing.md_src) return this.$message.error('请输入正文');

            http.post('/api/blog', this.editing).then(res => {
                let { code, data } = res; 

                if (code !== 2000) return this.$notify.error({
                    title: '错误',
                    message: JSON.stringify(res)
                });

                this.$notify({
                    title: '保存成功',
                    message: `文章id ${data.bid}`,
                    type: 'success'
                });

                this.$router.push('/admin'); 
            }); 
        },
        addNewCate(){
            let global_value; 
            this.$prompt('请输入 cname|intro', '输入分类名以及分类介绍，用 | 分隔', {
                confirmButtonText: '提交',
                cancelButtonText: '取消',
                inputPattern: /\|/,
                inputErrorMessage: '格式不正确'
            }).then(({ value }) => {
                global_value = value; 

                let lr = value.split('|').map(e => e.trim()); 
                let [cname, intro] = lr; 
                

                return http.post('/api/cate', {
                    cname, intro
                }); 
                
            }).then(ok => {
                this.$message({
                    type: 'success',
                    message: global_value
                });

                return this.initCates(); 
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
        }, 
        upadte(){
            http.post('/api/blog/fresh', this.editing).then(res => {
                let { code, data } = res; 

                if (code !== 2000) return this.$notify.error({
                    title: '错误',
                    message: JSON.stringify(res)
                });

                this.$notify({
                    title: '编辑成功',
                    message: `文章id ${this.editing.bid}`,
                    type: 'success'
                });
            })
        },
        chooseCate(){
            
        },
        $imgAdd(pos, $file){
            let formdata = new FormData();  
            formdata.append('img', $file);

            return axios.request({
                url: '/api/img', 
                method: 'post', 
                data: formdata
            }).then(resp => {
                return resp.data; 
            }).then(res => {
                let { code, data, msg } = res; 
                let { url, imid, uid } = data; 

                this.md.$img2Url(pos, url); 
            }); 
        }
    }
}
</script>


<style scoped>
.title-input {
    text-align: center;
    width: 100%; 
    display: block; 
    margin: 0 auto; 
    padding: .8em 0; 
    font-size: 20px; 
    box-shadow: 0 0px 3px rgba(0,0,0,0.157), 0 0px 3px rgba(0,0,0,0.227);
    border: none; 
}

.inner {
    padding-top: 50px; 
    width: 90%;
    margin: 0 auto; 
}

.tools {
    margin: 2em 0; 
}

.add-btn {
    cursor: pointer;
}

.add-new {
    margin-bottom: 8px; 
}

.tools button {
    box-shadow: 0 0px 3px rgba(0,0,0,0.157), 0 0px 3px rgba(0,0,0,0.227);
}

.cates {
    font-size: 20px;
    margin-top: 1em; 
}

</style>
