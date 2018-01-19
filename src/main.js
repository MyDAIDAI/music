import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import store from './store'

// Vue.config.productionTip = false
import 'common/stylus/index.styl'

fastclick.attach(document.body)

Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: require('common/image/default.png'),
  attempt: 1
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  // router,
  render: h => h(App),
  // 传入router实例
  router
})
