<template>
  <div id="lottery-modal" v-if="isShowModal">
    <div
      class="modal"
      :style="`background-image: url(${commonturntableConfig.bgImg})`"
    >
      <div class="modal-title">{{config.title}}</div>
      <div class="modal-content">
        <img class="prizeimg" :src="config.content.img" alt v-if="config.content.img" />
        <img class="noimg" :src="config.content.noimg" alt v-if="config.content.noimg" />
        <div class="content">
          <div
            class="card-code"
            :style="`background-image: url(${config.content.codebg})`"
            v-if="config.content.codebg">
            <div class="codetitle">兑换码</div>
            <div class="code">{{config.content.cardcode}}</div>
            <div class="copy">复制</div>
          </div>
           <!-- 奖品说明 -->
          <p
            :class="config.btn.isShow? 'small-text' : 'small-text-nobtn'"
            v-html="config.content.smallText"
            v-if="config.content.smallText"
          ></p>
          <!-- 提示信息 -->
          <p
            class="mid-text"
            v-html="config.content.midText"
            v-if="config.content.midText"
          ></p>
        </div>
        <div
            class="rule-text"
            v-html="config.content.ruleText"
            v-if="config.content.ruleText"
          ></div>
        <div class="recordarea" v-if="config.name === 'myPrize'">
          <div
            class="recordItem"
            v-for="(record, i) in records"
            :key="i"
            @click.stop="toggle(i)"
            >
            <div class="record">
              <div class="prizename" v-if="record.type == 1 || record.type == 3">{{record.name}}</div>
              <div class="prizename" v-if="record.type == 2">
                <div>{{record.name}}</div>
                <div>{{record.cardcode}}</div>
              </div>
              <div class="operation" v-if="record.type == 2">复制</div>
              <div class="operation" v-if="record.type == 2">领取</div>
              <div class="operation" v-if="record.type == 1">收货地址</div>
              <div class="operation" v-if="record.type == 3">立即领取</div>
            </div>
            <div class="prizedesc" v-show="record.open">{{record.prizedesc}}</div>
          </div>
        </div>
        <div class="receipt" v-if="config.name === 'receipt'">
          <label>收件人姓名：</label>
          <el-input
            size="small"
            class="receiptnanme"
          ></el-input>
          <label>收件人手机号：</label>
          <el-input
            size="small"
            class="receiptnanme"
          ></el-input>
          <label>收货地址</label>
          <el-input
            size="small"
            class="receiptnanme"
          ></el-input>
        </div>
        <div class="modal-btns" v-if="config.btn">
          <button
            class="btn"
            v-if="config.btn.isShow"
            :style="`background: ${config.btn.btnbgcolor}; color: ${config.btn.textColor}`">
            {{config.btn.text}}</button>
        </div>
      </div>
      <img
        alt
        class="modal-close"
        src="../../assets/lottery-close.png"
        @click="closeModal"/>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TurntableModal',
  props: {
    config: {},
    commonturntableConfig: {}
  },
  data() {
    return {
      isShowModal: false,
      records: [],
      receiptInfo: {
        realname: '',
        phone: '',
        address: '',
        seq: '',
        clickable: true
      },
    }
  },
  methods: {
    toggle(i) {
      this.records[i].open = !this.records[i].open
    },
    closeModal() {
      this.isShowModal = false
    }
  },
  created() {
    this.$bus.$on('showModal', (receiptdata) => {
      this.isShowModal = true
      this.receiptInfo.realname = ''
      this.receiptInfo.phone = ''
      this.receiptInfo.address = ''
      this.receiptInfo.seq = ''
      setTimeout(() => {
        // 中奖记录弹窗
        if (this.config.name === 'myPrize') {
          const recordsData = []
          if (this.config.content.length === 0) {
            this.config.content.noimg = 'http://h5test.wostore.cn/atp_resource/upload/atpweb/2020/05/11/18b1765aaafef6192d6540e7ca3eb183.png'
            this.config.content.midText = '您还没有中奖记录哦'
            console.log(this.config.content.midText)
          } else {
            this.config.content.forEach((item) => {
              recordsData.push({
                name: item.prizesName,
                type: item.prizesType,
                cardcode: item.code,
                prizedesc: item.prizesDesc,
                open: false,
                realname: item.realname,
                phone: item.phone,
                address: item.address,
                url: item.url,
                seq: item.seq,
                clickable: item.realname ? false : true // 如果已经填写收货信息，不可再次提交
              })
              this.records = recordsData
            })
          }
        }
        // 获取用户已填写的收件信息
        if (this.config.name === 'receipt') {
          console.log(typeof(receiptdata)==='string',"验证");
          if (typeof(receiptdata)==='string') {
             this.receiptInfo.seq = receiptdata
          }else{
            this.receiptInfo.realname = receiptdata.realname
            this.receiptInfo.phone = receiptdata.phone
            this.receiptInfo.address = receiptdata.address
            this.receiptInfo.seq = receiptdata.seq
            this.receiptInfo.clickable = receiptdata.clickable
          }
        }
      }, 500)
    })
  }
}
</script>
<style lang="scss" scoped>
#lottery-modal {
  position: absolute;
  top: 0;
  width: 100%;
  height: 8.42rem;
  background-color: #00000060;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  .modal {
    position: relative;
    width: 341px;
    height: 420px;
    border-radius: 10px;
    // background-color: #fff;
    background-size: contain;
    background-repeat: no-repeat;
    .modal-title {
      margin: 56px auto 0;
      width: 190px;
      height: 35px;
      line-height: 35px;
      text-align: center;
      color: #666;
      font-size: 36px;
      font-family:SimHei;
      font-weight: 600;
    }
    .modal-content::-webkit-scrollbar {
        // display: none;
    }
    .modal-content {
      width: 244px;
      // height: 251px;
      margin: 0 auto;
      border-radius: 8px;
      // background-color: #fff;
      // overflow-y: scroll;
      .prizeimg {
        display: block;
        width: 100px;
        height: 100px;
        margin: 0 auto;
        padding: 16px 0 6px;
      }
      .noimg{
        display: block;
        width: 90px;
        margin: 0 auto;
        padding: 28px 0 14px;
      }
      .content {
        // width: 255px;
        margin: 0px auto 0;
        .card-code {
          margin: 0 auto;
          margin-top: 20px;
          width: 180px;
          height: 102px;
          background-size: contain;
          background-repeat: no-repeat;
          .codetitle{
            font-size: 13px;
            text-align: center;
            padding-top: 11px;
          }
          .code{
            font-size: 13px;
            text-align: center;
            padding-top: 16px;
          }
          .copy{
            font-size: 12px;
            text-align: center;
            text-decoration: underline;
          }
        }
        .small-text {
          margin-top: 56px;
          max-height: 50px;
          overflow-y: scroll;
          text-align: justify;
          font-size: 14px;
          color: #fff;
          line-height: 16px;
        }
        .small-text-nobtn {
          margin-top: 6px;
          max-height: 100px;
          overflow-y: scroll;
          text-align: justify;
          font-size: 14px;
          color: #454545;
          line-height: 16px;
        }
        .mid-text {
          text-align: center;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          line-height: 25px;
          margin-top: 56px;
        }
      }
      .rule-text {
        // padding: 15px 0;
        margin: 15px 30px;
        text-align: justify;
        font-size: 12px;
        color: #454545;
        line-height: 16px;
        height: 240px;
        overflow-y:scroll;
      }
      .recordarea{
        margin: 0px 13px 15px;
        .recordItem{
          border-bottom: 1px dotted #ccc;
          .record{
            // height: 44px;
            padding-bottom: 15px;
            padding-top: 15px;
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            .prizename{
              font-size: 14px;
              color: #454545;
            }
            .operation{
              font-size: 12px;
              color: #f45204;
              text-decoration: underline;
            }
          }
          .prizedesc{
            color: #454545;
            font-size: 9px;
            padding-bottom: 10px;
          }
        }
      }
      .receipt{
        font-size: 14px;
        width: 200px;
        margin: 15px auto 0;
        ::v-deep .el-input--small .el-input__inner{
          height: 30px;
          line-height: 30px;
          border-radius: 15px;
          box-shadow: inset 0px 0px 5px 2px #feeae6;
          border: none;
        }
        .receiptnanme{
          margin-top: 5px;
          margin-bottom: 9px;
        }
        .receiptnanme:last-child{
          margin-bottom: 0px;
        }
      }
      .modal-btns {
        padding: 12px 0;
        text-align: center;
        button {
          width: 109px;
          height: 40px;
          border: none;
          border-radius: 8px;
          font-size: 18px;
          font-weight: 600;
          font-family: SimHei;
          color: #ff523e;
          background: linear-gradient(#ffe277, #ffc63b);
          // box-shadow: 0 2px 4px #ffe277;
          // text-shadow: 0 -2px 0 #c21b09;
        }
      }
    }
    .modal-close {
      display: block;
      position: absolute;
      bottom: -26px;
      left: 44%;
      width: 35px;
      height: 35px;
    }
  }
}
</style>
