<!--
 * @Date: 2020-04-22 10:38:59
 * @LastEditors: Pengyr
 * @LastEditTime: 2020-05-13 11:44:57
 -->
<template>
  <img :style="componentStyle" :src="config.src" @click="btnclick" alt="">
</template>

<script>
import utils from '../../utils/utils'

export default {
  name: 'WoImg',
  props: ['config'],
  computed: {
    componentStyle() {
      return utils.JSON2Style(this.config.style)
    }
  },
  methods: {
    btnclick() {
      if (this.config.url) {
        window.location.href = this.config.url
      }
    }
  }
}
</script>

<style>

</style>
