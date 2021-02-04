<template>
  <div class="sketch-00">
    <NetworkUI
      v-for="(network, index) in networks"
      :key="index"
      :network="network"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount } from 'vue'
import { colorPalette } from '/@src/utils/colors'
import { randomFloat } from '/@src/utils/math'
import {
  SketchSetupOptions,
  SketchLoopOptions,
  SketchResizeOptions,
} from '/@src/types/sketch'
import registerModule, { useStore } from './store'
import Network from './entities/Network'
import Neuron from './entities/Neuron'
import NetworkUI from './components/Network.vue'
import { RESET_NETWORKS } from './store/modules/network'

export default defineComponent({
  name: 'Sketch00',

  components: {
    NetworkUI,
  },

  setup() {
    registerModule()

    const store = useStore()
    const networks = computed(() => store.state.sketch.network.networks)

    let network: Network
    let frameCount = 0

    onBeforeUnmount(() => {
      store.commit(RESET_NETWORKS)
    })

    const setup = ({ canvas }: SketchSetupOptions) => {
      if (!canvas.el) return

      network = new Network({ canvas, x: 0.5, y: 0.5 })

      const neuronPositions = [
        [-0.3, -0.3],
        [-0.3, 0.3],
        [0.3, 0.3],
        [0.3, -0.3],
      ]
      for (let i = 0, l = neuronPositions.length; i < l; i++) {
        const n = new Neuron({
          canvas,
          x: neuronPositions[i][0],
          y: neuronPositions[i][1],
        })
        network.addNeuron(n)

        if (i > 0) {
          network.connect(network.neurons[i - 1], n)
        }
        if (i === l - 1) {
          network.connect(n, network.neurons[0])
        }
      }

      network.resize()
    }

    const loop = ({ time, delta, canvas: { el, ctx } }: SketchLoopOptions) => {
      if (!el || !ctx) return
      ctx.fillStyle = colorPalette[2]
      ctx.fillRect(0, 0, el.width, el.height)

      network.render(ctx, time, delta)

      if (frameCount % 10 == 0) {
        const inputs = [randomFloat(0, 1)]
        network.feedForward(inputs)
      }
      frameCount++
    }

    const resize = ({ canvas: { el } }: SketchResizeOptions) => {
      if (!el) return
      network.resize()
    }

    return {
      setup,
      loop,
      resize,
      networks,
    }
  },
})
</script>
