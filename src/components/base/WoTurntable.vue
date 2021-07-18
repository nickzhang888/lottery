<template>
  <div id="turntable" :style="{backgroundImage: 'url(' + bgImg + ')'}">
    <previewTips :isPreview="isPreview"></previewTips>
    <div class="previewWarning" v-if="isPreview">
      {{previewWarning}}
    </div>
    <div class="content">
      <swiper
        :options="swiperOption"
        ref="mySwiper"
        class="banner"
        v-if="config.banners.length > 1"
      >
        <swiper-slide v-for="(banner,i) in config.banners" :key="i">
         <img class="banner" :src="banner.src"/>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
      <img class="banner" :src="config.banners[0].src"  @click="goUrl(config.banners[0].url)" v-else />
      <div class="buyTimes" :style="{backgroundColor:config.buy.bgColor}" v-show="isShowBuytimes && isHfgoIos">
        <div
          class="currentTimes"
          :style="{color:config.buy.textColor}"
        >{{isLogin?`还可购买${buyTimes.residueDegree}次抽奖机会（每日最多可买${buyTimes.totalNumber}次）`:'每日最多可买10次抽奖机会'}}</div>
        <div
          class="buyBtn"
          :style="{backgroundColor:config.buy.btnbgcolor, color:config.buy.btntextcolor}"
          @click="goBuy"
        >{{buyTimes.residueDegree? '去购买':'去看看' }}</div>
      </div>
      <div
        class="rulebtn"
        @click.stop="showrule"
        :style="{backgroundColor:config.rule.btnbgcolor, color:config.rule.btntextcolor}"
        v-show="config.rule.isShowBtn"
      >活动规则</div>
      <div :style="`background-image: url(${config.turntable.bgSrc.src})`" class="turn">
        <div :style="{position:'relative', backgroundImage: 'url(' + config.turntable.pointerSrc.src + ')'}" class="pointer">
            <div 
              :class="isLogin && isShowLotterytimes ? 'btntext':'btntextbig'" 
              @click.stop="handleConfirm"
              >
              {{(isLogin && !lotteryAmount) ? "" : "点击抽奖"}}
            </div>
            <div class="lotteryTimes"
              @click.stop="handleConfirm"
              v-if="isLogin"
              v-html="isShowLotterytimes?(lotteryAmount? `还可抽${lotteryAmount}次` :`得更多<br>抽奖机会`):''">
            </div>
        </div>
        <div class="lottery">
          <img
            :key="index"
            :src="img.src"
            :style="prizePosition(index)"
            v-for="(img, index) in config.turntable.prizes"
            :class="active===index?'item-active':''"
          />
        </div>
      </div>
      <div class="leftTime">
        <img src="../../assets/remind.png" alt="" />
        您的抽奖机会将于
        <van-count-down :time="leftTime" style="display:inline-block">
          <template v-slot="timeData">
            <span class="block"><span v-show="timeData.hours<10">0</span>{{ timeData.hours}}</span>
            <span class="colon">:</span>
            <span class="block"><span v-show="timeData.minutes<10">0</span>{{ timeData.minutes }}</span>
            <span class="colon">:</span>
            <span class="block"><span v-show="timeData.seconds<10">0</span>{{ timeData.seconds }}</span>
          </template>
        </van-count-down>           
           后清空，请及时使用！
      </div>
      <div class="btns">
        <img :src="config.turntableRecord.src" @click.stop="winRecord" alt />
        <div class="helpStyle">
          <img :src="config.help.src" @click.stop="helpDraw" alt />
          <span class="goDone" v-show="isSign">去完成</span>
        </div>
      </div>
      <div class="recordList" :style="{backgroundColor: config.recordList.backgroundColor}" v-show="isShowRecordList">
        <div class="recordTitle" :style="{color:config.recordList.title}">中奖榜单（实时更新）</div>
        <div class="main" :style="{color:config.recordList.textColor}" ref="main">
          <ul class="show1" ref="show1">
            <li v-for="(item,index) in records" :key="index">
              <span class="phone">{{item.phone}}</span>
              <span class="prize">获得“{{item.priceName}}”</span>
            </li>
          </ul>
          <ul class="show2" ref="show2" v-show="records.length>8"></ul>
          <p v-show="records.length==0" class="noList">还没人上榜，快去抽奖上榜吧！</p>
        </div>
      </div>
      <van-popup v-model="isDisplay" class="popInfo">
        <div class="mainBody">
          <h3 class="systemTip">温馨提示</h3>
          <div class="confirm">确定要抽奖吗?</div>
        </div>
        <div class="bottomButton">
          <button @click="handleClose" class="closeBtn">取消</button>
          <button @click="startLottery" class="sureBtn" :disabled="!isDisplay ? true:false">确定</button>
        </div>
      </van-popup>
    </div>
    <turntableModal
      :config="currentModal"
      :commonturntableConfig="config.modal['commonConfig']"
      ref="turnModal"
    >
    </turntableModal>
    <turntableRule :config="config" ref="rule"></turntableRule>
    <div v-if="isLoading" class="loadStyle">
      <img src="../../assets/loadLT.gif" >
    </div>
  </div>
</template>

<script>
import previewTips from '../previewTips'
import { mapState,mapGetters } from "vuex";
import { mixin } from "@/mixin/mixin.js"
export default {
  name: "WoTurntable",
  props: {
    config: {}
  },
  components: {
    previewTips
  },
  mixins:[mixin],
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
    ...mapState([
      "templateInfo",
      "isShowLotterytimes",
      "isCleanUp",
      "isShowBuytimes",
      "isShowRecordList",
      'buyTimes',
      'lotteryAmount',
      'isLoading'
    ]),
    ...mapGetters([
      'bgImg',
      'bgColor',
      'isPreview'
    ])
  },
  data() {
    let vm = this
    return {
      leftTime:"" ,
      isHfgoIos:true,
      previewWarning: this.actCode === 'ACT2020091019553735900081rSbth' ? '当前为模板预览模式，请勿将链接泄漏外传。' : '当前为测试预览模式，请勿将链接泄漏外传。',
      isDisplay: false,
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
        grabCursor: true,
        on: {
          click(){
            const realIndex = (this.activeIndex - 1 + vm.config.banners.length) % (vm.config.banners.length);
            vm.goUrl(vm.config.banners[realIndex].url)
          }
        }
      },
      records: [],
      timeId: null,
      main: "",
      show1: "",
      currentEnv: "",
      click_flag: true,
      actId:"",
      active: -1, // 当前转动到哪个位置，起点位置
      count: 8, // 总共有多少个位置
      timer: 0, // 每次转动定时器
      speed: 200, // 初始转动速度
      times: 0, // 转动次数
      cycle: 50, // 转动基本次数：即至少需要转动多少次再进入抽奖环节
      prize: -1, // 中奖位置
      isSign:false,
    };
  },
  created() {
    var from = this.getQueryString('from');
    var appinstall = this.getQueryString('appinstall');
    var sec = this.getQueryString('sec');
    var timekey = this.getQueryString('timekey');
    // if(from || appinstall || sec || timekey){//假如拼接上了
    //     window.location.href = "https://atp.bol.wo.cn/atplottery/ACT202009102100475830051Atm1u4"
    // }
    this.getTime()
    this.judgeEv();
    const u = navigator.userAgent;
    const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    if(this.currentEnv == "smallRoutine"){
      if(this.$route.query.product=="hfgo" && isiOS){
        this.isHfgoIos = false
      }
    }
    console.log("类型:", this.config);
    this.getWinRecord().then(() => {
      this.main = this.$refs.main;
      this.show1 = this.$refs.show1;
      this.show2 = this.$refs.show2;
      this.show2.innerHTML = this.show1.innerHTML;
      this.timeId = this.records.length > 8 && setInterval(this.runHorse, 20);
    });
  },
  methods: {
    getQueryString(name) {//根据字段看网址是否拼接&字符串
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null)
          return unescape(r[2]);
      return null;
    },
    getTime(){
        const date = new Date()
        const total = 24*60*60*1000
        const hour = date.getHours()*60*60*1000
        const minute = date.getMinutes()*60*1000
        const second = date.getSeconds()*1000
        const leftTime = total - (hour + minute + second)
        console.log(leftTime);
        this.leftTime = leftTime
    },
    judgeEv() {
      const ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        // ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
        wx.miniProgram.getEnv(res => {
          if (res.miniprogram) {
            this.currentEnv = "smallRoutine";
          } else {
             this.currentEnv = "notSmallRoutine";
          }
        })
      } else {
          this.currentEnv ="notWeChat";
      }
    },
    goUrl(url){
       url && (window.location.href = url)
    },
    handleConfirm() {
      if (!this.click_flag) return
      this.isDisplay = true
    },
    handleClose() {
      this.isDisplay = false;
    },
    async getWinRecord() {
      const result = await this.$get(`/atpapi/act/record/top50?actId=${this.actId}`);
      if(result.code === "0000"){
        this.records = result.data;
      }
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
        this.speed = 200;
        this.targetCell = parseInt(Math.random()*8)+1;
        this.startRoll();
        // prizeType 1:未中奖 2:卡券 3:虚拟 4:实物 5:再来一次 6话费购直充
        if (this.targetCell === 1) {
          // 未中奖
          this.currentModal = this.config.modal.noPrize;
        } else if (this.targetCell === 2) {
          //卡券
          this.currentModal = this.config.modal.codePrize;
          this.currentModal.content.img = this.config.turntable.prizes[this.targetCell - 1];
          this.currentModal.content.smallText = "";
        } else if (this.targetCell === 3 || this.targetCell === 7 || this.targetCell === 8 ) {
          // 虚拟奖品
          this.currentModal = this.config.modal.virtualPrize;
          this.currentModal.content.img = this.config.turntable.prizes[this.targetCell - 1];
          this.currentModal.content.url = "https://www.baidu.com";
        } else if (this.targetCell === 4) {
          // 实物
          this.currentModal = this.config.modal.realPrize;
          this.currentModal.content.img = this.config.turntable.prizes[this.targetCell - 1];
        } else if (this.targetCell === 5) {
          //再来一次
          this.currentModal = this.config.modal.againPrize
        } else if (this.targetCell === 6) {
          //话费购直充
          this.currentModal = this.config.modal.hfgoPrize;
          this.currentModal.content.img = this.config.turntable.prizes[this.targetCell - 1];
          this.currentModal.content.url = "https://www.baidu.com";
        }
    },
    // startLottery() {
    //   this.handleClose();
    //   const { actCode } = this.$route.params;
    //   const { onlineStatus } = this.$store.state.templateInfo;
    //   const version = "v1"
    //    // 0是已上线，1是未上线、已下线
    //   this.type = onlineStatus == 1 ? 0 : 1
    //   this.$get(
    //     `/atpapi/act/lottery/start/${version}/actPath/${actCode}/${this.type}`
    //   ).then(res => {
    //     if (res.code === "0000") {
    //       if (res.data) {
    //         this.speed = 200;
    //         this.targetCell = res.data.prizeCellIndex;
    //         this.startRoll();
    //         // this.lotteryRotate(this.targetCell);
    //         // prizeType 1:实物 2:卡券 3:虚拟 4:未中奖 5:再来一次 6话费购直充 7积分
    //         switch (res.data.prizeType){
    //           case 1:
    //             this.getModal('realPrize',res.data)
    //             this.currentModal.content.seq = res.data.seq;
    //             break;
    //           case 2:
    //             this.getModal('codePrize',res.data)
    //             this.currentModal.content.cardcode = res.data.prizeCode;
    //             this.currentModal.content.img = '';
    //             break;
    //           case 3:
    //             this.getModal('virtualPrize',res.data)
    //             break;
    //           case 4:
    //             this.currentModal = this.config.modal.noPrize;
    //             break;
    //           case 5:
    //             this.getModal('againPrize',res.data)
    //             break;
    //           case 6:
    //             this.getModal('hfgoPrize',res.data)
    //             this.currentModal.btn.text = res.data.btnText;
    //             break;
    //           case 7:
    //             this.getModal('againPrize',res.data)
    //             this.currentModal.btn.text = "立即领取";
    //             break;
    //         }
    //       } else {
    //          this.exceptionTips(res)
    //       }
    //     } else {
    //       this.exceptionTips(res)
    //     }
    //   });
    // },
    getModal(name,data){
       this.currentModal = this.config.modal[name]
       this.currentModal.content.img = this.config.turntable.prizes[this.targetCell - 1];;
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
      }, 100);
    },
    goLogin(){
       console.log(this.currentEnv);
       if(this.currentEnv === "smallRoutine"){
           wx.miniProgram.navigateTo({
             url: `/pages/login/login?clientId=activetemplate`
           });
       }else{
           window.location.href = `${process.env.VUE_APP_LOGIN}${encodeURIComponent(window.location.href)}`
       }
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
        setTimeout(() => {
          this.click_flag = true;
          this.$bus.$emit("showModal");
        }, 1000);
        console.log("你已经中奖了");
      } else {
        if (this.times < this.cycle) {
          this.speed -= 10; // 加快转动速度
        } else if (this.times === this.cycle) {
          // 中奖位置
          this.prize = this.targetCell - 1;
        } else if (this.times > this.cycle + 10 && 
          ((this.prize === 0 && this.active === 7) || this.prize === this.active + 1)) {
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
    runHorse() {
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
          left: `0.28rem`,
          top: `0.3rem`,
        };
      }
      if (index === 1) {
        return {
          left: `1.16rem`,
          top: `0.31rem`
        };
      }
      if (index === 2) {
        return {
          right: `0.29rem`,
          top: `0.31rem`
        };
      }
      if (index === 3) {
        return {
          right: `0.29rem`,
          top: `1.17rem`
        };
      }
      if (index === 4) {
        return {
          right: `0.29rem`,
          top: `2.05rem`
        };
      }
      if (index === 5) {
        return {
          left: `1.16rem`,
          top: `2.05rem`
        };
      }
      if (index === 6) {
        return {
          left: `0.28rem`,
          top: `2.05rem`
        };
      }
      if (index === 7) {
        return {
          left: `0.28rem`,
          top: `1.17rem`
        };
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#turntable {
  width: 3.75rem;
  font-family:Microsoft YaHei;
  .loadStyle{
    position: absolute;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
    z-index:99
  }
  .previewWarning{
    text-align: center;
    background-color: rgba(0,0,0,.6);
    position: fixed;
    font-size: .16rem;
    color: #fff;
    width: 3.75rem;
    height: .4rem;
    line-height: .4rem;
    z-index: 100;
  }
  .main {
    // width: 300px;
    height: 2.2rem;
    margin-top: 0.15rem;
    margin-left: 0.25rem;
    overflow-y: hidden;
    .noList{
       font-size: 0.16rem;
       line-height: 1.6rem;
       text-align: center;
    }
  }

  .show1 li,
  .show2 li {
    height: 0.26rem;
    line-height: 0.26rem;
    font-size: 0.14rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .phone{
      display: inline-block;
      width: 0.82rem;
    }
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
    background: #fdf993;
    color: #fff;
  }
  .popInfo {
    background:url(../../assets/modalBg.png) no-repeat center/100% 100%;
    width: 75%;
    height: 2.64rem;
    text-align: center;
    // border-radius: 0.1rem;
    .mainBody {
      .systemTip {
        font-size:0.24rem;
        color:#ff6753;
        padding-top: 0.51rem;
      }
      .confirm {
        font-size:0.16rem;
        padding-top: 0.32rem;
        font-weight:700
      }
    }
    .bottomButton {
      font-size:0.18rem;
      color:#ff523e;
      margin-top:0.33rem;
      font-weight:700;
      .closeBtn,.sureBtn {
        width:0.76rem;
        height:0.3rem;
        border:none;
        background:#ffdd6c;
        border-radius:0.1rem;
      }
      .closeBtn{
        margin-right:0.12rem;
      }
      .sureBtn {
        margin-left:0.12rem;
      }
    }
  }
  .content {
    position: absolute;
    width: 3.75rem;
    top: 0.1rem;
    .rulebtn{
      font-size: 0.13rem;
      text-align: right;
      margin-right: 0.34rem;
      text-decoration: underline;
    }
    .banner {
      width: 3.55rem;
      height: 0.8rem;
      display: block;
      background-repeat: no-repeat;
      background-size: cover;
      margin: 0 auto 0.1rem;
      border-radius: 0.09rem;
      z-index: 0;
      transform:translate3d(0,0,0)
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
        font-family:Microsoft YaHei;
      }
      .buyBtn {
        font-size:0.12rem;
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
        height: 0.84rem;
        background-size: contain;
      }
      .btntext {
        color: #fff;
        // position: absolute;
        z-index: 10;
        // top: 0.24rem;
        // left: 0.2rem;
        font-size: 0.16rem;
        text-align: center;
        padding-top: 0.23rem;
        font-family:Microsoft YaHei;
      }
      .btntextbig{
        color: #fff;
        z-index: 10;
        font-size: 0.2rem;
        text-align: center;
        padding-top: 0.16rem;
        width: 0.4rem;
        padding-left: 0.21rem;
        font-family:Microsoft YaHei;
      }
      .lotteryTimes {
        text-align: center;
        z-index: 10;
        // top: 0.45rem;
        // left: 0.11rem;
        font-size: 0.12rem;
        color: #fff;
        // position: absolute;
      }
      .lottery {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        img {
          position: absolute;
          width: 0.83rem;
          height: 0.83rem;
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
      .helpStyle{
        display: inline-block;
        position:relative;
        text-align: center;
        .goDone{
          position: absolute;
          font-size:0.12rem;
          top:-0.1rem;
          right:-0.1rem;
          color:#c93535;
          width:0.5rem;
          height:0.2rem;
          background:#ffef75;
          border-radius:0.08rem;
          box-shadow:0.01rem 0.01rem 0.04rem #999;
          line-height: 0.2rem;
          &::after{
            content:"";
            width:0;
            height:0;
            position: absolute;
            left:0.1rem;
            top:0.18rem;
            border-bottom: 0.05rem solid transparent;
            border-top: 0.05rem solid #ffef75;
            border-left: 0.05rem solid transparent;
            border-right: 0.05rem solid transparent;
          }
        }
      }
      // img:last-of-type{
      //   padding-left:0.4rem;
      // }
    }
    .leftTime{
        font-size: 0.144rem;
        text-align: center;
        color:#c93636;
        margin-top:0.18rem;
        
        img{
          height:0.14rem;
          vertical-align:text-bottom;
          margin-bottom:0.026rem
        }
        .colon {
          display: inline-block;
          margin: 0 0.01rem;
          color: #c93636;
        }
        .block {
          display: inline-block;
          width: 0.18rem;
          color: #fff;
          font-size: 0.12rem;
          text-align: center;
          background-color: #c93636;
          border-radius: 0.03rem;
        }
    }
    .recordList {
      width: 3.55rem;
      height: 2.61rem;
      margin: 0 auto 0.3rem;
      border-radius: 0.08rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .recordTitle {
        font-family:Microsoft YaHei;
        height: 0.35rem;
        line-height: 0.35rem;
        font-size: 0.16rem;
        color: #333;
        text-align: center;
        border-bottom: 0.01rem solid #e6e6e6;
      }
    }
  }
}
</style>
