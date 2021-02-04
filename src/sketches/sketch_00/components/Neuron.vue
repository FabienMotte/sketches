<template>
  <div
    class="neuron"
    :style="{
      transform: `translate3d(${neuron.position.x}px, ${neuron.position.y}px, 0)`,
    }"
  >
    <div class="neuron-sum">{{ sum }}</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive, ref } from 'vue'
import { INeuron } from '../store/modules/neuron'

export default defineComponent({
  props: {
    neuron: {
      type: Object as PropType<INeuron>,
      required: true,
    },
  },

  setup(props) {
    const sum = computed(() => props.neuron.sum.toFixed(2))
    return { sum }
  },

  methods: {
    hello() {
      console.log('d')
    },
  },
})
</script>

<style lang="stylus">
.neuron
  position absolute
  top 0
  left 0

.neuron-sum
  font-size 1.8vmin
  margin-top 1vmin
  margin-left 1vw
  position relative

  &:after
    content '[sum]'
    position absolute
    font-size 0.6em
    bottom 0
    margin-left 0.3em
</style>
