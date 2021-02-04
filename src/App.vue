<template>
  <div class="app">
    <Sketch />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Sketch from './components/Sketch.vue'

export default defineComponent({
  name: 'App',

  components: {
    Sketch,
  },
})
</script>

<style lang="stylus" scoped>
.app
  width 100%
  height 100%
  background-color #ecd078
  display flex
  justify-content center
  align-items center
  font-family 'Apercu'
  -moz-osx-font-smoothing grayscale
  -webkit-font-smoothing subpixel-antialiased
</style>
