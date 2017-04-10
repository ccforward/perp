// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Rubik from 'i-rubik'
import App from './pages/App.vue'
import router from './router'
import '../node_modules/i-rubik/dist/rubik.min.css'

Vue.use(Rubik)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
