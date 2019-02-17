import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control
import VueSocketio from 'vue-socket.io'
import { parseTime } from '@/utils'
//
//Vue.use(VueSocketio, 'http://localhost:9528')
Vue.use(new VueSocketio({
    debug: true,
    connection: process.env.SOCKET_API
}))
Vue.filter('parseTime', function(value) {
  if (!value) return ''
  return parseTime(value)
})

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
