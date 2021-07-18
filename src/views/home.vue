<template>
  <div id="index" :style="{backgroundColor:bgColor,}">
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
      bgColor: '',
      bgImg: ''
    }
  },
  methods: {
    getTemplate() {
      const { actCode } = this.$route.params
      const str = this.$route.query.str;
      if (str) {
        this.$store.dispatch("getStatus",str).then(res=>{
          if(res.code !== "4047"){
            this.$router.push({
              name:"invitationLink"
            })
          }
        })
      }
      // this.$store.commit('updateTemplateInfo', actCode)
      // this.template = this.$store.state.templateInfo.actContent
      // const currentBg = this.template[0].find(item => item.name === "WoBackgroundColor")
      // currentBg && (this.bgcolor = currentBg.bgcolor)
      //以下是发起请求的
      this.$store.dispatch('getTemplateInfo', actCode).then((res) => {
        if(res.data.data){
          document.title = res.data.data.title 
          this.template = JSON.parse(this.$store.state.templateInfo.actContent)
          Array.isArray(this.template[0]) ? this.template[0].forEach((item) => {
            if (item.name === 'WoBackgroundColor') {
              this.bgColor = item.bgcolor
            }
            if (item.name === 'WoBackgroundImg') {
              this.bgImg = item.src
            }
          }):""
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
  height:100%;
  background-size: cover;
  background-repeat: no-repeat;
}
#index::-webkit-scrollbar{
  display: none;
}
</style>
