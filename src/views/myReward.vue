<template>
  <div class="container">
    <!-- <div class="fixTop">
      <img src="../assets/out.png" @click="goBack" class="left" />
      <p>我的奖励</p>
    </div>-->
    <div class="myBac">
      <div class="title" v-if="status==4050 && currentEnv !=='notWeChat'">您已经领取过奖励了哦~</div>
      <div class="title" v-if="status==4051 && currentEnv !=='notWeChat'">恭喜你获得一次抽奖机会~</div>
      <div class="text" v-if="status==4050 && currentEnv !=='notWeChat'">还有更多的福利可以参与</div>
      <div class="text" v-if="status==4051 && currentEnv !=='notWeChat'">多重好礼任你抽</div>
      <div class="tips" v-if="currentEnv =='notWeChat' || !token ">在微信内关注公众号，
        <br/>点击领取链接才能获得奖励哦~</div>
      <button class="bottomButton" v-if="status==4050 && currentEnv !=='notWeChat'" @click="handleClick">去看看</button>
      <button class="bottomButton" v-if="status==4051 && currentEnv !=='notWeChat'" @click="goHome">立即使用</button>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      status: "",
      redirectUrl: "",
      actId: "",
      currentEnv: "",
      token:""
    };
  },
  methods: {
    goHome() {
      this.$router.push({
        name: "home"
      });
    },
    goBack() {
      history.go(-1);
    },
    handleClick() {
      location.href = this.redirectUrl;
    },
    judgeEv() {
      const ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        // ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
        wx.miniProgram.getEnv(res => {
          if (res.miniprogram) {
            //小程序
            this.currentEnv = "smallRoutine";
          } else {
            //微信
            this.currentEnv = "notSmallRoutine";
          }
        });
      } else {
        this.currentEnv = "notWeChat";
      }
       console.log(this.currentEnv);
    },
    async getInfo() {
      const { actCode } = this.$route.params;
      const res = await this.$get(`/atpapi/act/lottery/init/${actCode}`);
      if (res.code === "0000") {
        this.actId = res.data.id;
      }
      const response = await this.$get(`/atpapi/lottery/powerTask/${this.actId}`);
      if (response.code === "0000") {
        let value = response.data.find(item => item.setKey.includes("follow_wx_account0"));
        this.redirectUrl = value?.redirectUrl;
      }
      const res2 = await this.$get(`/atpapi/hfgo/officialAccounts/${actCode}`);
      this.status = res2.code;
    }
  },
  created() {
    this.token = this.$utils.getCookie('atpAuthToken')
    this.judgeEv()
    this.getInfo();
  }
};
</script>
<style lang="scss" scoped>
.container {
  .fixTop {
    height: 0.43rem;
    width: 100%;
    background-color: #fff;
    display: flex;
    align-items: center;
    .left {
      width: 0.2rem;
      height: 0.2rem;
      margin-left: 0.3rem;
    }
    p {
      font-size: 0.18rem;
      color: #333;
      margin-left: 1rem;
    }
  }
  .myBac {
    text-align: center;
    // height: calc(100vh - 0.43rem);
    height: 100vh;
    background: url(../assets/myReward.png) no-repeat center/100% 100%;
    .title {
      font-size: 0.22rem;
      font-weight: 700;
      color: #c93636;
      padding-top:68vh;
    }
    .text {
      font-size: 0.14rem;
      padding-top:0.19rem;
    }
    .tips{
      font-size: 0.16rem;
      padding-top:68vh;
    }
    .bottomButton {
      margin-top:0.45rem;
      width: 1.17rem;
      height: 0.36rem;
      font-size: 0.18rem;
      color: #fff;
      background: #d53535;
      border: none;
      border-radius: 0.2rem;
      text-align: center;
    }
  }
}
</style>