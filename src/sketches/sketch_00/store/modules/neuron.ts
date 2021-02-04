import Network from '../../entities/Network'
import Neuron from '../../entities/Neuron'
import Vector from '/@src/helpers/Vector'
import { SketchState } from '../index'
import { ActionContext, Payload } from 'vuex'
import { State } from '/@src/store'
import { INetwork } from './network'

// ---------- Models
export class INeuron {
  uid: string = ''
  position: Vector = new Vector()
  sum: number = 0
}

// ---------- Actions/mutations types
export const ADD_NEURON = 'ADD_NEURON'
export const UPDATE_NEURON_POSITION = 'UPDATE_NEURON_POSITION'
export const UPDATE_NEURON_SUM = 'UPDATE_NEURON_SUM'

// ---------- Payloads definition
export interface AddNeuronActionPayload extends Payload {
  network: Network
  neuron: Neuron
}

export interface AddNeuronMutationPayload extends Payload {
  network: INetwork
  neuron: INeuron
}

export interface UpdateNeuronPositionActionPayload extends Payload {
  neuron: Neuron
  position: Vector
}

export interface UpdateNeuronPositionMutationPayload extends Payload {
  neuron: INeuron
  position: Vector
}

export interface UpdateNeuronSumActionPayload extends Payload {
  neuron: Neuron
  sum: number
}

export interface UpdateNeuronSumMutationPayload extends Payload {
  neuron: INeuron
  sum: number
}

// ---------- Actions
const actions = {
  [ADD_NEURON](
    { commit, getters }: ActionContext<SketchState, State>,
    { network, neuron }: AddNeuronActionPayload,
  ) {
    const n = new INeuron()
    n.uid = neuron.uid
    n.position = neuron.positionAbs
    n.sum = neuron.sum

    const stateNetwork = getters.getNetworkByUid(network.uid)
    if (stateNetwork) commit(ADD_NEURON, { network: stateNetwork, neuron: n })
    else console.warn(`[store:neuron:${ADD_NEURON}] Network not found`)
  },

  [UPDATE_NEURON_POSITION](
    { commit, getters }: ActionContext<SketchState, State>,
    { neuron, position }: UpdateNeuronPositionActionPayload,
  ) {
    const n = getters.getNeuronByUid(neuron.networkUid, neuron.uid)
    if (n) commit(UPDATE_NEURON_POSITION, { neuron: n, position })
    else
      console.warn(`[store:neuron:${UPDATE_NEURON_POSITION}] Neuron not found`)
  },

  [UPDATE_NEURON_SUM](
    { commit, getters }: ActionContext<SketchState, State>,
    { neuron, sum }: UpdateNeuronSumActionPayload,
  ) {
    const n = getters.getNeuronByUid(neuron.networkUid, neuron.uid)
    if (n) commit(UPDATE_NEURON_SUM, { neuron: n, sum })
    else console.warn(`[store:neuron:${UPDATE_NEURON_SUM}] Neuron not found`)
  },
}

// ---------- Mutations
const mutations = {
  [ADD_NEURON](
    state: SketchState,
    { network, neuron }: AddNeuronMutationPayload,
  ) {
    network.neurons.push(neuron)
  },

  [UPDATE_NEURON_POSITION](
    state: SketchState,
    { neuron, position }: UpdateNeuronPositionMutationPayload,
  ) {
    neuron.position.copy(position).floor()
  },

  [UPDATE_NEURON_SUM](
    state: SketchState,
    { neuron, sum }: UpdateNeuronSumMutationPayload,
  ) {
    neuron.sum = sum
  },
}

export default {
  actions,
  mutations,
}
