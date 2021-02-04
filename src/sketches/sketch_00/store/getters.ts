import { SketchState } from '.'
import Network from '../entities/Network'
import Neuron from '../entities/Neuron'

export default {
  getNetworkByUid: (state: SketchState) => (uid: string) => {
    return state.network.networks.find((n) => n.uid === uid)
  },

  getNeuronByUid: (state: SketchState, getters: any) => (
    networkUid: string,
    neuronUid: string,
  ) => {
    const network = getters.getNetworkByUid(networkUid)
    if (!network) {
      console.warn(`[store:getters:getNeuronByUid] Network not found`)
      return null
    }
    return network.neurons.find((n: Neuron) => n.uid === neuronUid)
  },

  getConnectionByUid: (state: SketchState, getters: any) => (
    networkUid: string,
    connectionUid: string,
  ) => {
    const network = getters.getNetworkByUid(networkUid)
    if (!network) {
      console.warn(`[store:getters:getNeuronByUid] Network not found`)
      return null
    }
    return network.connections.find((c: Network) => c.uid === connectionUid)
  },
}
