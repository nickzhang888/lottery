import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {},
    templateInfo: {},
  },
  mutations: {
    updateUserInfo(state, data) {
      state.userInfo = data
    },
    updateTemplateInfo(state, data) {
      state.templateInfo = data
    },
  },
  actions: {
    async getUserInfo({ commit }) {
      const { data } = await axios.get('/atpapi/users')
      commit('updateUserInfo', data.data)
    },
    getTemplateInfo({ commit }, actCode) {
      return axios.get(`/atpapi/act/lottery/init/${actCode}`).then((res) => {
        if (res.data.code === '0000') {
          console.log(res)
          commit('updateTemplateInfo', res.data.data)
        }
        return res
      })
    }
  },
  modules: {
  }
})
