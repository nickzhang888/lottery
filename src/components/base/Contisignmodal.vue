<template>
  <div id="lottery-modal" v-if="isShow">
    <div class="modal" :style="`background-image: url(${commonContisignConfig.bgImg})`">
      <div class="modal-title">{{config.title}}</div>
      <div class="modal-content">
        <div class="content">您已完成连续{{contisignDays}}天签到，获取{{prizeName}}！</div>
        <div class="modal-btns" v-if="config.btn">
          <button
            @click="close"
            class="btn"
            v-if="config.btn.isShow"
            :style="`background: ${config.btn.btnbgcolor}; color: ${config.btn.textColor}`"
          >{{config.btn.text}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ContisignModal",
  props: {
    config: {},
    commonContisignConfig: {}
  },
  data() {
    return {
      isShow:false,
      contisignDays: '',
      prizeName: ""
    };
  },

  methods: {
    close() {
      this.isShow = false;
    }
  },
  created() {
    this.$bus.$on("showModal", (prizename, days) => {
      this.prizeName = prizename
      this.contisignDays = days
      this.isShow = true;
    });
  }
};
</script>
<style lang="scss" scoped>
#lottery-modal {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #00000060;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  .modal {
    position: relative;
    width: 2.72rem;
    height: 3.12rem;
    border-radius: 0.1rem;
    // background-color: #fff;
    background-size: contain;
    background-repeat: no-repeat;
    .modal-title {
      margin: 0.56rem auto 0;
      width: 1.9rem;
      height: 0.35rem;
      line-height: 0.35rem;
      text-align: center;
      color: #ff6753;
      font-size: 0.36rem;
      font-family: SimHei;
      font-weight: 600;
    }
    .modal-content {
      width: 2.44rem;
      // height: 251px;
      margin: 0 auto;
      border-radius: 0.08rem;
      font-size: 0.16rem;
      color: #333;
      .prizeimg {
        display: block;
        width: 1rem;
        height: 1rem;
        margin: 0 auto;
        padding: 0.16rem 0 0.06rem;
      }
      .noimg {
        display: block;
        width: 0.9px;
        margin: 0 auto;
        padding: 0.28rem 0 0.14rem;
      }
      .content {
        width: 1.8rem;
        margin: 0.33rem auto 0;
        font-family: SimHei;
        text-align: center;
      }
      .modal-btns {
        padding: 0.4rem 0 0;
        text-align: center;
        button {
          width: 0.85rem;
          height: 0.3rem;
          border: none;
          border-radius: 0.08rem;
          font-size: 0.18rem;
          font-weight: 600;
          font-family: SimHei;
          color: #ff523e;
          background: linear-gradient(#ffe277, #ffc63b);
          box-shadow: 0 0.02rem 0.06rem #e6c99d;
        }
      }
    }
  }
}
</style>
