import Vue from 'vue'
import Router from 'vue-router'
import Mybook from './views/Mybook.vue'
import Reader from './views/Reader.vue'
import Login from './views/Login.vue'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/login' },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/mybook',
      name: 'Mybook',
      component: Mybook
    },
    {
      path: '/reader/:id',
      name: 'reader',
      component: Reader
    }
    
  ]
})
