<!--
 * @Date: 2020-04-22 10:38:59
 * @LastEditors: Pengyr
 * @LastEditTime: 2020-05-14 09:36:44
 -->
<template>
  <img :style="componentStyle" :src="config.src" alt="">
</template>

<script>
import utils from '../../utils/utils'

export default {
  name: 'WoBackgroundImg',
  props: ['config'],
  computed: {
    componentStyle() {
      return utils.JSON2Style(this.config.style)
    }
  }
}
</script>

<style>

</style>
