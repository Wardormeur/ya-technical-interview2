import Vue from 'vue';
import VueResource from 'vue-resource';
import VeeValidate from 'vee-validate';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(VeeValidate, { events: '' });
Vue.http.interceptors.push((request, next) => {                
  const token = sessionStorage.getItem('token');
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
    request.headers.set('Accept', 'application/json');
  }
  next();                                                    
});
new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
