/*
 * @Date: 2020-03-30 14:26:58
 * @LastEditors: Pengyr
 * @LastEditTime: 2020-05-21 17:41:27
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home.vue'
import empty from '../views/empty.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/:actCode/empty',
    name: 'empty',
    component: empty
  },
  {
    path: '/:actCode',
    name: 'home',
    component: Home
  },
  
]

const router = new VueRouter({
  base: process.env.VUE_APP_URL,
  mode: 'history',
  routes
})

export default router
