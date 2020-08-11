import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {},
    templateInfo: {},
    lotteryAmount: "",
    missionSupport:[]
  },
  mutations: {
    updateUserInfo(state, data) {
      state.userInfo = data
    },
    updateTemplateInfo(state, data) {
      state.templateInfo = data
    },
    lotteryAmount(state, data) {
      state.lotteryAmount = data
    },
    missionSupport(state, data) {
      state.missionSupport = data
    },
  },
  actions: {
    async getUserInfo({ commit }) {
      const { data } = await axios.get('/atpapi/users')
      commit('updateUserInfo', data.data)
    },
    async getAmount({ commit }, id) {
      const res = await axios.get(`/atpapi/act/record/residueCount?actId=${id}`)
      if (res.data.code === '0000') {
        commit('lotteryAmount', res.data.data)
      }
    },
    async getMission({ state, commit }) {
      const actid = state.templateInfo.id;
      const res = await axios.get(`/atpapi/lottery/powerTask/${actid}`)
      if (res.data.code === '0000') {
        commit('missionSupport', res.data.data)
      }
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
