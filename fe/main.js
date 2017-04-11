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
