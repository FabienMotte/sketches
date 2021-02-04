import { ActionContext, Payload } from 'vuex'
import { SketchState } from '..'
import Connection from '../../entities/Connection'
import { INetwork } from './network'
import { INeuron } from './neuron'
import { State } from '/@src/store'

// ---------- Models
export class IConnection {
  uid: string = ''
  networkUid: string = ''
  from: INeuron | null = null
  to: INeuron | null = null
  weight: number = 0
}

// ---------- Actions/mutations types
export const ADD_CONNECTION = 'ADD_CONNECTION'
export const UPDATE_CONNECTION_WEIGHT = 'UPDATE_CONNECTION_WEIGHT'

// ---------- Payloads definition
export interface AddConnectionActionPayload extends Payload {
  networkUid: string
  connection: Connection
}

export interface AddConnectionMutationPayload extends Payload {
  network: INetwork
  connection: IConnection
}

export interface UpdateConnectionWeightActionPayload extends Payload {
  connection: IConnection
  weight: number
}

export interface UpdateConnectionWeightMutationPayload extends Payload {
  connection: IConnection
  weight: number
}

// ---------- Actions
const actions = {
  [ADD_CONNECTION](
    { commit, getters }: ActionContext<SketchState, State>,
    { networkUid, connection }: AddConnectionActionPayload,
  ) {
    const c = new IConnection()
    c.uid = connection.uid
    c.networkUid = connection.networkUid
    c.from = getters.getNeuronByUid(connection.networkUid, connection.from.uid)
    c.to = getters.getNeuronByUid(connection.networkUid, connection.to.uid)
    c.weight = connection.defaultWeight

    const stateNetwork = getters.getNetworkByUid(networkUid)
    if (stateNetwork)
      commit(ADD_CONNECTION, { network: stateNetwork, connection: c })
    else console.warn(`[store:connection:${ADD_CONNECTION}] Network not found`)
  },

  [UPDATE_CONNECTION_WEIGHT](
    { commit, getters }: ActionContext<SketchState, State>,
    { connection, weight }: UpdateConnectionWeightActionPayload,
  ) {
    const c = getters.getConnectionByUid(connection.networkUid, connection.uid)
    if (c) commit(UPDATE_CONNECTION_WEIGHT, { connection: c, weight })
    else
      console.warn(
        `[store:connection:${UPDATE_CONNECTION_WEIGHT}] Connection not found`,
      )
  },
}

// ---------- Mutations
const mutations = {
  [ADD_CONNECTION](
    state: SketchState,
    { network, connection }: AddConnectionMutationPayload,
  ) {
    network.connections.push(connection)
  },

  [UPDATE_CONNECTION_WEIGHT](
    state: SketchState,
    { connection, weight }: UpdateConnectionWeightMutationPayload,
  ) {
    connection.weight = weight
  },
}

export default {
  actions,
  mutations,
}
