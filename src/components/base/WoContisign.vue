<template>
  <div id="contisign" :style="{backgroundColor:bgcolor,backgroundImage: 'url(' + bgimg + ')'}">
    <div class="content">
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
      <div class="rule" @click.stop="showComponentConfigEditor('rule')">
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

export default {
  name: "WoContisign",
  components: {
    contisignModal
  },
  data() {
    return {
      alreadySignDays: 0,
      days: 7,
      prizeName: "0.5话费券",
      signSuccess: false,
      signSuccessNum: "",
      bgimgExist: false,
      currentModal: "",
      disabled: false
    };
  },
  props: {
    config: {}
  },
  computed: {
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
            "http://h5test.wostore.cn/atp_resource/upload//atpweb/2020/08/10/2394092eb689f5cbc9872c1f30b58151.png";
        } else {
          signsrc =
            "http://h5test.wostore.cn/atp_resource/upload//atpweb/2020/08/10/1d19f6d18536ef01ee2cb02dc18d2459.png";
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
    handleSign() {
      if (this.disabled) return;
      this.$get("/atpapi/act/actUserSign/userSign")
        .then(res => {
          if (res.code === "0000") {
            this.alreadySignDays += 1;
            this.disabled = true;
            this.$toast("签到成功", 1000);
            if (this.alreadySignDays === this.days) {
              this.signSuccess = true;
              this.$bus.$emit("showModal");
              this.currentModal = this.config.modal.signPrize;
              this.$get("/atpapi/act/actUserSign/signNumber").then(response => {
                if (response.code === "0000") {
                  this.signSuccessNum = response.data;
                }
              });
            }
          }
        })
        .catch(err => {});
    }
  },
  mounted() {
    this.$get("/atpapi/act/actUserSign/isOrSign").then(res => {
      if (res.code === "0000") {
        this.disabled = res.data;
      }
    });
    this.$get("/atpapi/act/actUserSign/data").then(res => {
      if (res.code === "0000") {
        this.alreadySignDays= res.data.signCount
      }
    });
    console.log(this.config);
  }
};
</script>
<style lang="scss" scoped>
#contisign {
  width: 0.375rem;
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
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
