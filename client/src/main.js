// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui';
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import SallyFilter from './utils/sally-filter'; 

Vue.use(mavonEditor); 

Vue.config.productionTip = false;

Vue.use(ElementUI); 
Vue.use(SallyFilter); 

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	template: '<App/>',
	components: { App }
}); 
