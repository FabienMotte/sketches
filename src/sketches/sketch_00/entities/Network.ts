import { randomFloat, uuid } from '/@utils/math'
import Vector from '/@helpers/Vector'
import Connection from './Connection'
import type Neuron from './Neuron'
import store, { ICanvas } from '/@src/store'
import {
  AddNetworkActionPayload,
  ADD_NETWORK,
  UpdateNetworkPositionActionPayload,
  UPDATE_NETWORK_POSITION,
} from '../store/modules/network'
import { AddNeuronActionPayload, ADD_NEURON } from '../store/modules/neuron'

interface NetworkOptions {
  canvas: ICanvas
  x: number
  y: number
}

class Network {
  uid = uuid()
  neurons: Neuron[] = []
  positionRel = new Vector()
  positionAbs = new Vector()
  connections: Connection[] = []
  canvas: ICanvas

  constructor({ canvas, x = 0, y = 0 }: NetworkOptions) {
    this.canvas = canvas
    this.positionRel.set(x, y)

    store.dispatch<AddNetworkActionPayload>({
      type: ADD_NETWORK,
      network: this,
    })
  }

  addNeuron(neuron: Neuron) {
    neuron.networkUid = this.uid
    this.neurons.push(neuron)

    store.dispatch<AddNeuronActionPayload>({
      type: ADD_NEURON,
      network: this,
      neuron: neuron,
    })
  }

  connect(from: Neuron, to: Neuron) {
    const c = new Connection({
      from,
      to,
      weight: randomFloat(0.01, 0.5),
      networkUid: this.uid,
    })

    from.addConnection(c)
    this.connections.push(c)
  }

  feedForward(inputs: number[]) {
    for (let i = 0, l = inputs.length; i < l; i++) {
      const neuron = this.neurons[i]
      neuron?.feedForward(inputs[i])
    }
  }

  updatePosition(
    x: number = this.positionRel.x,
    y: number = this.positionRel.y,
  ) {
    this.positionRel.set(x, y)

    const cvs = this.canvas.el
    this.positionAbs.set(cvs.width, cvs.height)
    this.positionAbs.mul(this.positionRel)

    store.dispatch<UpdateNetworkPositionActionPayload>({
      type: UPDATE_NETWORK_POSITION,
      network: this,
      position: this.positionAbs,
    })
  }

  resize() {
    this.updatePosition()

    for (let i = 0, l = this.neurons.length; i < l; i++) {
      const neuron = this.neurons[i]
      neuron.resize()
    }
  }

  renderNeurons(ctx: CanvasRenderingContext2D) {
    for (let i = 0, l = this.neurons.length; i < l; i++) {
      const neuron = this.neurons[i]
      neuron.render(ctx)
    }
  }

  renderConnections(ctx: CanvasRenderingContext2D, delta: number) {
    for (let i = 0, l = this.connections.length; i < l; i++) {
      const connection = this.connections[i]
      connection.render(ctx, delta)
    }
  }

  renderConnectionsSender(ctx: CanvasRenderingContext2D) {
    for (let i = 0, l = this.connections.length; i < l; i++) {
      const connection = this.connections[i]
      connection.renderSender(ctx)
    }
  }

  render(ctx: CanvasRenderingContext2D, time: number, delta: number) {
    ctx.save()
    ctx.translate(this.positionAbs.x, this.positionAbs.y)

    this.renderNeurons(ctx)
    this.renderConnections(ctx, delta)
    this.renderConnectionsSender(ctx)

    ctx.restore()
  }
}

export default Network
