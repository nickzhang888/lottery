<template>
  <div id="contisign" :style="{backgroundColor:bgcolor,backgroundImage: 'url(' + bgimg + ')'}">
    <previewTips :isPreview="isPreview"></previewTips>
    <div class="previewWarning" v-if="isPreview">
      {{previewWarning}}
    </div>
    <div class="content">
      <div class="href_part">
        <img src="../../assets/out.png" @click="goBack" class="left" />
        <p>每日签到</p>
      </div>
      <img class="banner" :src="config.banner.src" />
      <div class="alreadyText">您已连续签到{{alreadySignDays}}天</div>
      <div class="signtable">
        <div
          class="signitem"
          v-for="(day,i) in days"
          :key="i"
          :style="{backgroundColor:signitembg(i),border:signitemborder(i)}"
        >
          <div class="day" :style="{color:signitemtxt(i)}">Day{{i+1}}</div>
          <img :src="signlogo(i)" height="28" width="42" alt />
        </div>
      </div>
      <div
        class="signNum"
        :style="{color:config.signcss.bgcolor}"
        v-show="signSuccess"
      >您是今日第{{signSuccessNum}}位获得签到奖励的人</div>
      <div
        class="tips"
        :style="{color:config.signcss.bgcolor, marginTop: margintop}"
      >*连续签到{{days}}天不间断，奖励{{prizeName}}</div>
      <div
        class="btns"
        :style="{backgroundColor:disabled?'#808080':config.signcss.bgcolor}"
        @click="handleSign"
      >{{isSign}}</div>
      <div class="rule">
        <div class="ruletitle" :style="{color:config.rule.titleColor}">规则说明：</div>
        <div
          :style="{color:config.rule.contentColor}"
          class="rulecontent"
          v-html="config.rule.ruleText"
        ></div>
      </div>
    </div>
    <contisignModal :config="currentModal" :commonContisignConfig="config.modal['commonConfig']"></contisignModal>
  </div>
</template>
<script>
import contisignModal from "./Contisignmodal.vue";
import utils from "../../utils/utils";
import previewTips from '../previewTips.vue'
export default {
  name: "WoContisign",
  components: {
    contisignModal,
    previewTips
  },
  data() {
    return {
      previewWarning: this.actCode === 'ACT202009102024187840004LUpRPx' ? '当前为模板预览模式，请勿将链接泄漏外传。' : '当前为测试预览模式，请勿将链接泄漏外传。',
      alreadySignDays: 0,
      days: 7,
      prizeName: "",
      signSuccess: false,
      signSuccessNum: "",
      bgimgExist: false,
      currentModal: "",
      disabled: false,
      isLogin: false,
      actId:""
    };
  },
  props: {
    config: {}
  },
  computed: {
    isPreview() {
      const { onlineStatus } = this.$store.state.templateInfo
      if ( onlineStatus=== 1) {
        return false
      }
      // 用于生成的预览图的链接
      if (this.$route.query.gpp === '1') {
        this.config.banners.length = 1
        return false
      }
      return true
    },
    isSign() {
      let text;
      text = this.disabled ? "今日已签到" : "签到";
      return text;
    },
    signlogo() {
      return function(i) {
        let signsrc;
        if (i < this.alreadySignDays) {
          signsrc =
            `${process.env.VUE_APP_PREURL}atp_resource/upload//atpweb/2020/08/10/2394092eb689f5cbc9872c1f30b58151.png`;
        } else {
          signsrc =
            `${process.env.VUE_APP_PREURL}atp_resource/upload//atpweb/2020/08/10/1d19f6d18536ef01ee2cb02dc18d2459.png`;
        }
        return signsrc;
      };
    },
    signitemborder() {
      return function(i) {
        let signbordercolor;
        if (i < this.alreadySignDays) {
          signbordercolor = `1px solid ${this.config.signcss.bgcolor}`;
        } else {
          signbordercolor = "1px solid #808080";
        }
        return signbordercolor;
      };
    },
    signitemtxt() {
      return function(i) {
        let signitemtxtcolor;
        if (i < this.alreadySignDays) {
          signitemtxtcolor = "#fff";
        } else {
          signitemtxtcolor = "#808080";
        }
        return signitemtxtcolor;
      };
    },
    signitembg() {
      return function(i) {
        let signitembgcolor;
        if (i < this.alreadySignDays) {
          signitembgcolor = this.config.signcss.bgcolor;
        } else {
          signitembgcolor = "#fff";
        }
        return signitembgcolor;
      };
    },
    margintop() {
      let marginTop;
      if (this.signSuccess) {
        marginTop = "0.45rem";
      } else {
        marginTop = "0.82rem";
      }
      return marginTop;
    },
    bgcolor() {
      let color = "";
      const value = JSON.parse(this.$store.state.templateInfo.actContent);
      value[0].forEach(c => {
        if (c.name === "WoBackgroundColor") {
          color = c.bgcolor;
        }
      });
      return color;
    },
    bgimg() {
      let bgimage = "";
      const value = JSON.parse(this.$store.state.templateInfo.actContent);
      value[0].forEach(c => {
        if (c.name === "WoBackgroundImg") {
          if (c.src) {
            this.bgimgExist = true;
          }
          bgimage = c.src;
        }
      });
      return bgimage;
    }
  },
  methods: {
    goBack() {
      history.go(-1);
    },
    async getSign() {
      const params = {
        actId: this.actId,
        actSetId: this.$route.query.actSetId,
        imgUrl: this.$route.query.imgUrl,
        targetActId: this.$route.query.actId
      };
      let res = await this.$post("/atpapi/share/getSign", { ...params });
      return res;
    },
    signNumber(){
      this.$get(
           `/atpapi/act/actUserSign/signNumber?actId=${this.actId}`
         ).then(res => {
           if (res.code === "0000") {
             this.signSuccessNum = res.data;
           } else {
             this.$toast(res.message, 3000);
           }
         });
    },
    handleSign() {
      if (this.disabled) return;
        this.getSign().then(response => {
         this.$get(`/atpapi/act/actUserSign/userSign?sign=${response.data}`)
          .then(res => {
            if (res.code === "0000") {
              this.alreadySignDays += 1;
              this.disabled = true;
              this.alreadySignDays === this.days ? "" : this.$toast("签到成功", 1000);
              if (this.alreadySignDays === this.days) {
                this.signSuccess = true;
                const prizename = res.data.name;
                this.$bus.$emit("showModal", prizename, this.days);
                this.currentModal = this.config.modal.signPrize;
                this.signNumber()
              }
            } else {
              this.$toast(res.message, 3000);
            }
          })
          .catch(err => {});
        });
    }
  },
  mounted() {
    this.actId = this.$store.state.templateInfo.id;
    this.days = this.$store.state.templateInfo.signDay
    this.token = utils.getCookie("atpAuthToken");
    if (this.token) {
      this.isLogin = true;
      this.$nextTick(() => {
        // 今日是否已签到
        this.$get(`/atpapi/act/actUserSign/isOrSign?actId=${this.actId}`).then(
          res => {
            if (res.code === "0000") {
              this.disabled = res.data;
            } else {
              this.$toast(res.message, 3000);
            }
          }
        );
        this.$get(`/atpapi/act/actUserSign/data?actId=${this.actId}`).then(res => {
          if (res.code === "0000") {
            this.alreadySignDays = res.data ? res.data.signCount : 0;
            if (this.alreadySignDays === this.days) {
                this.signSuccess = true;
                this.signNumber()
            }
          } else {
            this.$toast(res.message, 3000);
          }
        });
      });
    }

    console.log(this.config);
    this.prizeName = this.$store.state.templateInfo.actActivityPrizes[0].prizeName;
  }
};
</script>
<style lang="scss" scoped>
#contisign {
  width: 0.375rem;
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  .previewWarning{
    text-align: center;
    background-color: rgba(0,0,0,.6);
    position: fixed;
    font-size: .16rem;
    color: #fff;
    width: 3.75rem;
    height: .4rem;
    line-height: .4rem;
    z-index: 10;
  }
  .href_part {
    height: 0.43rem;
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
      //   font-weight: 600;
      color: #333;
      margin-left: 1rem;
    }
  }
  .bg {
    width: 100%;
  }
  .bg-img {
    width: 100%;
  }
  .content {
    position: absolute;
    .banner {
      width: 100%;
      height: 0.97rem;
      display: block;
      background-repeat: no-repeat;
      background-size: cover;
      margin: 0 auto 0.3rem;
      z-index: 0;
    }
    .alreadyText {
      font-size: 0.14rem;
      color: #333;
      font-family: SimHei;
      text-align: center;
      font-weight: 600;
    }
    .signtable {
      display: flex;
      justify-content: space-between;
      width: 3.45rem;
      margin: 0.2rem auto 0;
      .signitem {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 0.4rem;
        height: 0.4rem;
        border-radius: 0.02rem;
        .day {
          padding-top: 0.04rem;
          font-size: 0.12rem;
        }
        img {
          width: 0.21rem;
          height: 0.14rem;
          padding-top: 0.01rem;
        }
      }
    }
    .signNum {
      font-size: 0.16rem;
      text-align: center;
      margin-top: 0.37rem;
    }
    .tips {
      font-size: 0.12rem;
      text-align: center;
    }
    .btns {
      color: #fff;
      width: 1.5rem;
      height: 0.4rem;
      margin: 0.15rem auto 0.3rem;
      border-radius: 0.2rem;
      text-align: center;
      font-size: 0.18rem;
      line-height: 0.4rem;
      img {
        width: 0.15rem;
        height: 0.4rem;
      }
    }
    .rule {
      width: 3.3rem;
      margin: 0 auto;
      .ruletitle {
        font-size: 0.14rem;
        font-weight: 600;
        padding-bottom: 0.02rem;
      }
      .rulecontent {
        font-size: 0.12rem;
        line-height: 0.18rem;
      }
    }
  }
}
</style>
