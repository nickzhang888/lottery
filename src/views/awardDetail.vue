<template>
  <div>
    <div class="href_part">
      <img src="../assets/out.png" @click="goBack" class="left" />
      <p>奖励明细</p>
    </div>
    <div class="container" v-if="isShow">
      <div class="wrapper">
        <div class="whole">
          <div class="content" v-for="(item,index) in list" :key="index">
            <img src="../assets/hua.png" class="littleIcon" />
            <span class="title">{{item.prizeName}}</span>
            <span class="addNumber">{{item.prizeValue}}</span>
            <div class="sharespan">
              <span class="leftIntroduce">备注：{{item.rewardDescription}}</span>
              <span class="rightDate">{{ item.createTime }}</span>
            </div>
          </div>
        </div>
        <img src="../assets/footLine.png" class="underline" />
      </div>
    </div>
    <div class="noRecord" v-else>
      <img src="../assets/noRecord.png" class="empty" />
      <div class="lottery">
        暂无中奖记录，现在去
        <span style="color:#68a8e8">得奖励</span>
      </div>
      <img src="../assets/footLine.png" class="underline" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
      list: []
    };
  },

  methods: {
    goBack() {
      history.go(-1);
    }
  },
  mounted() {
    this.$get(
      `/atpapi/lottery/powerDetail?actId=${this.$store.state.templateInfo.id}`
    ).then(res => {
      if (res.code === "0000") {
        if (res.data.length > 0) {
          this.list = res.data;
          this.isShow = true;
        }
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.href_part {
  height: 0.43rem;
  background-color: #fff;
  display: flex;
  align-items: center;
  .left {
    width: 0.2rem;
    height: 0.2rem;
    margin-left: 0.3rem;
  }
  p {
    font-size: 0.18rem;
    //   font-weight: 500;
    color: #333;
    margin-left: 1rem;
  }
  .right {
    font-size: 0.14rem;
    color: #d53535;
    margin-left: 0.83rem;
    font-weight: 600;
  }
}
.container {
  background: #ededed;
  height: calc(100vh - 0.43rem);
  padding: 0.1rem 0.05rem 0;
  box-sizing: border-box;
  position: relative;
  .whole {
    background: #fff;
    border-radius: 0.08rem;
    padding: 0rem 0.15rem;
    height: calc(100vh - 1.36rem);
    box-sizing: border-box;

    .content {
      overflow: hidden;
      border-bottom: 0.005rem solid #ccc;
      padding: 0.225rem 0;
    }

    .littleIcon {
      float: left;
      width: 0.2rem;
      height: 0.2rem;
      margin-right: 0.1rem;
    }

    .sharespan {
      font-size: 0.12rem;
      color: #999;
      margin-top: 0.08rem;
    }

    .leftIntroduce {
      float: left;
    }

    .title {
      font-size: 0.14rem;
      font-weight: 700;
    }
    .addNumber {
      float: right;
      color: #d53535;
      font-size: 0.16rem;
    }

    .rightDate {
      float: right;
      font-size: 0.12rem;
    }

    .redTip {
      color: #d53535;
      font-size: 0.12rem;
    }
  }
}
.underline {
  width: 2.12rem;
  height: 0.12rem;
  position: absolute;
  left: 50%;
  bottom: 5%;
  transform: translate(-50%, -50%);
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
