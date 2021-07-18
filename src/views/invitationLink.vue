<template>
  <div class="previewTips">
    <div class="top">
      <div class="title">Hi，“{{nickname}}”</div>
      <div class="text" v-if="$store.state.status=='0000'">
        送你一次抽奖机会，
        <br />话费、优惠券、视频会员任你抽。
      </div>
      <div class="text" v-else-if="$store.state.status=='4041'">今天已经帮好友助力过了</div>
      <div class="text" v-else-if="$store.state.status=='4043'">只能把活动分享给好友才可以获得奖励哦~</div>
      <div class="text" v-else>助力失败，请稍后再试</div>
    </div>
    <div class="iknow" @click="goLottery" v-if="$store.state.status=='0000'">去抽奖</div>
    <div class="iknow" @click="goLottery" v-else>查看更多</div>
  </div>
</template>
<script>
import utils from "../utils/utils";
import axios from "axios";
export default {
  data() {
    return {
      isShow: false,
      nickname: "亲爱的用户"
    };
  },
  created() {
    this.token = utils.getCookie("atpAuthToken");
    this.$get("/atpapi/users")
      .then(res => {
        this.nickname = res.data.nickName;
      })
      .catch(err => {
        this.clickBtn();
      });
  },
  computed: {
    getPath() {
      var arr = window.location.pathname.split("/");
      return arr.splice(0, arr.length - 1).join("/") + "/";
    },
    fullPath() {
      var origin = window.location.origin,
        path = this.getPath;
      return origin + path;
    }
  },
  methods: {
    goLottery() {
      this.$router.push({
        name: "home"
      });
    },
    clickBtn() {
      let backUrl = encodeURIComponent(
        `https://account.bol.wo.cn/oauth?clientId=activetemplate&redirectUrl=${encodeURIComponent(
          location.href
        )}&state=${encodeURIComponent(7)}`
      );
      let wxLoginUrl = `http://wxwsd.wostore.cn/index.php?s=/Api/Data/getWxOauth&state=7&scope=2&backUrl=${backUrl}`;
      window.location.href = wxLoginUrl;
    }
  }
};
</script>
<style lang="scss" scoped>
.previewTips {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f6f7fb;
  overflow: scroll;
  z-index: 999;
  .top {
    display: flex;
    align-items: center;
    flex-direction: column;
    .title {
      font-size: 0.18rem;
      padding-top: 2.2rem;
      font-weight: 900;
    }
    .text {
      text-align: center;
      font-size: 0.16rem;
      padding-top: 0.1rem;
      font-weight: 700;
    }
  }

  .iknow {
    width: 2.55rem;
    height: 0.36rem;
    margin: 2.2rem auto 0.2rem;
    background-color: #c93636;
    color: #fff;
    border-radius: 0.18rem;
    font-size: 0.18rem;
    text-align: center;
    line-height: 0.36rem;
  }
}
</style>