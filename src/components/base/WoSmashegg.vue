<template>
  <div id="turntable" :style="{backgroundColor:bgColor,backgroundImage: 'url(' + bgImg + ')'}">
    <previewTips :isPreview="isPreview"></previewTips>
    <div class="previewWarning" v-if="isPreview">{{previewWarning}}</div>
    <div class="content">
      <div
        class="buyTimes"
        :style="{backgroundImage: 'url(' + config.buy.buybg + ')'}"
        v-if="isShowBuytimes"
      >
        <div
          class="currentTimes"
          :style="{color:config.buy.textColor}"
        >{{isLogin?`还可购买${buyTimes.residueDegree}次抽奖机会（每日最多可买${buyTimes.totalNumber}次）`:'每日最多可买10次抽奖机会' }}</div>
        <div
          class="buyBtn"
          :style="{backgroundColor:config.buy.btnbgcolor, color:config.buy.btntextcolor}"
          @click="goBuy"
        >{{isLogin?"去购买":"去看看"}}</div>
      </div>
      <div
        class="timestxt"
        :style="{color:config.times.color}"
        v-if="isLogin && isShowLotterytimes"
      >您还有{{lotteryAmount}}次砸蛋机会</div>
      <div
        class="rulebtn"
        @click="showrule"
        :style="{backgroundColor:config.rule.rulebgcolor, color:config.rule.btntextcolor}"
        v-show="config.rule.isShowBtn"
        @touchmove.prevent.stop
      >活动规则</div>
      <div class="lotteryarea">
        <div
          :class="currentEgg=='1'?'hammer left':currentEgg=='2'?'hammer center':currentEgg=='3'?'hammer right':'hammer move'"
        >
          <img :src="config.lotteryarea.hammer.src" />
        </div>
        <div class="eggarea">
          <div
            :class="item.id==1? 'eggside left':(item.id==2?'eggcenter':'eggside right')"
            v-for="(item) in glodenEggs"
            :key="item.id"
            @click="handleClick(item.id)"
          >
            <div :class="currentEgg==item.id?'egg broken':'egg'">
              <img :src="currentEgg==item.id? item.brokenSrc:item.src" />
            </div>
            <div class="eggbase">
              <img :src="config.lotteryarea.eggbase.src" class="eggbase" />
            </div>
          </div>
        </div>
      </div>
      <div :class="powerTask>0||!token?'btns':'centerBtns'">
        <img :src="config.turntableRecord.src" @click="winRecord" alt />
        <img :src="config.help.src" @click="helpDraw" v-if="powerTask>0||!token" alt />
      </div>
      <div class="timesclear" :style="{color:config.times.color}" v-if="lotteryAmount && isCleanUp">
        <img src="../../assets/Icon-tishi.png" height="28" width="28" alt />
        您的抽奖机会将于
        <van-count-down :time="buyTimes.timestamp" style="display:inline-block">
          <template v-slot="timeData">
            <span class="block">
              <span v-show="timeData.hours<10">0</span>{{ timeData.hours}}
            </span>
            <span class="colon">:</span>
            <span class="block">
              <span v-show="timeData.minutes<10">0</span>{{ timeData.minutes }}
            </span>
            <span class="colon">:</span>
            <span class="block">
              <span v-show="timeData.seconds<10">0</span>{{ timeData.seconds }}
            </span>
          </template>
        </van-count-down>后清空，请及时使用！
      </div>
    </div>
    <SmasheggModal
      :config="currentModal"
      :commonturntableConfig="config.modal['commonConfig']"
      ref="turnModal"
    ></SmasheggModal>
    <TurntableRule :config="config" ref="rule" ></TurntableRule>
  </div>
</template>
<script>
import previewTips from "../previewTips.vue";
import { mapState,mapGetters } from "vuex";
import { mixin } from "@/mixin/mixin.js"
export default {
  name: "WoSmashegg",
  components: {
    previewTips,
  },
  mixins:[mixin],
  data() {
    return {
      powerTask:0,
      glodenEggs: [
        {
          id: 1,
          src: this.config.lotteryarea.egg.src,
          brokenSrc: this.config.lotteryarea.brokenegg.src
        },
        {
          id: 2,
          src: this.config.lotteryarea.egg.src,
          brokenSrc: this.config.lotteryarea.brokenegg.src
        },
        {
          id: 3,
          src: this.config.lotteryarea.egg.src,
          brokenSrc: this.config.lotteryarea.brokenegg.src
        }
      ],
      previewWarning:
        this.actCode === "ACT2020091019553735900081rSbth"
          ? "当前为模板预览模式，请勿将链接泄漏外传。"
          : "当前为测试预览模式，请勿将链接泄漏外传。",
      currentEgg: "",
      shareOption: {
        title: "",
        desc: "",
        link: "",
        imgUrl: ""
      },
      click_flag: true,
      isRight:false
    };
  },
  props: {
    config: {}
  },
  computed: {
    ...mapState([
      "templateInfo",
      "isShowLotterytimes",
      "isCleanUp",
      "isShowBuytimes",
      'buyTimes',
      'lotteryAmount',
    ]),
    ...mapGetters([
      'bgImg',
      'bgColor',
      'isPreview'
    ])
  },
  methods: {
    handleClick(value) {
      if (this.isLogin) {
        if (!this.lotteryAmount && this.powerTask > 0) {
          //有助力任务,但没有砸蛋的次数
          const message = this.getMsg();
          if (!message) return;
          this.goHelp();
          // this.$toast("您没有砸蛋机会,快去助力抽奖吧!")
        } else {
          if (!this.click_flag) return;
          this.startLottery();
          //进行砸蛋操作
          this.currentEgg = value;
        }
      } else {
        this.$utils.goLogin();
      }
    },
    startLottery() {
      const { actCode } = this.$route.params;
      const { onlineStatus } = this.templateInfo;
      const version = "v1";
      // 0是已上线，1是未上线、已下线
      this.type = onlineStatus == 1 ? 0 : 1
      if (!this.click_flag) return;
      this.click_flag = false;
      this.$get(
        `/atpapi/act/lottery/start/${version}/actPath/${actCode}/${this.type}`
      ).then(res => {
        if (res.code === "0000") {
          if (res.data) {
            setTimeout(() => {
              this.click_flag = true;
              this.$bus.$emit("showModal");
              this.currentEgg = ""
              this.getAmount();
            }, 500);
            // prizeType 1:实物 2:卡券 3:虚拟 4:未中奖 5:再来一次 6话费购直充 7积分
            switch (res.data.prizeType){
              case 1:
                this.getModal('realPrize',res.data)
                this.currentModal.content.seq = res.data.seq;
                break;
              case 2:
                this.getModal('codePrize',res.data)
                this.currentModal.content.cardcode = res.data.prizeCode;
                this.currentModal.content.img = '';
                break;
              case 3:
                this.getModal('virtualPrize',res.data)
                break;
              case 4:
                this.currentModal = this.config.modal.noPrize;
                break;
              case 5:
                this.getModal('againPrize',res.data)
                break;
              case 6:
                this.getModal('hfgoPrize',res.data)
                this.currentModal.btn.text = res.data.btnText;
                break;
              case 7:
                this.getModal('againPrize',res.data)
                this.currentModal.btn.text = "立即领取";
                break;
            }
          } else {
            this.exceptionTips(res)
          }
        } else {
          this.exceptionTips(res)
        }
      });
    },
    getModal(name,data){
       this.currentModal = this.config.modal[name]
       this.currentModal.content.img = data.prizeImg;
       this.currentModal.content.smallText = data.prizeDesc;
       this.currentModal.btn.url = data.url;
    },
    exceptionTips(res){
      // 异常通用提示信息
      this.currentModal = this.config.modal.commonTip;
      this.currentModal.content.midText = res.message;
      this.$bus.$emit("showModal");
      setTimeout(() => {
        this.click_flag = true;
        this.currentEgg = ""
      }, 100);
    },
    
  },
  created() {
     console.log(this.isRight,"组件");
   
  }
};
</script>
<style lang="scss" scoped>
#turntable {
  width: 3.75rem;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  .previewWarning {
    text-align: center;
    background-color: rgba(0, 0, 0, 0.6);
    position: fixed;
    font-size: 0.16rem;
    color: #fff;
    width: 3.75rem;
    height: 0.4rem;
    line-height: 0.4rem;
    z-index: 100;
  }
  .bg {
    width: 100%;
  }
  .bg-img {
    width: 100%;
  }
  .content {
    position: absolute;
    width: 3.75rem;
    top: 0.1rem;
    .rulebtn {
      font-size: 0.12rem;
      padding-left: 0.08rem;
      padding-top: 0.04rem;
      width: 0.2rem;
      height: 0.68rem;
      border-radius: 0.1rem 0.02rem 0.02rem 0.1rem;
      position: absolute;
      top: 1.5rem;
      right: 0;
      line-height: 0.15rem;
    }
    .lotteryarea {
      position: relative;
      margin-top: 3.3rem;
      height: 1.96rem;
      .hammer {
        position: absolute;
        right: 1.1rem;
        top: -0.3rem;
        z-index: 10;
        width: 0.79rem;
        img {
          width: 0.79rem;
          height: 1.1rem;
        }
        &.left {
          left: 0.82rem;
          top: -0.5rem;
        }
        &.center {
          right: 1.1rem;
          top: -0.1rem;
        }
        &.right {
          right: 0;
          top: -0.5rem;
        }
        &.move {
          animation: turn 1s linear infinite;
          transform-origin: 75% 70%;
        }
      }
      @keyframes turn {
        0% {
          -webkit-transform: rotate(-50deg);
        }

        25% {
          -webkit-transform: rotate(-20deg);
        }
        50% {
          -webkit-transform: rotate(20deg);
        }
        75% {
          -webkit-transform: rotate(-20deg);
        }
        100% {
          -webkit-transform: rotate(-50deg);
        }
      }
      .eggarea {
        .eggside {
          width: 1.41rem;
          height: 1.56rem;
          position: absolute;
          top: 0px;
          &.left {
            left: 0.1rem;
          }
          &.right {
            right: 0.1rem;
          }
          .egg {
            img {
              width: 0.92rem;
              height: 1.14rem;
            }
            z-index: 1;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            &.broken {
              top: -11%;
              img {
                width: 1.22rem;
                height: 1.33rem;
              }
            }
          }
          .eggbase {
            img {
              width: 1.25rem;
              height: 0.61rem;
            }
            position: absolute;
            left: 0.04rem;
            bottom: 0.03rem;
          }
        }
        .eggcenter {
          width: 1.66rem;
          height: 1.84rem;
          position: absolute;
          left: 50%;
          transform: translate(-50%, 18%);
          z-index: 1;
          .egg {
            img {
              width: 1.08rem;
              height: 1.34rem;
            }
            z-index: 1;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            &.broken {
              top: -12%;
              img {
                width: 1.44rem;
                height: 1.57rem;
              }
            }
          }
          .eggbase {
            img {
              width: 1.47rem;
              height: 0.72rem;
            }
            position: absolute;
            left: 0.04rem;
            bottom: 0.04rem;
          }
        }
      }
    }
    .buyTimes {
      border-radius: 0.08rem;
      // margin:268px auto 0px;
      position: absolute;
      top: 2.68rem;
      left: 50%;
      transform: translateX(-50%);
      background-repeat: no-repeat;
      background-size: contain;
      width: 3.32rem;
      height: 0.52rem;
      color: #666;
      font-size: 0.12rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .currentTimes {
        padding-left: 0.15rem;
      }
      .buyBtn {
        margin-right: 0.15rem;
        width: 0.55rem;
        height: 0.2rem;
        // background-color: #c93636;
        color: #fff;
        border-radius: 0.1rem;
        line-height: 0.2rem;
        text-align: center;
      }
    }
    .timestxt {
      position: absolute;
      top: 3.25rem;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.14rem;
    }
    .timesclear {
      font-size: 0.14rem;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      img {
        width: 0.14rem;
        height: 0.14rem;
        padding-right: 0.03rem;
      }
      .colon {
        display: inline-block;
        margin: 0 0.01rem;
        color: #fcaf33;
      }
      .block {
        display: inline-block;
        width: 0.18rem;
        color: #fff;
        font-size: 0.12rem;
        text-align: center;
        background-color: #fcaf33;
        border-radius: 0.03rem;
      }
    }
    .turn {
      position: relative;
      margin: 0 auto;
      width: 3.15rem;
      height: 3.15rem;
      background-repeat: no-repeat;
      background-size: cover;
      display: flex;
      justify-content: center;
      align-items: center;
      .pointer {
        display: block;
        width: 0.84rem;
        // margin-top: -25px;
        position: relative;
        z-index: 10;
      }
      .btntext {
        color: #fff;
        position: absolute;
        z-index: 10;
        top: 0.24rem;
        left: 0.1rem;
        font-size: 0.16rem;
      }
      .lotteryTimes {
        z-index: 10;
        top: 0.45rem;
        left: 0.11rem;
        font-size: 0.12rem;
        color: #fff;
        position: absolute;
      }
      .prize {
        width: 100%;
        height: 100%;
        position: absolute;
        img {
          position: absolute;
          width: 0.83rem;
          height: 0.83rem;
        }
      }
    }
    .btns {
      width: 3.3rem;
      margin: 0.18rem auto 0.05rem;
      display: flex;
      justify-content: space-between;
      img {
        width: 1.65rem;
        height: 0.61rem;
      }
    }
    .centerBtns{
      width: 2.6rem;
      margin: 0.18rem auto 0.05rem;
      text-align: center;
      img {
        width: 1.65rem;
        height: 0.61rem;
      }
    }
    .recordList {
      width: 3.55rem;
      height: 2.61rem;
      margin: 0 auto;
      border-radius: 0.08rem;
      .recordTitle {
        height: 0.35rem;
        line-height: 0.35rem;
        font-size: 0.16rem;
        color: #333;
        text-align: center;
        border-bottom: 1px solid #e6e6e6;
      }
      .recordContent {
        margin-top: 0.15rem;
        margin-left: 0.25rem;
        .recordItem {
          display: flex;
          align-items: center;
          margin-bottom: 0.1rem;
          font-size: 0.12rem;
          .recordPrize {
            padding-left: 0.45rem;
          }
        }
      }
    }
  }
}
</style>
