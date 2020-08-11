<!--
 * @Date: 2020-05-13 10:11:44
 * @LastEditors: Pengyr
 * @LastEditTime: 2020-05-21 16:49:02
 -->
<template>
  <div id="lottery-modal" v-show="isShowModal">
    <div
      class="modal"
      :style="`background-image: url(${commonLotteryConfig.bgImg})`"
    >
      <div class="modal-title">{{config.title}}</div>
      <div class="modal-content">
        <img class="prizeimg" :src="config.content.img.src" alt v-if="config.content.img" />
        <img class="noimg" :src="config.content.noimg" alt v-if="config.content.noimg" />
        <div class="content">
          <div
            class="card-code"
            :style="`background-image: url(${config.content.codebg})`"
            v-if="config.content.codebg">
            <div class="codetitle">兑换码</div>
            <div class="code">{{config.content.cardcode}}</div>
            <div
              class="copy"
              id="wincopy"
              :data-clipboard-text="config.content.cardcode"
              @click="copy('win')">复制</div>
          </div>
          <p
            class="small-text"
            v-html="config.content.smallText"
            v-if="config.content.smallText"
          ></p>
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
              v-show="config.content.length > 0"
              class="recordItem"
              v-for="(record, i) in records"
              :key="i"
              @click="toggle(i)"
              >
              <div class="record">
                <div class="prizename" v-if="record.type == 1  || record.type == 3">{{record.name}}</div>
                <div class="prizename" v-if="record.type == 2">
                  <div>{{record.name}}</div>
                  <div>{{record.cardcode}}</div>
                </div>
                <div
                  :data-clipboard-text="record.cardcode"
                  @click="copy('recordcopy')"
                  class="operation"
                  id="copyoperation"
                  v-if="record.type == 2">复制</div>
                <div
                  class="operation"
                  v-if="record.type == 2 && record.url"
                  @click="goget(record.url)">领取</div>
                <div
                  class="operation"
                  v-if="record.type == 1"
                  @click.stop="showReceipt(record)">
                  收货地址</div>
                <div
                  class="operation"
                  v-if="record.type == 3 && record.url"
                  @click.stop="goget(record.url)">
                  立即领取</div>
              </div>
              <div class="prizedesc" v-show="record.open">{{record.prizedesc}}</div>
            </div>
            <div
              v-show="config.content.length === 0"
            >
              <img class="noimg" src="http://h5test.wostore.cn/atp_resource/upload/atpweb/2020/05/11/18b1765aaafef6192d6540e7ca3eb183.png"/>
              <p
                class="mid-text"
              >您还没有中奖记录哦</p>
            </div>
          </div>
          <div class="receipt" v-if="config.name === 'receipt'">
            <label>收件人姓名：</label>
            <el-input
              v-model="receiptInfo.realname"
              size="small"
              class="receiptnanme"
              style="width:2.16rem"
            ></el-input>
            <label>收件人手机号：</label>
            <el-input
              v-model="receiptInfo.phone"
              size="small"
              class="receiptnanme"
              style="width:2.16rem"
            ></el-input>
            <label>收货地址</label>
            <el-input
              v-model="receiptInfo.address"
              size="small"
              class="receiptnanme"
              style="width:2.16rem; height:0.3rem;"
            ></el-input>
          </div>
        <div class="modal-btns" v-if="config.btn">
          <button
            @click="clickEvent"
            class="btn"
            v-if="config.btn.isShow"
            :style="`background: ${config.btn.btnbgcolor}; color: ${config.btn.textColor}`">
            {{config.btn.text}}</button>
        </div>
      </div>
      <img alt @click="closeModal" class="modal-close" src="http://h5test.wostore.cn/atp_resource/upload//atpweb/2020/05/13/7eb8c165fa8e816f959cdda26a7b1ab6.png" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'LotteryModal',
  props: {
    config: {},
    commonLotteryConfig: {}
  },
  data() {
    return {
      records: [],
      isShowModal: false,
      receiptInfo: {
        realname: '',
        phone: '',
        address: '',
        seq: '',
        clickable: true
      },
      copyEnd: true,
      seq:""
    }
  },
  methods: {
    toggle(i) {
      if (this.copyEnd) {
        this.records[i].open = !this.records[i].open
      }
    },
    // 显示收货地址弹窗
    showReceipt(receiptdata) {
      this.$bus.$emit('newmodal', 'receipt', receiptdata)
    },
    copy(ch) {
      this.copyEnd = false
      setTimeout(() => {
        this.copyEnd = true
      }, 1000)
      if (ch === 'recordcopy') {
        const clipboard = new this.Clipboard('.operation')
        // 成功回调
        clipboard.on('success', (res) => {
          this.$toast('复制成功', 2000)
          clipboard.destroy()
        })
        // 失败回调
        clipboard.on('error', (res) => {
          this.$toast('该浏览器不支持自动复制，请您手动复制', 2000)
          clipboard.destroy()
        })
      } else {
        const clipboard = new this.Clipboard('#wincopy')
        // 成功回调
        clipboard.on('success', (res) => {
          this.$toast('复制成功', 2000)
          clipboard.destroy()
        })
        // 失败回调
        clipboard.on('error', (res) => {
          this.$toast('该浏览器不支持自动复制，请您手动复制', 2000)
          clipboard.destroy()
        })
      }
    },
    // 按钮点击事件
    clickEvent() {
      // 收件信息填写提交按钮
      if (this.config.name === 'receipt') {
        if (!this.receiptInfo.seq) {
          this.$toast('当前为预览模式，所中奖品仅为展示效果所用', 2000)
          return
        }
        if (!this.receiptInfo.realname) {
          this.$toast('请输入收件人姓名', 2000)
          return
        }
        if (!this.receiptInfo.phone) {
          this.$toast('请输入收件人手机号', 2000)
          return
        }
        if (!this.receiptInfo.address) {
          this.$toast('请输入收件人地址', 2000)
          return
        }
        if (!this.receiptInfo.clickable) {
          this.$toast('您的收件信息已提交，如需更改请联系相关客服人员', 2000)
          return
        }
        this.address()
      }
      // 实物中奖弹窗按钮跳转填写收件信息
      if (this.config.name === 'realPrize') {
        this.showReceipt(this.sequence)
      }
      if (this.config.name === 'codePrize' || this.config.name === 'noPrize' || this.config.name === 'virtualPrize') {
        if (this.config.content.url) {
          window.location.href = this.config.content.url
        }
        if (this.config.btn.url) {
          window.location.href = this.config.btn.url
        }
      }
    },
    goget(url) {
      window.location.href = url
    },
    // 收货信息提交
    address() {
      this.$post('/atpapi/act/lottery/address', this.receiptInfo).then((res) => {
        if (res.code === '0000') {
          this.$toast('收货信息已提交，请等待收货', 2000)
          this.isShowModal = false
        } else {
          this.$message({
            type: 'error',
            message: res.message,
            duration: 1500
          })
        }
      })
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
          console.log(this.config)
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
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #00000060;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  .modal {
    width: 2.7rem;
    height: 3.2rem;
    border-radius: .1rem;
    background-color: #fff;
    background-size: cover;
    .modal-title {
      margin: .12rem auto;
      width: 1.9rem;
      height: .35rem;
      line-height: .35rem;
      background: url('http://h5test.wostore.cn/atp_resource/upload//atpweb/2020/05/13/7326cdf9e94c7a7ee06fd10ceb80cada.png')
        no-repeat;
      background-size: 1.7rem .15rem;
      background-position: center;
      text-align: center;
      color: #fff;
      font-size: .25rem;
    }
    .modal-content {
      width: 2.44rem;
      height: 2.51rem;
      margin: 0 auto;
      border-radius: .08rem;
      background-color: #fff;
      overflow-y: scroll;
      .prizeimg {
        display: block;
        width: 0.58rem;
        margin: 0 auto;
        padding: 0.16rem 0 0.06rem;
      }
      .noimg{
        display: block;
        width: 0.8rem;
        margin: 0 auto;
        padding: 0.28rem 0 0.14rem;
      }
      .content {
        width: 2.17rem;
        margin: 0 auto;
        .card-code {
          margin: 0.15rem auto 0.1rem;
          // margin-top: 0.1;
          width: 1.8rem;
          height: 0.92rem;
          background-size: contain;
          background-repeat: no-repeat;
          .codetitle{
            font-size: 0.13rem;
            text-align: center;
            padding-top: 0.11rem;
          }
          .code{
            font-size: 0.13rem;
            text-align: center;
            padding-top: 0.16rem;
          }
          .copy{
            font-size: 0.12rem;
            text-align: center;
            text-decoration: underline;
          }
        }
        .small-text {
          margin-top: 0.06rem;
          max-height: 0.8rem;
          overflow-y: scroll;
          text-align: justify;
          font-size: .14rem;
          color: #454545;
          line-height: .16rem;
        }
        .mid-text {
          text-align: center;
          font-size: .15rem;
          font-weight: 700;
          color: #454545;
          line-height: .25rem;
        }
      }
      .rule-text {
        // padding: 15px 0;
        margin: 0.15rem 0.13rem;
        text-align: justify;
        font-size: 0.12rem;
        color: #454545;
        line-height: 0.16rem;
      }
      .recordarea{
        margin: 0 0.13rem 0.15rem;
        .mid-text {
          text-align: center;
          font-size: .15rem;
          font-weight: 700;
          color: #454545;
          line-height: .25rem;
        }
        .recordItem{
          border-bottom: 1px dotted #ccc;
          .record{
            // height: 44px;
            padding-bottom: 0.15rem;
            padding-top: 0.15rem;
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            .prizename{
              font-size: 0.14rem;
              color: #454545;
            }
            .operation{
              font-size: 0.12rem;
              color: #f45204;
              text-decoration: underline;
            }
          }
          .prizedesc{
            color: #454545;
            font-size: 0.09rem;
            padding-bottom: 0.1rem;
          }
        }
      }
      .receipt{
        font-size: 0.14rem;
        width: 2.17rem;
        margin: 0.15rem auto 0;
        ::v-deep .el-input--small .el-input__inner{
          height: 0.3rem;
          line-height: 0.3rem;
          border-radius: 0.15rem;
          box-shadow: inset 0px 0px 5px 2px #feeae6;
          border: none;
        }
        .receiptnanme{
          margin-top: 0.05rem;
          margin-bottom: 0.09rem;
        }
        .receiptnanme:last-child{
          margin-bottom: 0px;
        }
      }
      .modal-btns {
        padding: .12rem 0;
        text-align: center;
        button {
          width: 1.09rem;
          height: .31rem;
          border: none;
          border-radius: .16rem;
          font-size: .16rem;
          color: #fff;
          background: linear-gradient(#fe8c36, #ff5849);
          box-shadow: 0 2px 4px #a9000038;
          // text-shadow: 0 -2px 0 #c21b09;
        }
      }
    }
    .modal-close {
      display: block;
      margin: .47rem auto 0;
      width: .35rem;
      height: .35rem;
    }
  }
}
</style>
