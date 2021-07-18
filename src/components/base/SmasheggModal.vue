<template>
  <div>
    <FuncModal
      :config="config"
      :commonturntableConfig="commonturntableConfig"
    >
      <slot>
        <div class="receipt" v-if="config.name === 'receipt'">
          <el-input
            size="small"
            class="receiptnanme"
            placeholder="请填写收件人姓名"
            v-model="receiptInfo.realname"
          ></el-input>
          <el-input
            size="small"
            class="receiptnanme"
            placeholder="请填写收件人手机号码"
            v-model="receiptInfo.phone"
          ></el-input>
          <el-input
            size="small"
            class="receiptnanme"
            placeholder="请填写收货地址"
            v-model="receiptInfo.address"
          ></el-input>
        </div>
      </slot>
    </FuncModal>
  </div>
</template>
<script>
import { mixinModal } from "@/mixin/mixinModal.js"
export default {
  name: "SmasheggModal",
  props: {
    config: {},
    commonturntableConfig: {},
  },
  mixins:[mixinModal],
};
</script>
<style lang="scss" scoped>
#lottery-modal {
  position: fixed;
  top: 0;
  left:0;
  width: 100%;
  height: 100%;
  background-color: #00000060;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  .modal {
    position: relative;
    width: 3rem;
    height: 3.78rem;
    border-radius: 0.1rem;
    // background-color: #fff;
    background-size: contain;
    background-repeat: no-repeat;
    .modal-title {
      margin: 0.06rem auto 0.24rem;
      width: 1.9rem;
      height: 0.35rem;
      line-height: 0.35rem;
      text-align: center;
      color: #fff;
      font-size: 0.21rem;
    }
    .modal-content::-webkit-scrollbar {
      // display: none;
    }
    .modal-content {
      width: 2.44rem;
      // height: 251px;
      margin: 0 auto;
      border-radius: 0.08rem;
      // background-color: #fff;
      // overflow-y: scroll;
      .prizeimg {
        display: block;
        width: 1.1rem;
        height: 1.1rem;
        margin: 0 auto;
        padding: 0.16rem 0 0.06rem;
      }
      .noimg {
        display: block;
        width: 1.2rem;
        margin: 0 auto;
        padding: 0.28rem 0 0.2rem;
      }
      .content {
        // width: 255px;
        margin: 0px auto 0;
        .card-code {
          margin: 0.45rem auto 0;
          width: 2.04rem;
          height: 1.12rem;
          background-size: contain;
          background-repeat: no-repeat;
          color: #fff;
          .codetitle {
            font-size: 0.13rem;
            text-align: center;
            padding-top: 0.11rem;
          }
          .code {
            font-size: 0.16rem;
            text-align: center;
            padding-top: 0.04rem;
          }
          .copy {
            padding-top: 0.04rem;
            font-size: 0.12rem;
            color: #fff7b3;
            text-align: center;
            text-decoration: underline;
          }
        }
        .small-text {
          // margin-top: 15px;
          max-height: 0.96rem;
          overflow-y: scroll;
          text-align: justify;
          font-size: 0.14rem;
          color: #666;
          line-height: 0.16rem;
        }
        .small-text-nobtn {
          margin-top: 0.06rem;
          max-height: 1rem;
          overflow-y: scroll;
          text-align: justify;
          font-size: 0.14rem;
          color: #454545;
          line-height: 0.16rem;
        }
        .mid-text {
          text-align: center;
          font-size: 0.15rem;
          font-weight: 700;
          color: #9f8981;
          line-height: 0.25rem;
          // margin-top: 56px;
        }
      }
      .rule-text {
        // padding: 15px 0;
        margin: 0.15rem 0.3rem;
        text-align: justify;
        font-size: 0.12rem;
        color: #454545;
        line-height: 0.16rem;
        height: 2.4rem;
        overflow-y: scroll;
      }
      .recordarea {
        margin: 0px 0.13rem 0.15rem;
        .recordItem {
          border-bottom: 0.01rem dotted #ccc;
          .record {
            // height: 44px;
            padding-bottom: 0.15rem;
            padding-top: 0.15rem;
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            .prizename {
              font-size: 0.14rem;
              color: #454545;
            }
            .operation {
              font-size: 0.12rem;
              color: #f45204;
              text-decoration: underline;
            }
          }
          .prizedesc {
            color: #454545;
            font-size: 0.09rem;
            padding-bottom: 0.1rem;
          }
        }
      }
      .receipt {
        font-size: 0.14rem;
        width: 2.44rem;
        margin: 0.4rem auto 0.3rem;
        ::v-deep .el-input--small .el-input__inner {
          font-size: 0.15rem;
          height: 0.48rem;
          line-height: 0.48rem;
          border-radius: 0.24rem;
          border: none;
          background: #f7f8fa;
        }
        .receiptnanme {
          margin-top: 0.05rem;
          margin-bottom: 0.09rem;
        }
        .receiptnanme:last-child {
          margin-bottom: 0px;
        }
      }
      .modal-btns {
        padding: 0.12rem 0;
        text-align: center;
        button {
          width: 1.5rem;
          height: 0.4rem;
          border: none;
          border-radius: 0.2rem;
          font-size: 0.18rem;
          color: #fff;
          background: linear-gradient(#ffdf45, #f8701c);
          // box-shadow: 0 0.02rem 0.04rem #ffe277;
          // text-shadow: 0 -0.02rem 0 #c21b09;
        }
      }
    }
    .modal-close {
      display: block;
      position: absolute;
      bottom: -0.5rem;
      left: 44%;
      width: 0.35rem;
      height: 0.35rem;
    }
  }
}
</style>
