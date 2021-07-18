<template>
  <div id="app">
    <transition :name="transition">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'app',
  data: function() {
    return {
      transition: ''
    }
  },
  //监听组件间路由状态，判断过渡动画
  watch: {
    $route(to, from) {
      let transitionIndex = to.meta.index - from.meta.index;
      if (transitionIndex > 0) {
        this.transition = "slide-left";
      } else if (transitionIndex < 0) {
        this.transition = "slide-right";
      } else {
        this.transition = "";
      }
      this.$forceUpdate();
    }
  }
}
</script>
<style lang="scss" scoped>
 #app{
  height: 100%;
  .slide-right-enter-active,
  .slide-right-leave-active,
  .slide-left-enter-active,
  .slide-left-leave-active {
    will-change: transform;
    transition: all 0.5s;
    width: 100vw;
    position: absolute;
  }
  .slide-right-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  .slide-right-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .slide-left-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .slide-left-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
 }
</style>
