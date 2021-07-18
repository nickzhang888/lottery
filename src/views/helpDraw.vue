<template>
  <div class="container">
    <div class="href_part">
      <img src="../assets/out.png" @click="goBack" class="left" />
      <p>助力抽奖</p>
      <span class="right" @click="awardDetail">奖励明细</span>
    </div>
    <div class="wrapper">
      <div>
        <img src="../assets/banner.png" class="firstImg" />
      </div>
      <div class="second" v-if="isCleanUp">
        <div>任务奖励及时发放，获得的抽奖机会需在当日用完，次日清空。</div>
      </div>
      <div class="third">
        <div class="content" v-for="(item) in missionSupport" :key="item.id">
          <div class="title">
            {{item.name}}&ensp;<span @click="showTip" v-if="item.setKey.includes('is_customize_draw1')" class="wTip"></span>
            <span class="redTip" v-if="item.settingKey.includes('coutinue_days_prize')">
              （已连续签到{{alreadySignDays}}天）
              <span class="goSignRecord" @click="handleAssit(item)">查看记录></span>
            </span>
            <span class="redTip" v-if="item.name.includes('小程序分享') && item.isTrue">（今日分享成功）</span>
          </div>
          <div class="shareText">
            <div class="leftIntroduce">
              {{item.description}}
            </div>
            <button 
              :class="handleOperate(item)?'disabled':'normalBtn'" 
              @click="handleOperate(item)?null:handleAssit(item)" 
              v-html="handleBtn(item)"
            >
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="popbox" @click="isPop=false" v-if="isPop">
      <img src="../assets/share.png" alt="" :class="currentEnv === 'notSmallRoutine'?'wechatInd':'appletInd'">
      <div class="tip" v-show="currentEnv === 'smallRoutine'">
          温馨提醒：<br/>
          若您的好友从未登陆过小程序，需要<br/>
          先绑定手机号，才可以帮您助力哦！
      </div>
      <!-- <div class="ptext">
        <p>点击右上角</p>
        <p>将订单分享给微信好友</p>
      </div> -->
    </div>
    <div class="footText">
      <p>更多助力任务敬请期待~~~</p>
    </div>
    <van-popup v-model="isDisplay" class="popInfo" :close-on-click-overlay="false">
      <div class="mainBody">
        <h3 class="systemTip">温馨提示</h3>
        <div class="confirm">
          “话费券”是联通话费购商场的虚拟货币，购买“话费券”不等于充值“话费”，请用户谨慎交易，交易成功即用户已知悉话费券使用场景及用途，不可退换、提现及转让。
        </div>
      </div>  
      <button class="bottomButton" @click="showTip">
        知道了
      </button>
    </van-popup>
    <van-popup v-model="isShow" class="popInfo" :close-on-click-overlay="false">
      <div class="mainBody" style="margin-top:0.35rem">
        <img :src="imgHref" height="200" alt="">
        <div class="center">
         长按识别图中二维码<br/>
         关注公众号领取奖励
        </div>
      </div>  
      <button class="bottomButton" @click="isShow=false">
        关闭
      </button>
    </van-popup>
  </div>
</template>

<script>
import $ from "jquery";
import { mapState,mapGetters } from "vuex";
export default {
  components: {
  },
  data() {
    return {
      currentEnv:"",
      isPop: false,
      missionSupport: [],
      result:"",
      alreadySignDays: 0,
      shareOption:{
           title: "",
           desc: "",
           link: "",
           imgUrl: "",
      },
      isDisplay:false,
      isShow:false,
      imgHref:""
    };
  },
   computed: {
    ...mapState([
      "isCleanUp",
    ]),
  },
  methods: {
    // 控制按钮是否可用
    handleOperate(item){
      if((item.settingKey.includes('coutinue_days_prize') || item.setKey.includes('is_customize_draw0') || item.setKey.includes('is_customize_draw1') || item.setKey.includes('follow_wx_account0')) && item.isTrue){
          return true 
      }
      return false
    },
    showTip(){
      this.isDisplay = !this.isDisplay
    },
    async getTemplate() {
      const { actCode } = this.$route.params
      const res = await this.$store.dispatch('getTemplateInfo', actCode)
      if (res.data.code === '0000') {
        this.shareOption = {
            title:res.data.data.wxShareTitle,
            desc:res.data.data.wxShareText,
            imgUrl:res.data.data.wxShareIcon 
        }
      }
    },
    prepareWechatShare(shareOption) {
      // 原微信分享信息获取接口通过jquery中jsonp实现，axios不支持jsonp，此处根据jsonp原理实现调用接口
      // JSONP模拟 start  callback的值即为jsonp调用以后执行的方法名
      let apiUrl = `${location.protocol}//wxwsd.wostore.cn/index.php?s=/Api/Data/getWeixinSignInfo&weixin_id=5&url=${encodeURIComponent(location.href)}&callback=apiShareWxInfo`;
      let body = document.getElementsByTagName('body')[0];
      let script = document.createElement('script');
      script.setAttribute('src', apiUrl);
      body.appendChild(script);
      // JSONP模拟 end

      // script载入完之后会调用这个函数，res就是获取分享信息接口返回的内容
      // jsonp调用以后执行的方法
      window.apiShareWxInfo = res => {
        let wxInfo = res.data;
        wxInfo.debug = false;
        wxInfo.jsApiList = ['onMenuShareTimeline', "onMenuShareAppMessage"];
        wx.config(wxInfo);
        wx.ready(() => {
          wx.onMenuShareTimeline(this.shareOption);
          wx.onMenuShareAppMessage(this.shareOption);
        });
        wx.error((error) => {
          console.log(error);
        })
      }
    },
    // 处理按钮的展示文字
    handleBtn(item){
      if(item.settingKey.includes("coutinue_days_prize") && item.isTrue){
        return "今日已签到"
      }else if(item.setKey && item.setKey.includes("is_customize_draw0") && item.isTrue){
        return "已完成"
      }else if(item.setKey && item.setKey.includes("is_customize_draw1") && item.isTrue){
        return "已充值"
      }else if(item.setKey.includes("follow_wx_account0") && item.isTrue){
        return "已关注"
      }else{
        return item.btnText
      }
    },
    handleAssit(item) {
      const actid = this.$route.query.id;
      if(item.settingKey.includes("coutinue_days_prize")){
        location.href = `${item.redirectUrl}?actId=${actid}&actSetId=${item.id}&imgUrl=${item.bannerImg}&targetActId=${item.targetActId}`;
      }else if(item.name.includes("小程序分享")){
        if(this.currentEnv !== "smallRoutine"){
          this.$toast("请在小程序内打开")
          return false
        }
        this.isPop = true

      }else if(item.name.includes("微信分享")){
        if(this.currentEnv !== "notSmallRoutine"){
          this.$toast("请在微信里打开")
          return false
        }
         this.isPop = true
      }else if(item.setKey.includes("follow_wx_account0")){
         this.isShow = true
      }else {
        const hfgo = `${process.env.VUE_APP_PREURL}atpapi/cuuser/auth/autoLogin?redirectUrl=${item.redirectUrl}&Authorization=${this.token}`
        location.href = item.redirectUrl.includes('hfgo')? hfgo : item.redirectUrl
      }
    },
    getAlreadySignDays(actId) {
      this.$get(`/atpapi/act/actUserSign/data?actId=${actId}`).then(res => {
        if (res.code === "0000") {
          this.alreadySignDays = res.data ? res.data.signCount:0;
        } else {
          this.$toast(res.message, 3000);
        }
      });
    },
    awardDetail() {
      this.$router.push({
        name: "awardDetail",
        query:{
          id:this.$route.query.id
        }
      });
    },
    goBack() {
      history.go(-1);
    },
    getTask() {
      const actid = this.$route.query.id;
      return this.$get(`/atpapi/lottery/powerTask/${actid}`);
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
          this.currentEnv = "notWeChat";
      }
    },
    getSign(result){
      const params = {
        	actId: result.actId,
	        actSetId: result.id,
	        imgUrl: result.bannerImg,
	        recordTime: this.$utils.getNowFormatDate(),
	        relType: 0,
	        type: 1
      }
      return this.$post(`/atpapi/share/saveRecord`,params)
    },
    handleShare(){
      let that = this
      $.ajax({
        url: `${location.protocol}//wxwsd.wostore.cn/index.php?s=/Api/Data/getWeixinSignInfo&weixin_id=5&url=` + encodeURIComponent(location.href),
        data: "",
        type: "get",
        dataType: "jsonp",
        jsonp: "callback",
        success: function (d) {
          var wxAppid = d.data.appId;
          var wxNonceStr = d.data.nonceStr;
          var wxSign = d.data.signature;
          var wxTimestamp = d.data.timestamp;
          wx.config({
            debug: false,
            appId: wxAppid,
            timestamp: wxTimestamp,
            nonceStr: wxNonceStr,
            signature: wxSign,
            jsApiList: ["updateAppMessageShareData", "updateTimelineShareData"],
          });
          wx.ready(function(){
            wx.updateAppMessageShareData({
              title: that.shareOption.title,
              desc: that.shareOption.desc,
              link: that.shareOption.link,
              imgUrl: that.shareOption.imgUrl,
              success: function () {
                  that.isPop = false
              },
              cancel: function () {},
            });
            wx.updateTimelineShareData({
              title: that.shareOption.title,
              desc: that.shareOption.desc,
              link: that.shareOption.link,
              imgUrl: that.shareOption.imgUrl,
              success: function () {
                  that.isPop = false
              },
              cancel: function () {},
            });
          });
        },
      });
    },
    async getReady(){
        let str,url;
        const task = await this.getTask()
        this.missionSupport = task.data
        //假数据
      //   this.missionSupport = [
      //     {
      //         "id": 2708,
      //         "actId": 1117,
      //         "name": "签到",
      //         "btnText": "去签到",
      //         "redirectUrl": "http://h5test.wostore.cn/atpsign/ACT202010091753209850012yWTwEx",
      //         "bannerImg": "http://h5test.wostore.cn/atp_resource/upload//atpweb/2020/10/12/cf3f4159aa699e8b4c228795b87b18f2.png",
      //         "description": "连续签到7天，奖励0.5元话费券，中途断开要重新累计哦~",
      //         "isTrue": 0,
      //         "settingKey": "coutinue_days_prize",
      //         "setKey": "coutinue_days_prize0",
      //         "imgUrl": null,
      //     },
      //     {
      //         "id": 3108,
      //         "actId": 1117,
      //         "name": "微信分享活动",
      //         "btnText": "分享",
      //         "redirectUrl": "",
      //         "bannerImg": "http://h5test.wostore.cn/atp_resource/upload//atpweb/2020/10/22/22c81cd4be28e80e1449596bd6d84616.jpg",
      //         "description": "分享活动成功，您和好友都可以获得一次抽奖机会（每个用户每天限一次）",
      //         "isTrue": 0,
      //         "settingKey": "is_share_add_draw_num",
      //         "setKey": "is_share_add_draw_num1",
      //         "imgUrl": null,
      //     },
      //     {
      //         "id": 2713,
      //         "actId": 1117,
      //         "name": "开通会员",
      //         "btnText": "去开通",
      //         "redirectUrl": "https://www.baidu.com",
      //         "bannerImg": "http://h5test.wostore.cn/atp_resource/upload//atpweb/2020/10/12/0dab6042197f90eda7fc03067655df3d.png",
      //         "description": "首次开通小沃畅享会员成功，得一次抽奖机会（每个用户限一次）",
      //         "isTrue": 1,
      //         "settingKey": "is_customize_draw",
      //         "setKey": "is_customize_draw0",
      //         "imgUrl": null,
      //     },
      //     {
      //         "id": 2860,
      //         "actId": 1117,
      //         "name": "关注公众号",
      //         "btnText": "去关注",
      //         "redirectUrl": "https://www.baidu.com",
      //         "bannerImg": "http://h5test.wostore.cn/atp_resource/upload//atpweb/2020/10/22/3d861ec41cae78b4db767bd6df588374.png",
      //         "description": "首次关注公众号成功，得一次抽奖机会(每个用户限一次，取关注再关注不算哦)",
      //         "isTrue": 0,
      //         "settingKey": "follow_wx_account",
      //         "setKey": "follow_wx_account0",
      //         "imgUrl": require("../assets/showqrcode.png"),
      //     }
      // ]
        // 获取签到配置
        const signConfig = this.missionSupport.find(item=>item.settingKey.includes("coutinue_days_prize"))
        const value = this.missionSupport.find(item=>item.setKey.includes("follow_wx_account0"))
        this.imgHref = value?.imgUrl 
        // 判断是否有微信分享
        this.result = this.missionSupport.find(item=>item.name.includes("微信分享"))
        console.log("环境:",this.currentEnv);
        if (signConfig) {
          // 获取连续签到天数
          this.getAlreadySignDays(signConfig.targetActId)
        }
     }
  },
  created() {
    window.addEventListener('pageshow', function(e) {
    //如果检测到页面是从“往返缓存”中读取的，刷新页面
      if (e.persisted) {
        window.location.reload();
      }
    });
    this.token = this.$utils.getCookie('atpAuthToken')
    this.judgeEv()
    
    this.getTemplate().then(() => {
        this.getReady()
    })
  },
  beforeDestroy(){
    window.removeEventListener('pageshow', function(e) {
    //如果检测到页面是从“往返缓存”中读取的，刷新页面
      if (e.persisted) {
        window.location.reload();
      }
    });
  }

};
</script>

<style lang="scss" scoped>
.container {
  display:flex;
  flex-direction: column;
  background: #ededed;
  height:100%;
  overflow: auto;
  .href_part {
    position: fixed;
    height: 0.43rem;
    width:100%;
    background-color: #fff;
    display: flex;
    align-items: center;
    z-index:10;
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
    .right {
      font-size: 0.14rem;
      color: #d53535;
      margin-left: 0.83rem;
      font-weight: 600;
    }
  }
  .wrapper {
    // padding: 0.1rem;
     padding: 0.53rem 0.1rem 0rem;
     flex:1;
    .firstImg {
      width: 100%;
      height: 0.8rem;
    }

    .second {
      height: 0.4rem;
      line-height: 0.4rem;
      text-align: center;
      font-size: 0.12rem;
      background-color: #fff;
      margin-top: 0.07rem;
      border-radius: 0.08rem;
    }

    .third {
      background: #fff;
      margin-top: 0.1rem;
      border-radius: 0.08rem;
      box-sizing: border-box;
      padding: 0 .15rem;
      .content {
        overflow: hidden;
        padding: 0.2rem 0 0.15rem 0rem;
        box-sizing: border-box;
      }
      .content:not(:last-child){
        border-bottom: 0.005rem solid #ccc;
      }

      .shareText {
        display: flex;
        justify-content: space-between;
        font-size: 0.12rem;
        color: #999;
        margin-top: 0.08rem;
      }

      .leftIntroduce {
         flex:1;
         margin-right: 0.1rem;
      }

      .title {
        font-size: 0.14rem;
        font-weight: 700;
         .wTip::after{
           content:"!";
           display: inline-block;
           text-align: center;
           width:0.14rem;
           height: 0.14rem;
           line-height: 0.14rem;
           border-radius: 0.07rem;
           background:#d53535;
           color:#fff;
         }
      }

      .normalBtn,.disabled{
        color: #fff;
        font-size: 0.12rem;
        padding: .02rem .04rem;
        border: none;
        border-radius: 0.03rem;
        height:0.2rem;
        min-width: 0.45rem;
      }
      .normalBtn{
        background: #d53535;
      }
      .disabled{
        background :#ccc
      }

      .redTip {
        color: #d53535;
        font-size: 0.12rem;
      }
    }
  }
  .footText {
      background-color: #ededed;
      font-size: 0.14rem;
      color: #999;
      padding-top: 0.5rem;
      padding-bottom: 0.2rem;
      text-align: center;
  }
  .popInfo {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 2.8rem;
    border-radius: 0.1rem;
    padding-bottom:0.26rem;
    .mainBody {
      text-align: center;
      .systemTip {
        font-size:0.18rem;
        padding-top: 0.36rem;
      }
      .confirm,.center {
        font-size:0.14rem;
        padding: 0.19rem 0.25rem 0.3rem;
      }
      .confirm{
        text-align: justify;
      }
      .center{
        text-align: center;
      }
    }
    .bottomButton {
      width:0.8rem;
      height:0.3rem;
      font-size:0.18rem;
      color:#fff;
      background:#d53535;
      border:none;
      border-radius:0.05rem;
      text-align: center;
    }
  }

  .popbox {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index:100;
    .wechatInd {
      height: 1.1rem;
      position: absolute;
      right: 0;
      // margin-top: 0.2rem;
    }
    .tip{
      width:100%;
      position:absolute;
      left:50%;
      top:50%;
      transform:translate(-50%,-50%);
      font-size:0.16rem;
      color:#fff;
      margin-left:15%;
    }
    .appletInd{
      height: 1.1rem;
      position: absolute;
      right:0.55rem;
    }

    .ptext {
      margin-top: 0.1rem;
      position: absolute;
      right: 0;
      top: 1rem;
      p {
        text-align: center;
        height: 0.2rem;
        line-height: 0.2rem;
        font-size: 0.14rem;
        color: #fff;
      }
    }
  }
}
</style>
