<template>
	<div id="app">
		<!-- <user-bar></user-bar> -->
		<router-view></router-view>
	</div>
</template>

<script>
import http from './utils/http.client'; 

export default {
	name: 'app',
	data(){
		return {}
	},
	created(){
		http.get('/api/user/me').then(res => {
			let { code, data } = res; 

			if (!data) this.$router.replace('/login'); 
		}); 
	},
	methods: {
		
	}
}
</script>

<style>
body {
	color: #555; 
	font-family: "Consolas", "Menlo"; 
	list-style: none;
}

* {
	margin: 0; 
	padding: 0; 
	user-select: none; 
}

[inb] {
	display: inline-block;
}

.blog-icon {
	width: 1.25em; 
	vertical-align: middle;
}

.middle-text {
	text-align: center;
	padding: 5em 0;
	font-size: 20px;
	color: #BBB;
}

::-webkit-scrollbar {
    width: 5px;
    height: 16px;
    background-color: #AAA;
}

::-webkit-scrollbar-thumb {
    background-color: #AAA;
}

::-webkit-scrollbar-track {
    background-color: #E0E0E0;
}

::selection {
    color: #FFF;
    background-color: #C6BCBB;
}
</style>
