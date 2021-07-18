import Vue from 'vue'
import { Input } from 'element-ui'
import Clipboard from 'clipboard'
import toast from './utils/toast/toast' // 调用toast插件
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './utils/axios'
import api from './utils/api'
import Bus from './utils/bus'
import utils from './utils/utils'
import './utils/flexible'
import moment from 'moment'
import $ from "jquery";
// 全局样式
import './styles/index.scss'
import vueSwiper from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import { Popup,CountDown } from 'vant'
import 'vant/lib/index.css'
import "./mock.js"

window.$ = $

Vue.use(Popup);
Vue.use(CountDown);
Vue.use(vueSwiper)
Vue.use(axios)
Vue.use(Input)
Vue.use(toast)

Vue.config.productionTip = false
Vue.prototype.Clipboard = Clipboard
Vue.prototype.$bus = Bus
Vue.prototype.$log = window.console.log;
Vue.prototype.$moment = moment
Vue.prototype.$api = api
Vue.prototype.$utils = utils
const requireComponent = require.context('./components/base', false, /\.(vue|js)$/)
requireComponent.keys().forEach((fileName) => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)
  const componentName = fileName.split('/').pop().split(".")[0]
  // 全局注册组件
  Vue.component(componentName, componentConfig.default)
})

new Vue({
  router,
  store,
  render: (h) => h(App),
  created() {
    // store.dispatch('getUserInfo')
  }
}).$mount('#app')
