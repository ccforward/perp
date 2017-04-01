import Vue from 'vue'
import Rubik from 'i-rubik'
import Translate from './pages/Translate.vue'

Vue.config.productionTip = false

Vue.use(Rubik)

new Vue({
  el: '#app',
  template: '<Translate/>',
  components: { Translate }
})
