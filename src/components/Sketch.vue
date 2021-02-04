<template>
  <div class="sketch">
    <Canvas @resize="onCanvasResize" />
    <component :is="currentSketch" ref="sketch" class="sketch-container" />
    <div class="sketch-id">#{{ parseSketchId(currentSketchId) }}</div>
  </div>
</template>

<script lang="ts">
import {
  defineAsyncComponent,
  defineComponent,
  markRaw,
  onMounted,
  onBeforeUnmount,
  ref,
} from 'vue'
import { useStore } from '../store'
import Canvas from './Canvas.vue'
import { getQueryParam } from '/@utils/url'

export default defineComponent({
  name: 'Sketch',

  components: {
    Canvas,
  },

  setup(props, ctx) {
    let rafId = -1

    const startTime = performance.now()
    let lastTime = startTime

    const currentSketch = ref()
    const currentSketchId = ref(0)
    const sketch = ref()

    const store = useStore()

    onMounted(async () => {
      currentSketchId.value = getSketchId()
      setSketch(currentSketchId.value)
      onLoop()
    })

    onBeforeUnmount(() => {
      cancelAnimationFrame(rafId)
    })

    const getSketchId = () => {
      const sketchIdParam = getQueryParam('sketch-id')
      return sketchIdParam ? parseInt(sketchIdParam) : 0
    }

    const setSketch = async (sketchId: number) => {
      const sketchCmp = await importSketchModule(sketchId)
      currentSketch.value = markRaw(sketchCmp)
    }

    const importSketchModule = async (sketchId: number) => {
      const sketchIdParsed = parseSketchId(sketchId)

      return defineAsyncComponent(
        () =>
          import(
            `../sketches/sketch_${sketchIdParsed}/Sketch${sketchIdParsed}.vue`
          ),
      )
    }

    const parseSketchId = (val: number) => {
      return val.toString().padStart(2, '0')
    }

    const onLoop = () => {
      const now = performance.now()
      const elapsedTime = now - startTime
      const deltaTime = now - lastTime

      lastTime = now

      const s = sketch.value

      if (s) {
        if (!s._setup && typeof s.setup === 'function') {
          s._setup = true
          s.setup({ canvas: store.state.canvas })
        }

        if (typeof s.loop === 'function') {
          s.loop({
            time: elapsedTime,
            delta: deltaTime,
            canvas: store.state.canvas,
          })
        }
      }

      rafId = requestAnimationFrame(onLoop)
    }

    const onCanvasResize = (width: number, height: number) => {
      const s = sketch.value
      if (s && typeof s.resize === 'function') {
        s.resize({ canvas: store.state.canvas, width, height })
      }
    }

    return {
      currentSketch,
      sketch,
      onCanvasResize,
      parseSketchId,
      currentSketchId,
    }
  },
})
</script>

<style lang="stylus" scoped>
.sketch
  display inline-block
  position relative
  color #ecd078

  ::selection
    background-color lighten(#542437, 30)

.sketch-container
  overflow hidden
  width 100%
  height 100%
  position absolute
  top 0
  left 0

.sketch-id
  position absolute
  right 20px
  bottom 20px
  font-size 3.5vmin
  color #ecd078
</style>
