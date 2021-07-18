<template>
  <div class="winRecord">
    <div class="href_part">
      <img src="../assets/out.png" @click="goBack" class="left" />
      <p>我的中奖记录</p>
    </div>
    <div class="container" v-if="isShow">
      <div class="wrapper">
        <div class="whole">
          <div class="content" v-for="(item,index) in lotteryRecord" :key="index">
            <div class="contentTop">
            </div>
            <img :src="item.prizeImg||templateInfo[1]&&templateInfo[1].turntable.prizes[item.prizeCellIndex-1].src" class="littleIcon" />
            <div class="right">
              <div class="top">
                <span class="title">{{item.prizesName}}</span>
                <button class="winButton" v-if="item.prizesType == 1" @click="showReceipt(item)">
                  收货地址
                </button>
                <button class="winButton" v-if="[2,3].includes(item.prizesType) && item.url" @click="goget(item.url)">
                  立即领取
                </button>
                <button class="winButton" v-if="(item.prizesType==6) && item.url" @click="goget(item.url)">
                  {{item.btnText}}
                </button>
              </div>
              <div class="codearea" v-if="item.prizesType=== 2">
                <span>卡密：{{item.code}}</span>
                <a
                  class="copycode"
                  :data-clipboard-text="item.code"
                  id="copyoperation"
                  v-if="item.prizesType == 2"
                  @click="copy"
                >
                复制
                </a>
              </div>
              <div class="bottom">
                <span class="leftIntroduce"  @click="toggleDetail(index)">{{item.seeDetailtxt}}</span>
                <span class="rightDate">{{ item.createTime }}</span>
              </div>
              <div class="prizeDetail" v-show="item.open">{{item.prizesDesc}}</div>
            </div>
          </div>
        </div>
      </div>
      <turntableModal 
        :config="currentModal" 
        :commonturntableConfig="templateInfo[1]&&templateInfo[1].modal['commonConfig']" 
        v-if="templateInfo[1]&&templateInfo[1].name=='WoTurntable'"
      ></turntableModal>
      <SmasheggModal 
        :config="currentModal" 
        :commonturntableConfig="templateInfo[1]&&templateInfo[1].modal['commonConfig']" 
        v-else
      ></SmasheggModal>
    </div>
    <div class="noRecord" v-else>
      <img src="../assets/noRecord.png" class="empty" />
      <div class="lottery">
        暂无中奖记录，现在去
        <span style="color:#68a8e8" @click="goBack">抽奖</span>
      </div>
    </div>
    <load-more ref="loading"></load-more>
    </div>
</template>
<script>
import loadMore from "./loadMore.vue";
export default {
  data() {
    return {
      isShow: true,
      lotteryRecord: [],
      templateInfo: [],
      currentModal: {
        content: ""
      },
      token:"",
      page:1,
      length : 0,
    };
  },
  components: {
    loadMore
  },
  methods: {
    toggleDetail(i) {
      this.lotteryRecord[i].open = !this.lotteryRecord[i].open
      if (this.lotteryRecord[i].open) {
        this.lotteryRecord[i].seeDetailtxt = '收起详细说明'
      } else {
        this.lotteryRecord[i].seeDetailtxt = '查看详细说明'
      }
    },
    goget(url) {
      const hfgo = `${process.env.VUE_APP_PREURL}atpapi/cuuser/auth/autoLogin?redirectUrl=${url}&Authorization=${this.token}`
      window.location.href = url.includes("hfgo")? hfgo :url
    },
    async getInfo() {
      const params = {
        page:this.page,
        pageSize: 20
      };
      const recordsData = []
      const actid = this.$route.query.id;
      this.$refs.loading.isLoading = true
      // const res = await this.$get(`api/record`)
      const res = await this.$get(`/atpapi/act/lottery/act/record/${actid}`, { params })
      console.log(res);
      if (res.code === "0000") {
        this.length = res.data.length
        if (res.data.length > 0) {
          setTimeout(() => {
            this.$refs.loading.isLoading = false
          },1000)
          this.isShow = true;
          res.data.forEach((item) => {
            recordsData.push({
              id: item.id,
              prizesName: item.prizesName,
              prizesType: item.prizesType,
              code: item.code,
              prizesDesc: item.prizesDesc,
              prizeCellIndex: item.prizeCellIndex,
              createTime: item.createTime,
              open: false,
              seeDetailtxt: '查看详细说明',
              realname: item.realname,
              phone: item.phone,
              address: item.address,
              url: item.url,
              seq: item.seq,
              btnText:item.btnText,
              prizeImg:item.prizeImg,
              clickable: item.realname ? false : true // 如果已经填写收货信息，不可再次提交
            })
          })
          this.lotteryRecord = [...this.lotteryRecord,...recordsData]
        } else {
          this.$refs.loading.isLoading = false
          if(this.page == 1){
            this.isShow = false;
          }else{
            window.removeEventListener('scroll',this.handleScroll)
          }
        }
      }
    },
    showReceipt(receiptdata) {
        let data = this.lotteryRecord.find(item => item.id == receiptdata.id)
        this.currentModal = this.templateInfo[1].modal.receipt
        this.currentModal.content = this.lotteryRecord
        this.$bus.$emit("showModal", data);
    },
    copy() {
      this.$utils.handleCopy('#copyoperation',this)
    },
    goBack() {
      history.go(-1);
    },
    async getTemplate() {
      const { actCode } = this.$route.params
      const res = await this.$get(`/atpapi/act/lottery/init/${actCode}`)
      if (res.code === '0000') {
        this.templateInfo = JSON.parse(res.data.actContent)
      }
    },
    handleScroll(){
      this.$api.loadmore(()=>{
        this.page++
        this.getInfo()
      })
    }
  },
  mounted() {
    window.addEventListener('scroll',this.handleScroll)
    this.token = this.$utils.getCookie('atpAuthToken')
    this.getTemplate().then((params) => {
      this.getInfo()
    })
    // const { actCode } = this.$route.params
    // this.$store.commit('updateTemplateInfo', actCode)
    // this.templateInfo = this.$store.state.templateInfo.actContent
    // this.getInfo()
  },
  beforeDestroy() {
     window.removeEventListener('scroll',this.handleScroll)
  },
};

</script>
<style lang="scss" scoped>
.winRecord{
  display: flex;
  flex-direction: column;
  height: 100%;
}
.href_part {
  position: fixed;
  width: 100%;
  height: 0.43rem;
  background-color: #fff;
  display: flex;
  align-items: center;
  z-index: 10;

  .left {
    width: 0.2rem;
    height: 0.2rem;
    margin-left: 0.3rem;
  }

  p {
    font-size: 0.18rem;
    //   font-weight: 500;
    color: #333;
    margin-left: 0.8rem;
  }

  .right {
    font-size: 0.14rem;
    color: #d53535;
    margin-left: 0.83rem;
    font-weight: 600;
  }
}

.container {
  flex:1;
  background: #ededed;
  // height: calc(100vh - 0.53rem);
  padding: 0.53rem 0.05rem 0rem;
  // box-sizing: border-box;
  position: relative;

  .whole {
    background: #fff;
    border-radius: 0.08rem;
    padding: 0rem 0.15rem;

    .content {
      overflow: hidden;
      border-bottom: 1px solid #e6e6e6;
      padding: 0.225rem 0;
      display: flex;

      .right {
        width: 2.8rem;

        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .title {
            font-size: 0.14rem;
            font-weight: 700;
          }

          .winButton {
            font-size: 0.12rem;
            color: #999;
            background: #d53535;
            color: #fff;
            padding: 0.02rem 0.04rem;
            font-size: 0.12rem;
            border: none;
            border-radius: 0.03rem;
          }
        }

        .codearea {
          margin-top: 0.08rem;

          span {
            color: #999;
          }

          .copycode {
            color: #d53535;
            margin-left: 0.1rem
          }
        }

        .bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.08rem;
          font-size: 0.12rem;
          color: #999;

          .leftIntroduce {
            color: #3c91e6
          }

          .rightDate {}
        }

        .prizeDetail {
          color: #999;
          margin-top: 0.08rem;
        }

        .redTip {
          color: #d53535;
          font-size: 0.12rem;
        }
      }
    }

    .content:last-of-type {
      border-bottom: none;
    }

    .littleIcon {
      width: 0.45rem;
      height: 0.45rem;
      margin-right: 0.1rem;
    }

    .sharespan {
      font-size: 0.12rem;
      color: #999;
      margin-top: 0.08rem;
    }
  }
}
.loadmore{
  text-align: center;
}

.underline {
  color:#999;
  text-align: center;
  flex: 0;
  background-color: #ededed;
  padding-top: 0.4rem;
  padding-bottom: 0.3rem;
  font-size:0.12rem;
  img{
    width: 2.12rem;
    height: 0.12rem;
    margin: 0 auto;
  }
  // position: absolute;
  // left: 50%;
  // bottom: 0.1rem;
  // transform: translate(-50%, -50%);
}

.noRecord {
  position: relative;
  height: calc(100vh - 0.43rem);
  background: #ededed;
  font-size: 0.12rem;
  color: #aeaeae;

  .empty {
    width: 1.85rem;
    height: 1.81rem;
    position: absolute;
    left: 47%;
    top: 30%;
    transform: translate(-50%, -50%);
  }

  .lottery {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}

</style>
