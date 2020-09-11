<template>
  <div class="previewTips" v-show="isShow">
    <div class="top">
      <img class="tipsimg" src="../assets/warningpic.png" height="201" width="244" alt="">
      <div class="title">友情提醒</div>
    </div>
    <div class="warninginfo">
      <div class="text1">{{text1}}</div>
      <div class="text2"><img src="../assets/dot.png">{{text2}}</div>
      <div class="text2"><img src="../assets/dot.png">活动中产生的中奖、奖品、表单等信息均视作无效</div>
      <div class="text2" v-if="!isTemplate"><img src="../assets/dot.png">活动中的奖品库存也不会产生任何变化</div>
    </div>
    <div class="text3">{{text3}}</div>
    <div class="text3">如有疑问，请联系相关开发人员。</div>
    <div class="iknow" @click="isShow = false">我知道了</div>
  </div>
</template>
<script>
  export default {
    props: ['isPreview'],
    data() {
      return {
        isShow: false,
        text1:'当前活动为测试预览模式，在该模式下：',
        text2: '您仍可进行活动体验，验证您配置的信息是否正确',
        text3: '在您验证无误后，可在 活动管理-活动列表中点击该活动的上线按钮将活动正式发布。',
        isTemplate: false
      }
    },
    created() {
      if (this.isPreview) {
        this.isShow = true
      }
      const actCode = this.$route.params.actCode
      if (actCode === 'ACT202009102024187840004LUpRPx') {
        this.isTemplate = true
        this.text1 = '当前为模板预览模式，在该模式下：'
        this.text2 = '您可以进行模板活动体验'
        this.text3 = '体验结束后，您可以在官网-模板中心选择您喜欢的模板-点击“立即制作”按钮开始制作属于你的活动。'
      }
    }
  }
</script>
<style lang="scss" scoped>
  .previewTips{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #f6f7fb;
    overflow: scroll;
    z-index: 1000;
    .top{
      display: flex;
      align-items: center;
      flex-direction: column;
      .tipsimg{
        width: 1.22rem;
        height: 1.0rem;
        padding-top: 0.78rem;
        margin: 0 auto;
      }
      .title{
        font-size:0.2rem;
        color: #f87851;
        font-family: '黑体';
        padding-top: 0.2rem;
      }
    }
    .warninginfo{
      width: 3.43rem;
      height: 1.4rem;
      background-color: #fff;
      margin: 0.23rem auto;
      .text1{
        padding-top: 0.15rem;
        padding-bottom: 0.13rem;
        padding-left: 0.125rem;
        font-size: 0.15rem;
        color: #333;
      }
      .text2{
        padding-bottom: 0.08rem;
        font-size: 0.14rem;
        color: #666;
        display: flex;
        align-items: center;
        img{
          padding-left:0.15rem;
          padding-right: 0.05rem;
          width: 0.05rem;
          height: 0.05rem;
        }
      }
      .text2:last-of-type{
        padding-bottom: 0;
      }
    }
    .text3{
      margin: 0 auto 0.08rem;
      width: 3rem;
      font-size: 0.13rem;
      color: #999;
    }
    .iknow{
      width: 1.55rem;
      height: 0.36rem;
      margin: 0.5rem auto 0.2rem;
      background-color:#f87851;
      color: #fff;
      border-radius: 0.18rem;
      font-size: 0.18rem;
      text-align: center;
      line-height: 0.36rem;
    }
  }
</style>