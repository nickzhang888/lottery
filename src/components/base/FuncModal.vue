<template functional>
  <div id="lottery-modal" v-if="parent.isShowModal">
    <div class="modal" :style="`background-image: url(${props.commonturntableConfig.bgImg})`">
      <div class="modal-title">{{props.config.title}}</div>
      <div class="modal-content">
        <img class="prizeimg" :src="props.config.content.img" alt v-if="props.config.content.img" />
        <img class="noimg" :src="props.config.content.noimg" alt v-if="props.config.content.noimg" />
        <div class="content">
          <div
            class="card-code"
            :style="`background-image: url(${props.config.content.codebg})`"
            v-if="props.config.content.codebg"
          >
            <div class="codetitle">兑换码</div>
            <div class="code">{{props.config.content.cardcode}}</div>
            <div 
              class="copy"
              :data-clipboard-text="props.config.content.cardcode"
              @click="parent.handleCopy"
            >
              复制券码
            </div>
          </div>
          <!-- 奖品说明 -->
          <p
            :class="props.config.btn.isShow? 'small-text' : 'small-text-nobtn'"
            v-html="props.config.content.smallText"
            v-if="props.config.content.smallText"
          ></p>
          <!-- 提示信息 -->
          <p class="mid-text" v-html="props.config.content.midText" v-if="props.config.content.midText"></p>
        </div>
        <div class="rule-text" v-html="props.config.content.ruleText" v-if="props.config.content.ruleText"></div>
        <slot></slot>
        <div class="modal-btns" v-if="props.config.btn">
          <button
            class="btn"
            v-if="parent.isShowBtn"
            :style="`background: ${props.config.btn.btnbgcolor}; color: ${props.config.btn.textColor}`"
            @click="parent.handleClick"
          >{{props.config.btn.text}}</button>
        </div>
      </div>
      <img alt class="modal-close" src="../../assets/lottery-close.png" @click="parent.closeModal" />
    </div>
  </div>
</template>
<script>
export default {
  //  props: ["value"],
}
</script>
<style lang="scss" scoped>
#lottery-modal {
  position: fixed;
  top: 0;
  left:0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  .modal {
    position: relative;
    width: 3rem;
    height: 3.78rem;
    border-radius: 0.10rem;
    // background-color: #fff;
    background-size: contain;
    background-repeat: no-repeat;
    .modal-title {
      margin: 0.06rem auto 0.24rem;
      width: 1.90rem;
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
        width: 1.10rem;
        height: 1.10rem;
        margin: 0 auto;
        padding: 0.16rem 0 0.06rem;
      }
      .noimg {
        display: block;
        width: 1.2rem;
        margin: 0 auto;
        padding: 0.28rem 0 0.20rem;
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
        margin: 0.15rem 0.30rem;
        text-align: justify;
        font-size: 0.12rem;
        color: #454545;
        line-height: 0.16rem;
        height: 2.40rem;
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
            padding-bottom: 0.10rem;
          }
        }
      }
      .receipt {
        font-size: 0.14rem;
        width: 2.44rem;
        margin: 0.40rem auto 0.30rem;
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