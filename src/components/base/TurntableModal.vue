<template>
  <div id="lottery" v-if="isShowModal" >
    <div class="modal" :style="`background-image: url(${commonturntableConfig.bgImg})`" >
      <div class="modal-title">{{config.title}}</div>
      <div class="modal-content">
        <img class="prizeimg" :src="config.content.img.src||config.content.img" alt v-if="config.content.img" />
        <img class="noimg" :src="config.content.noimg" alt v-if="config.content.noimg" />
        <div class="content">
          <div
            class="card-code"
            :style="`background-image: url(${config.content.codebg})`"
            v-if="config.content.codebg"
          >
            <div class="codetitle">兑换码</div>
            <div class="code" >{{config.content.cardcode}}</div>
            <div 
              class="copy" 
              id="wincopy"
              @click="copy"  
              :data-clipboard-text="config.content.cardcode"
            >
              复制
            </div>
          </div>
          <!-- 奖品说明 -->
          <p
            :class="config.btn.isShow? 'small-text' : 'small-text-nobtn'"
            v-html="config.content.smallText"
            v-if="config.content.smallText"
          ></p>
          <!-- 提示信息 -->
          <p class="mid-text" v-html="config.content.midText" v-if="config.content.midText"></p>
        </div>
        <div class="rule-text" v-html="config.content.ruleText" v-if="config.content.ruleText"></div>
        <div class="receipt" v-if="config.name === 'receipt'">
          <label>收件人姓名：</label>
          <el-input size="small" class="receiptnanme" v-model="receiptInfo.realname"></el-input>
          <label>收件人手机号：</label>
          <el-input size="small" class="receiptnanme" v-model="receiptInfo.phone"></el-input>
          <label>收货地址</label>
          <el-input size="small" class="receiptnanme" v-model="receiptInfo.address"></el-input>
        </div>
        <div class="modal-btns" v-if="config.btn">
          <button
            class="btn"
            @click="handleClick"
            v-if="isShowBtn"
            :style="`background: ${config.btn.btnbgcolor}; color: ${config.btn.textColor}`"
          >{{config.btn.text}}</button>
        </div>
      </div>
      <img alt class="modal-close" src="../../assets/lottery-close.png" @click="closeModal" />
    </div>
  </div>
</template>
<script>
import { mixinModal } from "@/mixin/mixinModal.js"
export default {
  name: "TurntableModal",
  props: {
    config: {},
    commonturntableConfig: {}
  },
  mixins:[mixinModal],
  
};
</script>
<style lang="scss" scoped>
#lottery{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  .modal {
    position: fixed;
    width: 3.41rem;
    height: 4.2rem;
    border-radius: 0.01rem;
    // background-color: #fff;
    background-size: contain;
    background-repeat: no-repeat;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .modal-title {
      margin: 0.56rem auto 0;
      width: 1.9rem;
      height: 0.35rem;
      line-height: 0.35rem;
      text-align: center;
      color: #666;
      font-size: 0.36rem;
      font-family: SimHei;
      font-weight: 600;
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
        width: 1rem;
        height: 1rem;
        margin: 0 auto;
        padding: 0.16rem 0 0.06rem;
      }
      .noimg {
        display: block;
        width: 0.9rem;
        margin: 0 auto;
        padding: 0.28rem 0 0.14rem;
      }
      .content {
        // width: 255px;
        margin: 0 auto 0;
        .card-code {
          margin: 0 auto;
          margin-top: 0.2rem;
          width: 1.8rem;
          height: 1.02rem;
          background-size: contain;
          background-repeat: no-repeat;
          .codetitle {
            font-size: 0.13rem;
            text-align: center;
            padding-top: 0.11rem;
          }
          .code {
            font-size: 0.13rem;
            text-align: center;
            padding-top: 0.16rem;
          }
          .copy {
            font-size: 0.12rem;
            text-align: center;
            text-decoration: underline;
          }
        }
        .small-text {
          margin-top: 0.56rem;
          max-height: 0.5rem;
          overflow-y: scroll;
          text-align: justify;
          font-size: 0.14rem;
          color: #fff;
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
          color: #fff;
          line-height: 0.25rem;
          margin-top: 0.56rem;
        }
      }
      .rule-text {
        // padding: 15px 0;
        margin: 0.15rem 0.30rem;
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
          border-bottom: 1px dotted #ccc;
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
        width: 2rem;
        margin: 0.15rem auto 0;
        ::v-deep .el-input--small .el-input__inner {
          height: 0.3rem;
          line-height: 0.3rem;
          border-radius: 0.15rem;
          box-shadow: inset 0px 0px 5px 2px #feeae6;
          border: none;
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
          width: 1.09rem;
          height: 0.4rem;
          border: none;
          border-radius: 0.08rem;
          font-size: 0.18rem;
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
      bottom: -0.26rem;
      left: 44%;
      width: 0.35rem;
      height: 0.35rem;
    }
  }
}
</style>
