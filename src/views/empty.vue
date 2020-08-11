<template>
  <div class="wrapper">
    <div class="stroll">
      <!-- <img src="../assets/button.png" alt /> -->
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {},
  created() {}
};
</script>
<style lang="scss" scoped>
.wrapper {
  background: url(../assets/expection.png) no-repeat center/100% 100%;
  height: 100vh;
  position: relative;
  .stroll {
    position: absolute;
    left: 50%;
    top: 60%;
    transform: translate(-50%, -50%);
  }
}
</style>
