<template>
  <vuedraggable class="wrapper" v-model="list">
    <transition-group>
      <div v-for="item in list" :key="item" class="item">
        <p>{{item}}</p>
      </div>
    </transition-group>
  </vuedraggable>
</template>

<script>
import vuedraggable from 'vuedraggable';

export default {
  name: 'HelloWorld',
  components: {vuedraggable},
  props: {
  },
  data() {
    return {
      list: [1,2,3,4,5,6]
    }
  },
  updated() {
    console.log(this.list)
  },
  methods: {
  }
}
</script>
<style scoped lang="scss">
.wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  text-align: center;
}
.item{
  width:100vw;
  height: 0.5rem;
  line-height: 0.5rem;
  border:1px solid #ccc;
  background-color: #fff;
  color: #999;
  cursor:move;
  &:not(:first-child){
    margin-top:0.1rem
  }
}
</style>