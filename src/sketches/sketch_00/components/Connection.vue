<template>
  <div
    class="connection"
    :style="{
      transform: `translate3d(${position.x}px, ${position.y}px, 0) rotate(${angle}deg)`,
    }"
  >
    <div
      class="connection-weight"
      contenteditable
      ref="weightRef"
      @blur="onEdit"
      @keydown.enter="endEdit"
    >
      {{ connection.weight }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import { clamp, toDegrees } from '/@src/utils/math'
import Neuron from '../entities/Neuron'
import {
  IConnection,
  UpdateConnectionWeightActionPayload,
  UPDATE_CONNECTION_WEIGHT,
} from '../store/modules/connection'
import { useStore } from '../store'
import { INeuron } from '../store/modules/neuron'

export default defineComponent({
  props: {
    connection: {
      type: Object as PropType<IConnection>,
      required: true,
    },
  },

  setup(props) {
    const store = useStore()
    const weightRef = ref()

    const from = props.connection.from as INeuron
    const to = props.connection.to as INeuron

    const position = ref()
    const angle = ref()

    watch(
      [from.position, to.position],
      () => {
        position.value = from.position.center(to.position)
        angle.value = toDegrees(from.position.angle(to.position) % Math.PI)
      },
      { immediate: true },
    )

    const onEdit = (e: FocusEvent) => {
      const target = e.target as HTMLElement

      if (!target) return
      const innerText = target.innerText

      let weight = parseFloat(innerText)
      weight = parseFloat(weight.toFixed(2))
      weight = clamp(weight, 0, 1)

      if (isNaN(weight)) {
        weightRef.value.innerText = props.connection.weight
        return
      }

      weightRef.value.innerText = weight

      store.dispatch<UpdateConnectionWeightActionPayload>({
        type: UPDATE_CONNECTION_WEIGHT,
        connection: props.connection,
        weight,
      })
    }

    const endEdit = () => {
      if (!weightRef) return
      weightRef.value.blur()
    }

    return { weightRef, position, angle, onEdit, endEdit }
  },
})
</script>

<style lang="stylus" scoped>
.connection
  position absolute
  top 0
  left 0
  transform-origin top left

.connection-weight
  transform translate3d(-50%, 100%, 0)
  position relative
  font-size 1.8vmin
  background-color rgba(#fff, 0.3)
  padding 0.5vmin 0.5vmin 0.4vmin 0.5vmin
  border-radius 4px
  transition background-color 0.3s ease, transform 0.3s ease

  &:after
    content '[weight]'
    position absolute
    font-size 0.6em
    bottom 0
    margin-left 0.6em

  &:hover, &:focus
    background-color rgba(#fff, 0.4)

  &:focus
    transform translate3d(-50%, 100%, 0) scale(1.1)
</style>
