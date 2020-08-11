<!--
 * @Date: 2020-05-13 10:10:51
 * @LastEditors: Pengyr
 * @LastEditTime: 2020-05-22 14:43:32
 -->
<template>
  <div id="lottery" :style="{'background-color':config.background.bgcolor}">
    <previewTips :isPreview="isPreview"></previewTips>
    <div class="previewWarning" v-if="isPreview">
      {{previewWarning}}
    </div>
    <img :src="config.background.src" class="bg" />
    <div class="content">
      <div class="container">
        <img :src="config.lottery.pointerSrc.src" @click="startLottery" class="pointer" />
        <div
          :style="`background-image: url(${config.lottery.bgSrc.src});
            transform: ${rotate_angle};transition: ${rotate_transition}`"
          class="turn"
        >
          <div class="prize">
            <img
              :key="i"
              :src="prize.src"
              :style="prizePosition(i)"
              v-for="(prize, i) in config.lottery.prizes"
            />
          </div>
        </div>
      </div>
      <div class="btns">
        <img :src="config.lotteryRecord.src" @click="lotteryReord" alt />
        <img :src="config.rule.src" @click="goRule" alt />
      </div>
    </div>
    <LotteryModal
      :config="currentModal"
      :commonLotteryConfig="config.modal['commonConfig']"
      ref="lotteryModal"
    ></LotteryModal>
  </div>
</template>
<script>
import utils from '../../utils/utils'
import previewTips from '../previewTips.vue'
import LotteryModal from './LotteryModal.vue'

export default {
  name: 'WoLottery',
  components: { LotteryModal, previewTips },
  data() {
    return {
      previewWarning: this.actCode === 'ACT202007161444096550000S4rjUn' ? '当前为模板预览模式，请勿将链接泄漏外传。' : '当前为测试预览模式，请勿将链接泄漏外传。',
      actCode: '',
      type: '',
      result_angle: [22, 67, 112, 157, 202, 247, 292, 337],
      currentModal: this.config.modal.rule,
      rotate_angle: '', // 旋转角度
      rotate_transition: 'transform 4s cubic-bezier(0.25,0.1,0.25,1)', // 初始化指针过渡属性控制
      click_flag: true,
      // 中奖格子
      targetCell: 1,
      origin_angle: 0,
      currentEnv:"",
    }
  },
  props: {
    config: {}
  },
  computed: {
    getUserinfo() {
      return this.$store.state.userInfo
    },
    isPreview() {
      const { onlineStatus } = this.$store.state.templateInfo
      if ( onlineStatus=== 1) {
        return false
      }
      // gpp generate preview picture 用于生成的预览图的链接
      if (this.$route.query.gpp === '1') {
        return false
      }
      return true
    }
  },
  methods: {
    prizePosition(index) {
      const radius = 100 // 格子圆半径
      const offsetLeft = 150 // 圆心偏移量
      const offsetTop = 140 // 圆心偏移量
      const total = 8 // 总计格子数量
      const ahd = ((360 / total) * Math.PI) / 180
      const prizeWidth = 46
      const prizeHeight = 68
      return {
        left: `${utils.px2rem(Math.sin(ahd * (-index) - (9 / 8) * Math.PI) * radius + offsetLeft)}rem`,
        top: `${utils.px2rem(Math.cos(ahd * (-index) - (9 / 8) * Math.PI) * radius + offsetTop)}rem`,
        transform: `rotate(${this.result_angle[index]}deg)`,
        'transform-origin': `${utils.px2rem(prizeWidth / 2)}rem ${utils.px2rem(prizeHeight / 2)}rem`
      }
    },
    startLottery() {
      const { actCode } = this.$route.params
      const { onlineStatus } = this.$store.state.templateInfo
      if ( onlineStatus === 1) {
        // 已上线
        this.type = 0
      } else {
        // 未上线、已下线 也就是预览模式
        this.type = 1
      }
      console.log('type', this.type)
      if (!this.click_flag) return
      if(this.currentEnv =='notSmallRoutine'){
        this.$get(`/atpapi/act/lottery/start/actPath/${actCode}/${this.type}`).then((res) => {
        if (res.code === '0000') {
          if (res.data) {
            this.targetCell = res.data.prizeCellIndex
            this.lotteryRotate(this.targetCell)
            // prizeType 1:实物 2:卡券 3:虚拟 4:未中奖
            if (res.data.prizeType === 1) {
              this.currentModal = this.config.modal.realPrize
              // 奖品图片取自编辑器配置的图片
              this.currentModal.content.img =
              this.config.lottery.prizes[this.targetCell - 1]
              // 奖品描述
              this.currentModal.content.smallText = res.data.prizeDesc
              this.currentModal.content.seq = res.data.seq
            } else if (res.data.prizeType === 2) {
              this.currentModal = this.config.modal.codePrize
              // 中奖券码
              this.currentModal.content.cardcode = res.data.prizeCode
              this.currentModal.content.smallText = res.data.prizeDesc
              this.currentModal.content.url = res.data.url
            } else if (res.data.prizeType === 3) {
              // 虚拟奖品
              this.currentModal = this.config.modal.virtualPrize
              this.currentModal.content.img =
              this.config.lottery.prizes[this.targetCell - 1]
              this.currentModal.content.smallText = res.data.prizeDesc
              this.currentModal.content.url = res.data.url
            } else if (res.data.prizeType === 4) {
              // 未中奖
              this.currentModal = this.config.modal.noPrize
            }
          } else {
            // 异常通用提示信息
            this.currentModal = this.config.modal.commonTip
            this.currentModal.content.midText = '您暂未配置该活动'
            this.$bus.$emit('showModal')
          }
        } else {
          // 异常通用提示信息
          this.currentModal = this.config.modal.commonTip
          this.currentModal.content.midText = res.message
          this.$bus.$emit('showModal')
        }
        })
      }else{
        wx.miniProgram.navigateTo({
          url: '/pages/login/login',
        })
      }
    },
    lotteryRotate(targetCell) {
      const during_time = 3 // 旋转时间
      const result_angle = [22, 67, 112, 157, 202, 247, 292, 337].reverse() // 最终会旋转到下标的位置所需要的度数
      const rand_circle = 5 // 附加多转几圈
      this.click_flag = false // 旋转结束前，不允许再次触发
      const rotate_angle =
        this.origin_angle + (rand_circle * 360) +
        result_angle[targetCell - 1] - (this.origin_angle % 360)
      this.origin_angle = rotate_angle
      // 转动
      this.rotate_angle = `rotate(${rotate_angle}deg)`

      // 旋转结束后，允许再次触发
      setTimeout(() => {
        this.click_flag = true
        this.$bus.$emit('showModal')
         console.log('转完', this.currentModal.content.seq)
        this.$refs.lotteryModal.sequence= this.currentModal.content.seq
      }, during_time * 1000 + 1000) // 延时，保证转盘转完
    },
    lotteryReord() {
      const param = {
        page: 1,
        pageSize: 100
      }
      const actid = this.$store.state.templateInfo.id
      this.$get(`/atpapi/act/lottery/act/record/${actid}`, { params: param }).then((res) => {
        console.log('record', res)
        if (res.code === '0000') {
          this.currentModal = this.config.modal.myPrize
          this.currentModal.content = res.data
          this.$bus.$emit('showModal')
        }
      })
    },
    goRule() {
      this.currentModal = this.config.modal.rule
      this.$bus.$emit('showModal')
    }
  },
  created() {
    this.currentEnv = utils.judgeEv();
    document.title = this.$store.state.templateInfo.title || this.$store.state.templateInfo.name
    this.$bus.$on('newmodal', (modalname, receiptdata) => {
      this.currentModal = this.config.modal[modalname]
      this.$bus.$emit('showModal', receiptdata)
    })
    console.log(this.currentEnv);
  }
}
</script>
<style lang="scss" scoped>
#lottery {
  // min-height: 100vh;
  height: 100%;
  // position: fixed;
  .previewWarning{
    text-align: center;
    background-color: rgba(0,0,0,0.6);
    position: fixed;
    font-size: 0.16rem;
    color: #fff;
    width: 3.75rem;
    height: 0.4rem;
    line-height: 0.4rem;
    z-index: 10;
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
    top: 1.72rem;
    .container {
      position: relative;
      margin: 0 auto;
      width: 3.45rem;
      height: 3.45rem;
      display: flex;
      justify-content: center;
      align-items: center;
      .pointer {
        display: block;
        width: 0.84rem;
        margin-top: -0.25rem;
        position: absolute;
        top: 54%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
      }
      .turn {
        background-repeat: no-repeat;
        background-size: cover;
        width: 3.45rem;
        height: 3.45rem;
        .prize {
          width: 100%;
          height: 100%;
          position: absolute;
          img {
            position: absolute;
            width: 0.46rem;
            height: 0.68rem;
          }
        }
      }
    }
    .btns {
      margin: 0.4rem auto 0;
      display: flex;
      justify-content: space-around;
      img {
        width: 1.69rem;
        height: 0.65rem;
      }
    }
  }
}
</style>
