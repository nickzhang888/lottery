<template>
  <div id="loadmore">
    <!--正在加载-->
    <p v-if="isLoading">
      <img class="loading" src="../assets/loading.gif" />
    </p>
    <!--全部数据加载完成-->
    <p v-if="$parent.length<20 ||$parent.length==0" class="bottom_line">
      <span>————</span>我是有底线的
      <span>————</span>
    </p>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      isLoading:false
    };
  },
  mounted() {
   
  }
};
</script>
<style scoped>
#loadmore {
  background-color: #ededed;
  text-align: center;
}
.loading {
  width: 1rem;
  margin: 0.2rem 0 ;
}

.bottom_line {
  
  text-align: center;
  color: #999;
  font-size: 0.13rem;
  margin: 0.2rem 0;
}
.bottom_line span {
  margin: 0 0.1rem;
}
</style>
