import store from '/@src/store'
import network, { NetworkModuleState } from './modules/network'
import neuron from './modules/neuron'
import connection from './modules/connection'
import { useStore as baseUseStore } from '/@src/store'
import getters from './getters'

export interface SketchState {
  network: NetworkModuleState
}

export interface SketchRootState {
  sketch: SketchState
}

export const useStore = () => baseUseStore<SketchRootState>()

const module = {
  modules: {
    network,
    neuron,
    connection,
  },
  getters,
}

const registerModule = () => {
  if (!store.hasModule('sketch')) {
    store.registerModule('sketch', module)
  }
}

export default registerModule
