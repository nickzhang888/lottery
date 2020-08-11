/* eslint-disable */
import axios from 'axios'
// axios post请求默认Content-type是 application/json
axios.defaults.timeout = 20000 // 20s没响应则认为该请求失败
axios.defaults.withCredentials = true// 跨域时如果要带上cookie话则需要设置withCrendentials

// http request 拦截器 所有请求发出前都需要执行以下代码
axios.interceptors.request.use(
  (request) => request,
  (error) => Promise.reject(error)
)

// http response 拦截器 所有请求返回结果后都需要执行以下代码
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error.response)
    // 此处可对token过期等公用错误状态码进行处理
    if (error.response.status === 401) {
      window.location.href = `http://h5test.wostore.cn/login?clientId=activetemplate&redirectUrl=${encodeURIComponent(
        window.location.href
      )}`
    }
    // return Promise.reject(error)
  }
)

/**
 *  封装get方法 跟 post 方法
 *  @param 请求url
 *  @param 请求参数
 *  @returns {Promise}
 */

// 这种写法是导出后可以通过在main.js中使用Vue.use(http) 挂载到vue实例上
export default {
  install: (Vue) => {
    Vue.prototype.$get = (url, params = {}) => {
      return new Promise((resolve, reject) => {
        axios.get(url, params)
          .then(response => resolve(response.data))
          .catch(error => reject(error))
      })
    }
    Vue.prototype.$post = (url, params = {}) => {
      return new Promise((resolve, reject) => {
        axios.post(url, params)
          .then(response => resolve(response.data))
          .catch(error => reject(error))
      })
    }
    Vue.prototype.$axios = (config) => {
      return new Promise((resolve, reject) => {
        axios(config)
          .then(response => resolve(response.data))
          .catch(error => reject(error))
      })
    }
  }
}