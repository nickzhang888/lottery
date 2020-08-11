<template>
  <div id="turntable" :style="{backgroundColor:bgcolor,backgroundImage: 'url(' + bgimg + ')'}">
    <div class="content">
      <swiper
        :options="swiperOption"
        ref="mySwiper"
        class="banner"
        v-if="config.banners.length > 1"
      >
        <swiper-slide v-for="(banner,i) in config.banners" :key="i">
          <img class="banner" :src="banner.src" />
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
      <img class="banner" v-if="config.banners.length === 1" :src="config.banners[0].src" />
      <div class="buyTimes" @click.stop="bugTimes" :style="{backgroundColor:config.buy.bgColor}">
        <div
          class="currentTimes"
          :style="{color:config.buy.textColor}"
        >还可购买{{leftTimes}}次抽奖机会（每日最多可买10次）</div>
        <div
          class="buyBtn"
          :style="{backgroundColor:config.buy.btnbgcolor, color:config.buy.btntextcolor}"
        >去购买</div>
      </div>
      <div :style="`background-image: url(${config.turntable.bgSrc.src})`" class="turn">
        <div style="position:relative">
          <img :src="config.turntable.pointerSrc.src" class="pointer" />
          <div class="btntext" @click.stop="handleConfirm">点击抽奖</div>
          <div class="lotteryTimes" @click.stop="handleConfirm">还可抽{{$store.state.lotteryAmount}}次</div>
        </div>
        <div class="prize">
          <img
            :key="index"
            :src="img.src"
            :style="prizePosition(index)"
            v-for="(img, index) in config.turntable.prizes"
            :class="active===index?'item-active':''"
          />
        </div>
      </div>
      <div class="btns">
        <img :src="config.turntableRecord.src" @click.stop="winRecord" alt />
        <img :src="config.help.src" @click.stop="helpDraw" alt />
      </div>
      <div class="recordList" :style="{backgroundColor: config.recordList.backgroundColor}">
        <div class="recordTitle" :style="{color:config.recordList.title}">中奖榜单（实时更新）</div>
        <!-- <div >
            <div class="recordContent" :style="{color:config.recordList.textColor}">
              <div class="recordItem" v-for="(item,index) in records" :key="index">
                <div class="recordPhone">{{item.phone}}</div>
                <div class="recordPrize">获得“{{item.prize}}”</div>
              </div>
            </div>
            <div class="recordContent1" style="display:none"></div>
        </div>-->
        <div class="main" :style="{color:config.recordList.textColor}" ref="main">
          <ul class="show1" ref="show1">
            <li v-for="(item,index) in records" :key="index">
              <span class="phone">{{item.phone}}</span>
              <span class="prize">获得“{{item.priceName}}”</span>
            </li>
          </ul>
          <ul class="show2" ref="show2"></ul>
        </div>
      </div>
      <van-popup v-model="isDisplay" class="popInfo">
        <div class="mainBody">
          <h3 class="systemTip">温馨提示</h3>
          <div class="confirm">确定要开奖吗?</div>
        </div>
        <div class="bottomButton">
          <span @click="handleClose">取消</span>
          <span @click="startLottery">确定</span>
        </div>
      </van-popup>
    </div>
    <turntableModal :config="currentModal" :commonturntableConfig="config.modal['commonConfig']"></turntableModal>
  </div>
</template>

<script>
import TurntableModal from "./TurntableModal.vue";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import utils from "../../utils/utils";

// var swiperIdx;
export default {
  name: "WoTurntable",
  components: {
    swiper: Swiper,
    swiperSlide: SwiperSlide,
    TurntableModal
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  data() {
    return {
      isDisplay: false,
      leftTimes: "",
      swiperOption: {
        loop: true,
        initialSlide: 0,
        // autoplay: true,
        autoplay: {
          delay: 2000,
          stopOnLastSlide: false,
          disableOnInteraction: false
        },
        speed: 1500,
        direction: "horizontal",
        grabCursor: true
      },
      records: [],
      bgimgExist: false,
      timeId: null,
      main: "",
      show1: "",
      currentEnv: "",
      currentModal: this.config.modal.rule,

      click_flag: true,
      active: -1, // 当前转动到哪个位置，起点位置
      count: 8, // 总共有多少个位置
      timer: 0, // 每次转动定时器
      speed: 200, // 初始转动速度
      times: 0, // 转动次数
      cycle: 50, // 转动基本次数：即至少需要转动多少次再进入抽奖环节
      prize: -1 // 中奖位置
    };
  },
  mounted() {
    this.currentEnv = utils.judgeEv();
    console.log(this.currentEnv);
    this.getLeftTime()
    this.getWinRecord().then(() => {
      this.main = this.$refs.main;
      this.show1 = this.$refs.show1;
      this.show2 = this.$refs.show2;
      this.show2.innerHTML = this.show1.innerHTML;
      this.timeId = this.records.length > 8 && setInterval(this.play, 20);
    });
  },
  props: {
    config: {}
  },
  computed: {
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
    // currentModal() {
    //   return this.$store.state.editor.currentModal;
    // },
    // commonConfig() {
    //   return this.$store.state.editor.lotterModalCommon;
    // }
  },
  methods: {
    handleConfirm() {
      if (!this.click_flag) return;
      this.isDisplay = true;
    },
    handleClose() {
      this.isDisplay = false;
    },
    lotteryReord() {
      const param = {
        page: 1,
        pageSize: 100
      };
      const actid = this.$store.state.templateInfo.id;
      this.$get(`/atpapi/act/lottery/act/record/${actid}`, {
        params: param
      }).then(res => {
        console.log("record", res);
        if (res.code === "0000") {
          this.currentModal = this.config.modal.myPrize;
          this.currentModal.content = res.data;
          this.$bus.$emit("showModal");
        }
      });
    },
    async getWinRecord() {
      const result = await this.$get(`/atpapi/act/record/top50`);
      this.records = result.data;
    },
    async getLeftTime() {
      const actid = this.$store.state.templateInfo.id;
      const result = await this.$get(`/atpapi/hfgo/residueDegree?actId=${actid}`);
      this.leftTimes = result.data;
    },

    startLottery() {
      this.handleClose();
      const { actCode } = this.$route.params;
      const { onlineStatus } = this.$store.state.templateInfo;
      if (onlineStatus === 1) {
        // 已上线
        this.type = 0;
      } else {
        // 未上线、已下线 也就是预览模式
        this.type = 1;
      }
      this.targetCell = 3;
      this.speed = 200;
      this.startRoll();
      console.log("type", this.type, this.speed);

      // if (this.currentEnv == "notSmallRoutine") {
      //   this.$get(
      //     `/atpapi/act/lottery/start/actPath/${actCode}/${this.type}`
      //   ).then(res => {
      //     if (res.code === "0000") {
      //       if (res.data) {
      //         this.speed = 200;
      //         this.targetCell = res.data.prizeCellIndex;
      //         this.startRoll();
      //         // this.lotteryRotate(this.targetCell);
      //         // prizeType 1:实物 2:卡券 3:虚拟 4:未中奖
      //         // if (res.data.prizeType === 1) {
      //         //   this.currentModal = this.config.modal.realPrize;
      //         //   // 奖品图片取自编辑器配置的图片
      //         //   this.currentModal.content.img = this.config.lottery.prizes[
      //         //     this.targetCell - 1
      //         //   ];
      //         //   // 奖品描述
      //         //   this.currentModal.content.smallText = res.data.prizeDesc;
      //         //   this.currentModal.content.seq = res.data.seq;
      //         // } else if (res.data.prizeType === 2) {
      //         //   this.currentModal = this.config.modal.codePrize;
      //         //   // 中奖券码
      //         //   this.currentModal.content.cardcode = res.data.prizeCode;
      //         //   this.currentModal.content.smallText = res.data.prizeDesc;
      //         //   this.currentModal.content.url = res.data.url;
      //         // } else if (res.data.prizeType === 3) {
      //         //   // 虚拟奖品
      //         //   this.currentModal = this.config.modal.virtualPrize;
      //         //   this.currentModal.content.img = this.config.lottery.prizes[
      //         //     this.targetCell - 1
      //         //   ];
      //         //   this.currentModal.content.smallText = res.data.prizeDesc;
      //         //   this.currentModal.content.url = res.data.url;
      //         // } else if (res.data.prizeType === 4) {
      //         //   // 未中奖
      //         //   this.currentModal = this.config.modal.noPrize;
      //         // }
      //       } else {
      //         // 异常通用提示信息
      //         this.currentModal = this.config.modal.commonTip;
      //         this.currentModal.content.midText = "您暂未配置该活动";
      //         this.$bus.$emit("showModal");
      //       }
      //     } else {
      //       // 异常通用提示信息
      //       this.currentModal = this.config.modal.commonTip;
      //       this.currentModal.content.midText = res.message;
      //       this.$bus.$emit("showModal");
      //     }
      //     console.log("弹框内容:", this.currentModal);
      //   });
      // } else {
      //   wx.miniProgram.navigateTo({
      //     url: "/pages/login/login"
      //   });
      // }
    },
    startRoll() {
      this.times += 1; // 转动次数
      this.oneRoll();
      this.click_flag = false;
      // 如果当前转动次数达到要求 && 目前转到的位置是中奖位置
      if (this.times > this.cycle + 10 && this.prize === this.active) {
        clearTimeout(this.timer); // 清除转动定时器，停止转动
        this.prize = -1;
        this.times = 0;
        this.click_flag = true;
        this.$bus.$emit("showModal");
        // this.$refs.lotteryModal.sequence = this.currentModal.content.seq;
        console.log("你已经中奖了");
      } else {
        if (this.times < this.cycle) {
          this.speed -= 10; // 加快转动速度
        } else if (this.times === this.cycle) {
          // 中奖位置
          this.prize = this.targetCell;
          console.log(`中奖位置${this.prize}`);
        } else if (
          this.times > this.cycle + 10 &&
          ((this.prize === 0 && this.active === 7) ||
            this.prize === this.active + 1)
        ) {
          this.speed += 110;
        } else {
          this.speed += 20;
        }

        if (this.speed < 40) {
          this.speed = 40;
        }
        this.timer = setTimeout(this.startRoll, this.speed);
      }
    },
    oneRoll() {
      const active = this.active; // 当前转动到哪个位置
      const count = this.count; // 总共有多少个位置
      this.active = active > count - 1 ? 0 : active + 1;
    },
    lotteryRotate(targetCell) {
      const during_time = 3; // 旋转时间
      const result_angle = [22, 67, 112, 157, 202, 247, 292, 337].reverse(); // 最终会旋转到下标的位置所需要的度数
      const rand_circle = 5; // 附加多转几圈
      this.click_flag = false; // 旋转结束前，不允许再次触发
      const rotate_angle =
        this.origin_angle +
        rand_circle * 360 +
        result_angle[targetCell - 1] -
        (this.origin_angle % 360);
      this.origin_angle = rotate_angle;
      // 转动
      this.rotate_angle = `rotate(${rotate_angle}deg)`;

      // 旋转结束后，允许再次触发
      setTimeout(() => {
        this.click_flag = true;
        this.$bus.$emit("showModal");
        console.log("转完", this.currentModal.content.seq);
        this.$refs.lotteryModal.sequence = this.currentModal.content.seq;
      }, during_time * 1000 + 1000); // 延时，保证转盘转完
    },
    winRecord() {
      this.$router.push({
        name: "winRecord"
      });
    },
    helpDraw() {
      this.$router.push({
        name: "helpDraw"
      });
    },
    bugTimes() {
      console.log(111);
    },
    play() {
      if (this.main.scrollTop >= this.show1.offsetHeight) {
        this.main.scrollTop = 0;
      } else {
        this.main.scrollTop++;
        // console.log(this.main.scrollTop, this.show1.offsetHeight);
      }
    },
    prizePosition(index) {
      if (index === 0) {
        return {
          left: `0.33rem`,
          top: `0.33rem`
        };
      }
      if (index === 1) {
        return {
          left: `1.19rem`,
          top: `0.33rem`
        };
      }
      if (index === 2) {
        return {
          right: `0.33rem`,
          top: `0.33rem`
        };
      }
      if (index === 3) {
        return {
          right: `0.33rem`,
          top: `1.19rem`
        };
      }
      if (index === 4) {
        return {
          right: `0.33rem`,
          top: `2.09rem`
        };
      }
      if (index === 5) {
        return {
          left: `1.19rem`,
          top: `2.09rem`
        };
      }
      if (index === 6) {
        return {
          left: `0.33rem`,
          top: `2.09rem`
        };
      }
      if (index === 7) {
        return {
          left: `0.33rem`,
          top: `1.19rem`
        };
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#turntable {
  width: 3.75rem;
  height: 8.42rem;
  background-size: contain;
  background-repeat: no-repeat;
  .main {
    // width: 300px;
    height: 2.2rem;
    margin-top: 0.15rem;
    margin-left: 0.25rem;
    overflow-y: hidden;
  }

  .show1 li,
  .show2 li {
    height: 0.26rem;
    line-height: 0.26rem;
    font-size: 0.14rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .prize {
      margin-left: 0.45rem;
    }
  }
  .bg {
    width: 100%;
  }
  .bg-img {
    width: 100%;
  }
  .item-active {
    border: 0.02rem solid red;
    color: #fff;
  }
  .popInfo {
    width: 75%;
    height: 1.8rem;
    border-radius: 0.1rem;
    .mainBody {
      height: 1.3rem;
      text-align: center;
      .systemTip {
        padding-top: 0.3rem;
      }
      .confirm {
        padding-top: 0.3rem;
      }
    }
    .bottomButton {
      display: flex;
      height: 0.5rem;
      span:nth-of-type(n) {
        line-height: 0.5rem;
        border-top: 1px solid #d6d7dc;
        border-right: 1px solid #d6d7dc;
        width: 1.5rem;
        text-align: center;
      }
    }
  }
  .content {
    position: absolute;
    width: 3.75rem;
    top: 0.1rem;
    .banner {
      width: 3.55rem;
      height: 0.8rem;
      display: block;
      background-repeat: no-repeat;
      background-size: cover;
      margin: 0 auto 0.1rem;
      border-radius: 0.09rem;
      z-index: 0;
    }
    .buyTimes {
      border-radius: 0.08rem;
      margin: 0 auto 0.1rem;
      background-color: #fff;
      width: 3.55rem;
      height: 0.4rem;
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
        background-color: #c93636;
        color: #fff;
        border-radius: 0.1rem;
        line-height: 0.2rem;
        text-align: center;
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
          width: 0.75rem;
          height: 0.75rem;
        }
      }
    }
    .btns {
      width: 2.6rem;
      margin: 0.18rem auto 0.25rem;
      display: flex;
      justify-content: space-between;
      img {
        width: 1.1rem;
        height: 0.36rem;
      }
    }
    .recordList {
      width: 3.55rem;
      height: 2.61rem;
      margin: 0 auto;
      border-radius: 0.08rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .recordTitle {
        height: 0.35rem;
        line-height: 0.35rem;
        font-size: 0.16rem;
        color: #333;
        text-align: center;
        border-bottom: 0.01rem solid #e6e6e6;
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
