<template>
  <div class="container">
    <div class="href_part">
      <img src="../assets/out.png" @click="goBack" class="left" />
      <p>助力抽奖</p>
      <span class="right" @click="awardDetail">奖励明细</span>
    </div>
    <div class="wrapper">
      <div>
        <img src="../assets/banner.png" class="firstImg" />
      </div>
      <div class="second" v-if="isTip">
        <div>任务奖励及时发放，获得的抽奖机会需在当日用完，次日清空。</div>
      </div>
      <div class="third">
        <div class="content" v-for="(item) in missionSupport" :key="item.id">
          <div class="title">
            {{item.name}}
            <span class="redTip" v-if="item.name.includes('签到')">（已连续签到3天）查看记录></span>
          </div>
          <div class="shareText">
            <div class="leftIntroduce">
              {{item.description}}
              <!-- <br /> -->
            </div>
            <button class="rightBtn" @click="goUrl(item.redirectUrl)">{{item.btnText}}</button>
          </div>
        </div>
        <div class="footText">
          <div>更多助力任务敬请期待~~~</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isTip: true,
      missionSupport: []
    };
  },

  methods: {
    goUrl(url){
       location.href = url
    },
    awardDetail() {
      this.$router.push({
        name: "awardDetail"
      });
    },
    goBack() {
      history.go(-1);
    },
    async getData(){
      const actid = this.$store.state.templateInfo.id;
      const res = await this.$get(`/atpapi/lottery/powerTask/${actid}`);
      this.missionSupport = res.data
    }
  },
  mounted() {
     this.getData()
  },
};
</script>

<style lang="scss" scoped>
.container {
  background: #ededed;
  height: 100vh;
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
      //   font-weight: 600;
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
  .wrapper {
    padding: 0.1rem;
    .firstImg {
      width: 100%;
      height: 0.8rem;
    }

    .second {
      height: 0.4rem;
      line-height: 0.4rem;
      text-align: center;
      font-size: 0.12rem;
      background-color: #fff;
      margin-top: 0.07rem;
      border-radius: 0.08rem;
    }

    .third {
      background: #fff;
      margin-top: 0.1rem;
      border-radius: 0.08rem;
      padding: 0.05rem 0.14rem 0 0.1rem;
      height: calc(100vh - 2.03rem);
      box-sizing: border-box;
      .content {
        overflow: hidden;
        border-bottom: 0.005rem solid #ccc;
        padding: 0.15rem 0;
      }

      .shareText {
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

      .rightBtn {
        float: right;
        background: #d53535;
        color: #fff;
        width: 0.45rem;
        line-height: 0.2rem;
        font-size: 0.12rem;
        // margin-top: 0.1rem;
        border: none;
        border-radius: 0.03rem;
      }

      .redTip {
        color: #d53535;
        font-size: 0.12rem;
      }

      .footText {
        font-size: 0.14rem;
        text-align: center;
        color: #999;
        margin-top: 1rem;
      }
    }
  }
}
</style>
