<template>
	<div class="login-containner">
		<div class="logo">
			<div class="logo-text">Sally Login</div>
		</div>
		


		<div class="align-center">
			<input type="text" class="uinput username"
				v-model="user.uname"
				placeholder="账号"
			/>
			<input type="password" class="uinput pwd"
				v-model="user.pwd" @keydown.enter="toLogin"
				placeholder="密码"
			>
			<div class="login-btn opt-btn" @click="toLogin">登陆</div>
			<div class="reg-btn opt-btn" @click="toReg">注册并登陆</div>
		</div>
	</div>
</template>

<script>
import http from '@/utils/http.client'; 

export default {
	name: 'login',
	data: () => ({
		user: {
			uname: '',
			pwd: ''
		}
	}),
	created(){
		this.init(); 
	},
	methods: {
		init(){
			http.get('/api/user/me').then(res => {
				let { code, data, msg } = res; 

				if (code === 2000){
					this.$router.replace('/list'); 
				} else {
					this.$message('请登陆');
				}
			}); 
		},
		toLogin(){
			console.log(this.user); 
			http.post('/api/user/login', this.user).then(res => {
				let { code, data, msg } = res; 

				if (code === 2000){
					this.$notify({
						title: '登陆成功',
						message: `欢迎回来 ${ this.user.uname }`,
						type: 'success'
					});
					this.$router.replace('/list'); 
				} else {
					this.$message.error(msg);
				}
			}); 
		},
		toReg(){
			let user = this.user; 
			if (
				!user.uname        || !user.pwd        ||
				!user.uname.trim() || !user.pwd.trim()
			) return this.$message({
				type: 'warning', 
				message: '账号密码不符合格式'
			}); 

			// http.post('/api')
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass">

.login-containner 
	.logo 
		position: relative
		// cursor: pointer
		margin: 2em auto 9em auto
		// position: absolute
		width: 200px
		height: 200px
		border-radius: 50%
		background-color: #FEFEFE
		box-shadow: 16px 16px 0 #BBB
		// top: 50%
		transform: translateX(-16px)
		// margin: 0
	    transition: all .3s

		.logo-text 
			position: absolute
			bottom: -80px
			width: 100%
			left: 24px
			text-align: center
			font-size: 28px
	
	.uinput
		display: block
		width: 100%
		margin-bottom: 1em
		padding: .5em 1em
		box-sizing: border-box
		text-align: center
		border-radius: 4px
		border: 1px solid #DDD
		font-size: 16px


	.align-center 
		text-align: center
		max-width: 300px 
		margin: 0 auto

	.login-btn 
		background-color: #409EFF

	.reg-btn 
		background-color: #67C23A
	
	.opt-btn
		margin-bottom: 1em
		cursor: pointer
		display: block
		font-size: 16px
		// background-color: #409EFF
		color: #FEFEFE
		padding: .5em 0
		border-radius: 4px		
</style>
