import { colorPalette, hexToRgb } from '/@utils/colors'
import { lerp, map, uuid } from '/@utils/math'
import Vector from '/@helpers/Vector'
import type Connection from './Connection'
import store, { ICanvas } from '/@src/store'
import {
  UpdateNeuronPositionActionPayload,
  UpdateNeuronSumActionPayload,
  UPDATE_NEURON_POSITION,
  UPDATE_NEURON_SUM,
} from '../store/modules/neuron'

interface NeuronOptions {
  canvas: ICanvas
  x: number
  y: number
}

class Neuron {
  uid = uuid()
  networkUid = ''
  positionRel = new Vector()
  positionAbs = new Vector()
  radiusStroke = 16
  radiusFill = 0
  connections: Connection[] = []
  sum = 0
  canvas: ICanvas

  constructor({ canvas, x = 0, y = 0 }: NeuronOptions) {
    this.canvas = canvas
    this.positionRel.set(x, y)
  }

  addConnection(connection: Connection) {
    this.connections.push(connection)
  }

  feedForward(input: number) {
    this.sum += input

    if (this.sum >= 1) {
      this.fire()
      this.sum = 0
    }

    store.dispatch<UpdateNeuronSumActionPayload>({
      type: UPDATE_NEURON_SUM,
      neuron: this,
      sum: this.sum,
    })
  }

  fire() {
    if (!this.connections.length) return

    this.radiusStroke = 32

    for (let i = 0, l = this.connections.length; i < l; i++) {
      let c = this.connections[i]
      c.feedForward(this.sum)
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

    store.dispatch<UpdateNeuronPositionActionPayload>({
      type: UPDATE_NEURON_POSITION,
      neuron: this,
      position: this.positionAbs,
    })
  }

  resize() {
    this.updatePosition()
  }

  renderOuterCircle(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.strokeStyle = colorPalette[3]
    ctx.lineWidth = 1
    ctx.arc(
      this.positionAbs.x,
      this.positionAbs.y,
      this.radiusStroke,
      0,
      Math.PI * 2,
    )
    ctx.stroke()

    this.radiusStroke = lerp(0.1, this.radiusStroke, 16)
  }

  renderSumCircle(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    this.radiusFill = lerp(0.1, this.radiusFill, map(this.sum, 0, 1, 0, 16))
    ctx.fillStyle = `rgba(${hexToRgb(colorPalette[0])?.join(',')}, ${this.sum})`
    ctx.arc(
      this.positionAbs.x,
      this.positionAbs.y,
      this.radiusFill,
      0,
      Math.PI * 2,
    )
    ctx.fill()
  }

  renderInnerCircle(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.fillStyle = colorPalette[3]
    ctx.arc(this.positionAbs.x, this.positionAbs.y, 4, 0, Math.PI * 2)
    ctx.fill()
  }

  render(ctx: CanvasRenderingContext2D) {
    this.renderOuterCircle(ctx)
    this.renderSumCircle(ctx)
    this.renderInnerCircle(ctx)
  }
}

export default Neuron
