<template>
	<div class="login-containner">
		<input type="text" class="username" v-model="user.uname" />
		<input type="text" class="pwd" v-model="user.pwd">
		<button @click="toLogin">登陆</button>
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
		
	},
	methods: {
		toLogin(){
			http.post('/api/user/login', this.user).then(ok => {

			}); 
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass">
	
</style>
