/*
 * @Date: 2020-03-30 14:26:58
 * @LastEditors: nick888
 * @LastEditTime: 2020-05-21 17:41:27
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/home.vue'
import empty from '../views/empty.vue'
import helpDraw from '../views/helpDraw.vue'
import winRecord from '../views/winRecord.vue'
import awardDetail from '../views/awardDetail.vue'
import invitationLink from '../views/invitationLink.vue'
import myReward from '../views/myReward.vue'
import draggable from '../views/draggable.vue'
const Home = () => import('../views/home.vue')
Vue.use(VueRouter)

const routes = [
  {
    path: '/:actCode/awardDetail',
    name: 'awardDetail',
    component: awardDetail,
    meta: { index: 2}
  },
  {
    path: '/:actCode/winRecord',
    name: 'winRecord',
    component: winRecord,
    meta: { index: 1}
  },
  {
    path: '/:actCode/helpDraw',
    name: 'helpDraw',
    component: helpDraw,
    meta: { index: 1}
  },
  {
    path: '/:actCode/myReward',
    name: 'myReward',
    component: myReward,
    meta: { index: 0}
  },
  {
    path: '/:actCode',
    name: 'home',
    component: Home,
    meta: { index: 0}
  },
  {
    path: '/empty',
    name: 'empty',
    component: empty,
    meta: { index: 0}
  },
  {
    path: '/:actCode/draggable',
    name: 'draggable',
    component: draggable,
    meta: { index: 0}
  },
  {
    path: '/:actCode/invitationLink',
    name: 'invitationLink',
    component: invitationLink,
    meta: { index: -1}
  },
]

const router = new VueRouter({
  base: process.env.VUE_APP_URL,
  mode: 'history',
  routes
})

export default router
