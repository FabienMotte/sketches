import { ActionContext, Payload } from 'vuex'
import Vector from '/@src/helpers/Vector'
import { IConnection } from './connection'
import { INeuron } from './neuron'
import { State } from '/@src/store'
import Network from '../../entities/Network'

// ---------- Models
export class INetwork {
  uid: string = ''
  position: Vector = new Vector()
  neurons: INeuron[] = []
  connections: IConnection[] = []
}

// ---------- Actions/mutations types
export const ADD_NETWORK = 'ADD_NETWORK'
export const UPDATE_NETWORK_POSITION = 'UPDATE_NETWORK_POSITION'
export const RESET_NETWORKS = 'RESET_NETWORKS'

// ---------- Payloads definition
export interface AddNetworkActionPayload extends Payload {
  network: Network
}

export interface AddNetworkMutationPayload extends Payload {
  network: INetwork
}

export interface UpdateNetworkPositionActionPayload extends Payload {
  network: Network
  position: Vector
}

export interface UpdateNetworkPositionMutationPayload extends Payload {
  network: INetwork
  position: Vector
}

// ---------- State definition
export interface NetworkModuleState {
  networks: INetwork[]
}

// ---------- State
const state: NetworkModuleState = {
  networks: [],
}

// ---------- Actions
const actions = {
  [ADD_NETWORK](
    { commit }: ActionContext<NetworkModuleState, State>,
    { network }: AddNetworkActionPayload,
  ) {
    const n = new INetwork()
    n.uid = network.uid
    n.position = network.positionAbs

    commit(ADD_NETWORK, { network: n })
  },

  [UPDATE_NETWORK_POSITION](
    { state, commit, getters }: ActionContext<NetworkModuleState, State>,
    { network, position }: UpdateNetworkPositionActionPayload,
  ) {
    const n = getters.getNetworkByUid(network.uid)
    if (n) commit(UPDATE_NETWORK_POSITION, { network: n, position })
    else
      console.warn(
        `[store:network:${UPDATE_NETWORK_POSITION}] Network not found`,
      )
  },
}

// ---------- Mutations
const mutations = {
  [ADD_NETWORK](
    state: NetworkModuleState,
    { network }: AddNetworkMutationPayload,
  ) {
    state.networks.push(network)
  },

  [UPDATE_NETWORK_POSITION](
    state: NetworkModuleState,
    { network, position }: UpdateNetworkPositionMutationPayload,
  ) {
    network.position.copy(position).floor()
  },

  [RESET_NETWORKS](state: NetworkModuleState) {
    state.networks = []
  },
}

export default {
  state,
  actions,
  mutations,
}
