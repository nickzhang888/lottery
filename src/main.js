import Vue from 'vue'
import { Input } from 'element-ui'
import Clipboard from 'clipboard'
import toast from './utils/toast/toast' // 调用toast插件
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './utils/axios'
import Bus from './utils/bus'
// import utils from './utils/utils'
import './utils/flexible'
// 全局样式
import './styles/index.scss'
import vueSwiper from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import { Popup } from 'vant';
import 'vant/lib/index.css';

Vue.use(Popup);
Vue.use(vueSwiper)
Vue.use(axios)
Vue.use(Input)
Vue.use(toast)
Vue.config.productionTip = false
Vue.prototype.Clipboard = Clipboard
Vue.prototype.$bus = Bus

const requireComponent = require.context('./components/base', false, /Wo[A-Z]\w+\.(vue|js)$/)
requireComponent.keys().forEach((fileName) => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)
  const componentName = fileName.split('/').pop().replace(/\.\w+$/, '')
  // 全局注册组件
  Vue.component(componentName, componentConfig.default)
})

// Vue.prototype.$utils = utils
new Vue({
  router,
  store,
  render: (h) => h(App),
  created() {
    // store.dispatch('getUserInfo')
  }
}).$mount('#app')
