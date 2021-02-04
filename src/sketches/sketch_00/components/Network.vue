<template>
  <div
    class="network"
    :style="{
      transform: `translate3d(${network.position.x}px, ${network.position.y}px, 0)`,
    }"
  >
    <div class="neurons">
      <Neuron
        v-for="(neuron, index) in network.neurons"
        :key="index"
        :neuron="neuron"
        ref="neuron"
      />
    </div>

    <div class="connections">
      <Connection
        v-for="(connection, index) in network.connections"
        :key="index"
        :connection="connection"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import Neuron from './Neuron.vue'
import Connection from './Connection.vue'
import { INetwork } from '../store/modules/network'

export default defineComponent({
  props: {
    network: {
      type: Object as PropType<INetwork>,
      required: true,
    },
  },

  components: {
    Neuron,
    Connection,
  },
})
</script>

<style lang="stylus" scoped>
.network
  position absolute
  top 0
  left 0
</style>
