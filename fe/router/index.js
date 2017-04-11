import Vue from 'vue'
import Router from 'vue-router'
import Errors from '@/views/Error'
import Perf from '@/views/Perf'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Errors',
      component: Errors
    },
    {
      path: '/performance',
      name: 'Performace',
      component: Perf
    }
  ]
})
