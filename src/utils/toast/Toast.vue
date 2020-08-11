<!-- eslint-disable  -->
<template>
  <transition name="demo">
    <div class="toast" v-if="show">
      <div class="modal">
        <div>{{ message }}</div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'toast',
  data() {
    return {
      message: '',
      show: false
    }
  }
}
</script>

<style lang='scss' scoped>
.toast {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
    .modal {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(0, 0, 0, 0.7);
        border-radius: 0.05rem;
        color: #fff;
        max-width: 80%;
        div {
            padding: 0.1rem 0.051rem;
            font-size: 0.14rem;
            text-align: center;
            line-height: 0.18rem;
        }
    }
}
.demo-enter-active,
    .demo-leave-active {
        transition: 0.3s ease-in;
    }

    .demo-enter {
        opacity: 0;
        // transform: scale(1.2);
    }

    .demo-leave-to {
        opacity: 0;
        // transform: scale(0.8);
    }
</style>
