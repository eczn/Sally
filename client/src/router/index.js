import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/Login';
import List from '@/components/List';
import Admin from '@/components/Admin';
import Detail from '@/components/Detail'; 
import Edit from '@/components/Edit'; 
import User from '@/components/User'; 

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			redirect: '/login'
		}, 
		{
			path: '/login', 
			name: 'Login',
			component: Login
		},
		{
			path: '/list', 
			name: 'List',
			component: List
		},
		{
			path: '/detail/:bid', 
			name: 'Detail',
			props: true, 
			component: Detail
		},
		{
			path: '/user/:uid', 
			name: 'User', 
			props: true, 
			component: User
		}, 
		{
			path: '/admin', 
			name: 'Admin', 
			component: Admin
		},
		{
			path: '/edit', 
			name: 'Edit', 
			component: Edit
		}
	]
});
