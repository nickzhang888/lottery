import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {},
    templateInfo: {},
    status: {},
    buyTimes: {
      residueDegree: "",
      totalNumber: "",
      timestamp: ""
    },
    lotteryAmount: '',
    // isLoading:true,
    //要设置初始值,否则有些地方会有问题
    isCleanUp:''
  },
  getters: {
    bgColor(state, getter) {
      let color = "";
      const actContent = JSON.parse(state.templateInfo.actContent);
      actContent[0].forEach(c => {
        if (c.name === "WoBackgroundColor") {
          color = c.bgcolor;
        }
      });
      return color;
    },
    bgImg(state, getter) {
      let image = "";
      const actContent = JSON.parse(state.templateInfo.actContent);
      actContent[0].forEach(c => {
        if (c.name === "WoBackgroundImg") {
          image = c.src;
        }
      });
      return image;
    },
    isPreview(state) {
      const { onlineStatus } = state.templateInfo;
      if (onlineStatus === 1) {
        return false;
      }
      return true;
    },
  },
  mutations: {
    // updateTemplateInfo(state, data) {
    //   state.templateInfo = {
    //     starttime: "2020-09-01 00:00:00",
    //     endtime: "2020-10-31 00:00:00",
    //     id: 578,
    //     onlineStatus: 1,
    //     title: "九宫格",
    //     wxShareIcon: "https://atp.bol.wo.cn/atp_resource/upload//atp_resource/2020/09/30/a609fcb8b710859b8948df8a89a3b0bd.png",
    //     wxShareText: "九宫格大转盘",
    //     wxShareTitle: "九宫格",
    //     actContent: [
    //       [
    //         {
    //           "name": "WoBackgroundImg",
    //           "cid": "nsl23l7fbyfwvxvvbwhlw",
    //           "src": "https://atp.bol.wo.cn/atp_resource/upload//atp_resource/2021/01/07/2131bff475694b0cb6fae426959205a7.jpg",
    //           "style": {
    //             "width": 375,
    //             "top": 0,
    //             "left": 0,
    //             "borderRadius": 0,
    //             "borderWidth": 0,
    //             "backgroundColor": "#ffffff",
    //             "borderColor": "#cccccc",
    //             "borderStyle": "solid",
    //             "opacity": 1
    //           }
    //         },
    //         {
    //           "name": "WoBackgroundColor",
    //           "cid": "zwfs1r80blgxooyr503ryh",
    //           "bgcolor": "#FFDDBF"
    //         }
    //       ],
    //       {
    //         "name": "WoTurntable",
    //         "cid": "fy7u1xt7u4ckwo25pvat9s",
    //         "editor": "WoTurntableEditor",
    //         "rule": {
    //           "isShowBtn": true,
    //           "isShow": false,
    //           "btntextcolor": "#c93636",
    //           "ruleText": "<p>1、用户需登录“联通话费购”小程序才可以参与抽奖，每日抽奖次数不限；</p><p>2、抽奖机会获得方式：</p><p>&nbsp;&nbsp;&nbsp;a、完成“助力抽奖”里的任务获得免费抽奖机会；</p><p>&nbsp;&nbsp;&nbsp;b、完成“助力抽奖”里的任务获得话费券，使用话费券购买抽奖机会，2元话费券即可购买一次抽奖机会；</p><p>3、当日获得的抽奖机会需在当日使用，次日将被清空，每日可通过话费券购买10次抽奖机会；</p><p>4、奖品内容以当日抽奖转盘展示的为准，用户中奖后，奖品将在24小时内下发至您的抽奖账户，您可查看“我的中奖记录；</p><p>5、若用户中奖内容为卡密商品，“我的中奖记录”里将会展示相应的卡密和兑换链接，请妥善保管并及时兑换，卡密的兑换有效期为30天，因个人原因导致丢失或过期的卡密，平台不予退还补偿；</p><p>6、因操作系统的限制，目前小程序仅支持安卓用户登录访问，给您带来的不便敬请谅解；</p><p>7、抽奖转盘将会不定期更新奖品内容和“助力抽奖”的任务，敬请期待；</p><p>8、活动最终解释权归联通话费购所有，抽奖即同意活动规则，若有问题还请添加话费购客服微信：hfgo10010</p>"
    //         },
    //         "banners": [
    //           {
    //             "size": "355px * 80px",
    //             "src": "https://atp.bol.wo.cn/atp_resource/upload//atpweb/2020/07/28/c0b592ff853e35edd4f9f79df84c4af4.png",
    //             "url": ""
    //           },
    //           {
    //             "size": "355px * 80px",
    //             "src": "https://atp.bol.wo.cn/atp_resource/upload//atpweb/2020/08/13/2431e059e397d03b22615f62e782dbb9.png",
    //             "url": ""
    //           }
    //         ],
    //         "buy": {
    //           "bgColor": "#fff",
    //           "textColor": "#666",
    //           "btntextcolor": "#fff",
    //           "btnbgcolor": "#c93636"
    //         },
    //         "turntable": {
    //           "bgSrc": {
    //             "size": "640px * 640px",
    //             "src": "https://atp.bol.wo.cn/atp_resource/upload//atpweb/2020/09/03/0c71b1e85654571dea53cdcb8cddbf39.png"
    //           },
    //           "pointerSrc": {
    //             "size": "206px * 206px",
    //             "src": "https://atp.bol.wo.cn/atp_resource/upload//atpweb/2020/08/13/1795101f0d62f8b833fd06f597508965.png"
    //           },
    //           "prizes": [
    //             {
    //               "i": 1,
    //               "size": "136px * 136px",
    //               "src": require("assets/1.png")
    //             },
    //             {
    //               "i": 2,
    //               "size": "136px * 136px",
    //               "src": require("../assets/2.png")
    //             },
    //             {
    //               "i": 3,
    //               "size": "136px * 136px",
    //               "src": require("../assets/3.png")
    //             },
    //             {
    //               "i": 4,
    //               "size": "136px * 136px",
    //               "src": require("../assets/baozhen.png")
    //             },
    //             {
    //               "i": 5,
    //               "size": "136px * 136px",
    //               "src": require("../assets/5.png")
    //             },
    //             {
    //               "i": 6,
    //               "size": "136px * 136px",
    //               "src": require("../assets/6.png")
    //             },
    //             {
    //               "i": 7,
    //               "size": "136px * 136px",
    //               "src": require("../assets/7.png")
    //             },
    //             {
    //               "i": 8,
    //               "size": "136px * 136px",
    //               "src": require("../assets/8.png")
    //             }
    //           ]
    //         },
    //         "turntableRecord": {
    //           "size": "220px * 70px",
    //           "src": "https://atp.bol.wo.cn/atp_resource/upload//atpweb/2020/07/28/4af35597289fb72162aa1a5498f3242a.png"
    //         },
    //         "help": {
    //           "size": "220px * 70px",
    //           "src": "https://atp.bol.wo.cn/atp_resource/upload//atpweb/2020/07/28/59671950e85f86bc8132c2ff4bfaf8b5.png"
    //         },
    //         "recordList": {
    //           "title": "#333",
    //           "textColor": "#666",
    //           "backgroundColor": "#fff"
    //         },
    //         "modal": {
    //           "commonConfig": {
    //             "name": "commonTurntableConfig",
    //             "bgImg": "https://atp.bol.wo.cn/atp_resource/upload//atpweb/2020/08/13/dd20b1087227a2e139885f56353988d9.png"
    //           },
    //           "realPrize": {
    //             "name": "realPrize",
    //             "editor": "WoTurntableModalEditor",
    //             "title": "恭喜中奖",
    //             "content": {
    //               "img": "https://atp.bol.wo.cn/atp_resource/upload//atpweb/2020/08/13/c9ca9839e850ea94463c3cb3b5db177a.png",
    //               "smallText": "奖品说明:<span style=\"color:red\">(这里将展示您在活动关联奖品成功后对奖品说明的填写内容，该文案仅供参考)</span><br>请您点击‘领取’按钮将您的收件人姓名、收件人电话、收件人地址填写完整，点击提交之后，工作人员会在10个工作日内将奖品发出，如有疑问请联系XXXXXXXX"
    //             },
    //             "btn": {
    //               "text": "立即领取",
    //               "textColor": "#ff523e",
    //               "btnbgcolor": "linear-gradient(to right, #ffe277, #ffc63b)",
    //               "isShow": true
    //             }
    //           },
    //           "codePrize": {
    //             "name": "codePrize",
    //             "editor": "WoTurntableModalEditor",
    //             "title": "恭喜中奖",
    //             "content": {
    //               "codebg": "https://atp.bol.wo.cn/atp_resource/upload//atpweb/2020/05/26/09c9a35ba35c632baad94b82660aa23d.png",
    //               "cardcode": "XXXXXXXXXXXXXXXX",
    //               "smallText": "奖品说明:<span style=\"color:red\">(这里将展示您在活动关联奖品成功后对奖品说明的填写内容，该文案仅供参考)</span><br> 将券码内容复制后，点击领取按钮进入xxxx-我的卡券，输入兑换码即可完成兑换。如有疑问请联系XXXXXXXX"
    //             },
    //             "btn": {
    //               "text": "立即领取",
    //               "textColor": "#ff523e",
    //               "btnbgcolor": "linear-gradient(to right, #ffe277, #ffc63b)",
    //               "isShow": true
    //             }
    //           },
    //           "againPrize": {
    //             "name": "againPrize",
    //             "editor": "WoTurntableModalEditor",
    //             "title": "恭喜中奖",
    //             "content": {
    //               "img": "https://atp.bol.wo.cn/atp_resource/upload//atpweb/2020/08/13/480f35dcd22f2c076a811e96ded7f7e7.png",
    //               "smallText": "恭喜您抽中再来一次，快来继续抽奖吧！"
    //             },
    //             "btn": {
    //               "text": "再抽一次",
    //               "textColor": "#ff523e",
    //               "btnbgcolor": "linear-gradient(to right, #ffe277, #ffc63b)",
    //               "isShow": true,
    //               "url": ""
    //             },
    //             "bgImg": "https://atp.bol.wo.cn/atp_resource/upload//atpweb/2020/08/13/8269e97ec533aec12356c29e28602d68.png",
    //             "isShow": true
    //           },
    //           "noPrize": {
    //             "name": "noPrize",
    //             "editor": "WoTurntableModalEditor",
    //             "title": "未中奖",
    //             "content": {
    //               "noimg": "https://atp.bol.wo.cn/atp_resource/upload//atpweb/2020/05/11/18b1765aaafef6192d6540e7ca3eb183.png",
    //               "midText": "很遗憾，没有抽中奖品"
    //             },
    //             "btn": {
    //               "text": "知道了",
    //               "textColor": "#ff523e",
    //               "btnbgcolor": "linear-gradient(to right, #ffe277, #ffc63b)",
    //               "isShow": true,
    //               "url": ""
    //             }
    //           },
    //           "hfgoPrize": {
    //             "name": "hfgoPrize",
    //             "editor": "WoTurntableModalEditor",
    //             "title": "恭喜中奖",
    //             "content": {
    //               "img": "https://atp.bol.wo.cn/atp_resource/upload//atpweb/2020/08/11/a72c99e4921d40d9c0c1ea6177302580.png",
    //               "smallText": "奖品说明:<span style=\"color:red\">(这里将展示您在活动关联奖品成功后对奖品说明的填写内容，该文案仅供参考)</span><br>请您点击‘领取’按钮将您的收件人姓名、收件人电话、收件人地址填写完整，点击提交之后，工作人员会在10个工作日内将奖品发出，如有疑问请联系XXXXXXXX"
    //             },
    //             "btn": {
    //               "text": "立即领取",
    //               "textColor": "#ff523e",
    //               "btnbgcolor": "linear-gradient(to right, #ffe277, #ffc63b)",
    //               "isShow": true
    //             }
    //           },
    //           "virtualPrize": {
    //             "name": "virtualPrize",
    //             "editor": "WoTurntableModalEditor",
    //             "title": "恭喜中奖",
    //             "content": {
    //               "img": "https://atp.bol.wo.cn/atp_resource/upload//atpweb/2020/08/13/acdb908494c45583d1493beb1f10c8e6.png",
    //               "smallText": "奖品说明:<span style=\"color:red\">(这里将展示您在活动关联奖品成功后对奖品说明的填写内容，该文案仅供参考)</span><br>请您点击领取按钮，进入xxxxx-xxxxx，即可使用，如有疑问请联系XXXXXXXX"
    //             },
    //             "btn": {
    //               "text": "立即领取",
    //               "textColor": "#ff523e",
    //               "btnbgcolor": "linear-gradient(to right, #ffe277, #ffc63b)",
    //               "isShow": true
    //             }
    //           },
    //           "receipt": {
    //             "name": "receipt",
    //             "editor": "WoTurntableModalEditor",
    //             "title": "收货信息",
    //             "content": {},
    //             "btn": {
    //               "text": "提交",
    //               "textColor": "#ff523e",
    //               "btnbgcolor": "linear-gradient(to right, #ffe277, #ffc63b)",
    //               "isShow": true
    //             }
    //           },
    //           "commonTip": {
    //             "name": "commonTip",
    //             "editor": "WoTurntableModalEditor",
    //             "title": "提示",
    //             "content": {
    //               "noimg": "https://atp.bol.wo.cn/atp_resource/upload/atpweb/2020/05/11/18b1765aaafef6192d6540e7ca3eb183.png",
    //               "midText": "通用提示语"
    //             }
    //           }
    //         },
    //         "ele": "2"
    //       }
    //     ],
    //   }
    // },
    updateUserInfo(state, data) {
      state.userInfo = data
    },
    updateTemplateInfo(state, data) {
      state.templateInfo = data
      state.templateInfo.actActivitySettings.forEach(item => {
        if (item.settingKey === 'is_record_show_type') {
          state.isShowRecordList = JSON.parse(item.settingValue)
        }
        if (item.settingKey === 'is_user_draw_type') {
          state.isShowLotterytimes = JSON.parse(item.settingValue)
        }
        if (item.settingKey === 'is_buy_draw_times') {
          state.isShowBuytimes = JSON.parse(item.settingValue)
        }
        if (item.settingKey === 'is_clean_up_next_day') {
          state.isCleanUp = JSON.parse(item.settingValue)
        }
      })
    },
    saveStatus(state, data) {
      state.status = data
    },
    saveLotteryAmount(state, data) {
      state.lotteryAmount = data;
    },
    saveBuyTimes(state, data) {
      state.buyTimes = data
      if (state.buyTimes.residueDegree == -1) {
        state.buyTimes.residueDegree = "不限";
      }
      if (state.buyTimes.totalNumber == -1) {
        state.buyTimes.totalNumber = "不限";
      }
    },
    // changeLoad(state,data){
    //   state.isLoading = data
    // }
  },
  actions: {
    async getUserInfo({ commit }) {
      const { data } = await axios.get('/atpapi/users')
      commit('updateUserInfo', data.data)
    },
    getTemplateInfo({ commit }, actCode) {
      return axios.get(`/atpapi/act/lottery/init/${actCode}`).then((res) => {
        if (res.data.code === '0000') {
          // setTimeout(() => {
          //   commit('changeLoad', false)
          // }, 500)
          commit('updateTemplateInfo', res.data.data)
        }
        return res
      })
    },
    async getStatus({ commit }, str) {
      const { data } = await axios.post(`/atpapi/share/click?sign=${str}`)
      commit("saveStatus", data.code)
      return data
    },
    async getBuyTimes({ commit }, actId) {
      //获取购买次数
      const { data } = await axios.get(`/atpapi/hfgo/residueDegree?actId=${actId}`)
      if (data.code === "0000") {
        commit("saveBuyTimes", data.data)
      }
    },
    async getAmount({ commit }, { actId }) {
      //获取抽奖次数
      const { data } = await axios.get(
        `/atpapi/act/record/residueCount?actId=${actId}`
      );
      if (data.code === "0000") {
        commit("saveLotteryAmount", data.data)
      }
    }
  },
  modules: {
  }
})
