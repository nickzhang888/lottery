<template>
  <div id="index">
    <component
      :config="com"
      :is="com.name"
      :key="com.cid"
      v-for="com in template"></component>
  </div>
</template>
<script>

export default {
  data() {
    return {
      template: [],
      actId: '',
    }
  },
  methods: {
    getTemplate() {
      const { actCode } = this.$route.params
      this.$store.dispatch('getTemplateInfo', actCode).then((res) => {
        if(res.data.data){
          this.actId = res.data.data.id
          this.template = JSON.parse(this.$store.state.templateInfo.actContent)
          console.log('接口actcontent', this.template)
          // const urls = {
          //   codeUrl: false,
          //   virtualUrl: false
          // }
          // if (this.template[1].modal.signPrize.btn.url) {
          //   urls.codeUrl = true
          // }
          // if (this.template[1].modal.virtualPrize.btn.url) {
          //   urls.virtualUrl = true
          // }
          // this.$bus.$emit('btnurl', urls)
        }else{
          this.$router.push({
            name:"empty"
          })
        }
      })
    }
  },
  created() {
    this.getTemplate()
  }
}
</script>
<style scoped>
#index {
  width: 3.75rem;
  overflow-x: hidden;
  position: relative;
  min-height: 100vh;
  height: 100%;
}
</style>
