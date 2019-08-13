import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'

Vue.use(Router)

const isLoggedIn = (to, from, next) => {
  if (sessionStorage.getItem('token') === null) {
    next({ name: 'home' });
  } else {
    next();
  }
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Login 
    },
   {
      path: '/register',
      name: 'register',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "register" */ './components/Register.vue')
    },
   {
      path: '/profile',
      name: 'editProfile',
      component: () => import(/* webpackChunkName: "editProfile" */ './components/Profile.vue'),
      beforeEnter: isLoggedIn
   },
   {
      path: '/profile/:userId', 
      name: 'viewProfile',
      component: () => import(/* webpackChunkName: "viewProfile" */ './components/ViewProfile.vue'),
      beforeEnter: isLoggedIn
   }
  ]
})
