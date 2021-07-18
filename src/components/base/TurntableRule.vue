<template>
  <div class="turntablerule" v-if="isShow">
    <div class="rulemodal">
      <div class="ruletitle">
        活动规则
      </div>
      <div class="rulecontent" v-html="config.rule.ruleText"></div>
      <div class="close" @click="closeModal">
        我知道了
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['config'],
    data() {
      return {
        isShow:false
      }
    },
    created() {
    },
    methods:{
      closeModal(){
        this.isShow = false
      }
    }
  }
</script>
<style lang="scss" scoped>
  .turntablerule{
    position: fixed;
    background: rgba(0,0,0,0.5);
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    .rulemodal{
      width: 3rem;
      height:4rem;
      background: #fff;
      border-radius: 0.09rem;
      margin: 0.60rem auto 0;
      position: relative;
      .ruletitle{
        font-size: 0.18rem;
        color: #333;
        text-align: center;
        font-family: SimHei;
        padding-top: 0.25rem;
        padding-bottom: 0.15rem;
      }
      .rulecontent{
        width: 2.6rem;
        margin: 0 auto;
        font-size:0.12rem;
        color: #666;
        height: 2.8rem;
        overflow-y: scroll;
      }
      .close{
        font-size: 0.16rem;
        color: #999;
        background: #f5f5f5;
        height: 0.44rem;
        position: absolute;
        bottom: 0;
        width: 100%;
        text-align: center;
        line-height: 0.44rem;
        border-bottom-left-radius: 0.09rem;
        border-bottom-right-radius: 0.09rem;
      }
    }
  }
</style>