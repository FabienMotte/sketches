<template>
  <canvas class="canvas" ref="cvs" />
</template>

<script lang="ts">
import { useStore } from '/@src/store'
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'

export default defineComponent({
  name: 'Canvas',

  emits: ['resize'],

  setup(props, { emit }) {
    const store = useStore()
    const cvs = ref<HTMLCanvasElement>()

    onMounted(() => {
      window.addEventListener('resize', onWindowResize)
      onWindowResize()

      store.commit('updateCanvas', {
        el: cvs.value,
        ctx: cvs.value?.getContext('2d'),
      })
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', onWindowResize)
    })

    const onWindowResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const minSide = Math.min(width, height)
      const size = Math.floor(minSide * 0.75)

      const c = cvs.value
      if (c) {
        c.width = c.height = size
        c.style.setProperty('--size', `${size}px`)
      }

      emit('resize', width, height)
    }

    return {
      cvs,
    }
  },
})
</script>

<style lang="stylus">
.canvas
  width var(--size)
  height @width
  box-shadow 0 10px 15px -3px rgba(#c02942, 0.4), 0 4px 6px -2px rgba(#c02942, 0.2)
  border-radius 8px
  background-color #c02942
  vertical-align middle
</style>
