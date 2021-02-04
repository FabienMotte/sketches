import { computed, ComputedRef } from 'vue'
import { colorPalette, hexToRgb } from '/@utils/colors'
import { lerp, map, clamp, uuid } from '/@utils/math'
import Vector from '/@helpers/Vector'
import type Neuron from './Neuron'
import store from '/@src/store'
import {
  AddConnectionActionPayload,
  ADD_CONNECTION,
} from '../store/modules/connection'

interface ConnectionOptions {
  from: Neuron
  to: Neuron
  weight: number
  networkUid: string
}

class Connection {
  uid = uuid()
  networkUid = ''

  from: Neuron
  to: Neuron

  defaultWeight = 0
  weight: ComputedRef<number>
  output = 0

  sender = new Vector()
  senderRadius = 8
  sending = false

  dashOffsetVelocity = 1
  dashOffset = 0

  constructor({ from, to, weight, networkUid }: ConnectionOptions) {
    this.from = from
    this.to = to
    this.defaultWeight = weight
    this.networkUid = networkUid

    store.dispatch<AddConnectionActionPayload>({
      type: ADD_CONNECTION,
      networkUid: networkUid,
      connection: this,
    })

    const c = store.getters.getConnectionByUid(networkUid, this.uid)
    this.weight = computed(() => c.weight)
  }

  feedForward(input: number) {
    if (this.sending) return
    this.sending = true
    this.output = input * this.weight.value
    this.sender.copy(this.from.positionAbs)
  }

  render(ctx: CanvasRenderingContext2D, delta: number) {
    ctx.beginPath()
    const strokeAlpha = this.weight.value === 0 ? 0.4 : 1
    const strokeColor = hexToRgb(colorPalette[3])?.join(',')
    ctx.strokeStyle = `rgba(${strokeColor}, ${strokeAlpha})`
    ctx.lineWidth = 1 + this.weight.value * 3
    ctx.lineDashOffset = -this.dashOffset
    ctx.setLineDash([6, 3])
    ctx.moveTo(this.from.positionAbs.x, this.from.positionAbs.y)
    ctx.lineTo(this.to.positionAbs.x, this.to.positionAbs.y)
    ctx.stroke()

    this.dashOffsetVelocity = lerp(
      0.1,
      this.dashOffsetVelocity,
      this.sending ? 1 : 0.2,
    )
    this.dashOffset += this.dashOffsetVelocity * delta * 0.04
  }

  renderSender(ctx: CanvasRenderingContext2D) {
    if (!this.sending) return

    this.sender.lerp(this.to.positionAbs, 0.1)

    const d = this.sender.dist(this.to.positionAbs)

    if (d < 1) {
      this.sending = false
      this.to.feedForward(this.output)
    }

    const senderRadius = clamp(
      map(d, 5, 1, this.senderRadius, 0),
      0,
      this.senderRadius,
    )

    ctx.beginPath()
    ctx.fillStyle = colorPalette[0]
    ctx.arc(this.sender.x, this.sender.y, senderRadius, 0, Math.PI * 2)
    ctx.fill()
  }
}

export default Connection
