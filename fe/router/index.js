import Vue from 'vue'
import Router from 'vue-router'
import Errors from '@/views/Error'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Errors',
      component: Errors
    },
    // {
    //   path: '/errors',
    //   name: 'Errors',
    //   component: Errors
    // }
  ]
})
