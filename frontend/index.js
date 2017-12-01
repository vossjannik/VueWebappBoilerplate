import Vue from 'vue/dist/vue.runtime.esm'
import VueRouter from 'vue-router'
import App from './components/App.vue'
import router from './router.js'
import connection from './utility/connection.js'

const config = require('../config.js')

require('babel-polyfill')
require('./styles/style.sass')
require('./manifest.json')

// connect immediately to the backend
const protocol = window.location.protocol.includes('s') ? 'wss' : 'ws'
connection.open({
  url: protocol + '://' + window.location.hostname + ':' + config.primaryPort,
})
connection.on('connect', () => { console.log('connection established') })
connection.on('disconnect', () => { console.log('connection established') })

// additional vue-plugins
Vue.use(VueRouter)

// for communicating between components
const eventHub = new Vue()
Vue.mixin({
  data () {
    return { eventHub }
  },
})

// start vue instance
// eslint-disable-next-line no-unused-vars
const app = new Vue({
  el: '#root',
  router,
  data: {},
  render (h) { return h(App, {}) },
})

// register the service-worker
window.navigator.serviceWorker && window.navigator.serviceWorker.register(
  '/sw.js',
  { scope: '/' }
)
