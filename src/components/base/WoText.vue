<!--
 * @Date: 2020-04-22 10:38:59
 * @LastEditors: Pengyr
 * @LastEditTime: 2020-05-13 15:43:21
 -->
<template>
  <p :style="componentStyle">{{config.text}}</p>
</template>

<script>
import utils from '../../utils/utils'

export default {
  name: 'WoText',
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
