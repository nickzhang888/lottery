<template>
  <div class="awardDetail">
    <div class="href_part">
      <img src="../assets/out.png" @click="goBack" class="left" />
      <p>奖励明细</p>
    </div>
    <div class="container" v-if="isShow">
      <div class="wrapper">
        <div class="whole">
          <div class="content" v-for="(item,index) in list" :key="index">
            <div class="top">
              <div>
                <img :src="item.imgUrl" class="littleIcon" />
                <span class="title">{{item.prizeName}}</span>
              </div>
              <span class="addNumber">+{{item.prizeValue}}</span>
            </div>
            <div class="sharespan">
              <span class="leftIntroduce">备注：{{item.rewardDescription}}</span>
              <span class="rightDate">{{ item.createTime }}</span>
            </div>
          </div>
        </div>
        <!-- <img src="../assets/footLine.png" class="underline" /> -->
      </div>
    </div>
    <div class="noRecord" v-else>
      <img src="../assets/noRecord.png" class="empty" />
      <div class="lottery">
        暂无中奖记录，现在去
        <span style="color:#68a8e8" @click="goBack">得奖励</span>
      </div>
      <!-- <img src="../assets/footLine.png"  /> -->
    </div>
    <!-- <p class="underline">
        ———— 我是有底线的 ————
    </p>-->
    <load-more ref="loading"></load-more>
  </div>
</template>
<script>
import loadMore from "./loadMore.vue";
import api from "../utils/api";

export default {
  data() {
    return {
      isShow: true,
      list: [],
      page:1,
      length : 0,
    };
  },
  components: {
    loadMore
  },

  methods: {
    goBack() {
      history.go(-1);
    },
    getInfo() {
      this.$refs.loading.isLoading = true;
      this.$get(
        `/atpapi/lottery/powerDetail?actId=${this.$route.query.id}&page=${this.page}&pageSize=20`
      ).then(res => {
        if (res.code === "0000") {
          this.length = res.data.length;
          if (res.data.length > 0) {
            setTimeout(() => {
               this.$refs.loading && (this.$refs.loading.isLoading = false);
            }, 1000);
            this.list = [...this.list, ...res.data];
            this.isShow = true;
          } else {
            this.$refs.loading.isLoading = false
            if (this.page == 1) {
              this.isShow = false;
            } else {
              window.removeEventListener("scroll", this.handleScroll);
            }
          }
        }
      });
    },
    handleScroll() {
      api.loadmore(() => {
        this.page++;
        this.getInfo();
      });
    }
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    this.getInfo();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  }
};
</script>

<style lang="scss" scoped>
.awardDetail {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.href_part {
  position: fixed;
  width: 100%;
  height: 0.43rem;
  background-color: #fff;
  display: flex;
  align-items: center;
  z-index: 10;

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
  flex: 1;
  background: #ededed;
  // height: calc(100vh - 0.43rem);
  padding: 0.53rem 0.05rem 0;
  box-sizing: border-box;
  position: relative;
  .whole {
    background: #fff;
    border-radius: 0.08rem;
    padding: 0rem 0.15rem;
    box-sizing: border-box;

    .content {
      overflow: hidden;
      border-bottom: 0.005rem solid #ccc;
      padding: 0.225rem 0;
      .top {
        display: flex;
        justify-content: space-between;
      }
    }
    .content:last-of-type {
      border-bottom: none;
    }

    .littleIcon {
      float: left;
      width: 0.2rem;
      height: 0.2rem;
      margin-right: 0.1rem;
    }

    .sharespan {
      display: flex;
      justify-content: space-between;
      font-size: 0.12rem;
      color: #999;
      margin-top: 0.08rem;
    }

    .leftIntroduce {
      margin-right: 0.1rem;
      flex: 1;
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
      // float: right;
      font-size: 0.12rem;
    }

    .redTip {
      color: #d53535;
      font-size: 0.12rem;
    }
  }
}
.underline {
  font-size: 0.12rem;
  flex: 0;
  background-color: #ededed;
  color: #999;
  padding-top: 0.4rem;
  padding-bottom: 0.3rem;
  text-align: center;
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
