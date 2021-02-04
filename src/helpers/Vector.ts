import { vec2 } from 'gl-matrix'

const TMP_V = vec2.create()

class Vector {
  v = vec2.create()

  constructor(x: number = 0, y: number = 0) {
    this.x = x
    this.y = y
  }

  get x() {
    return this.v[0]
  }

  get y() {
    return this.v[1]
  }

  set x(val) {
    this.v[0] = val
  }

  set y(val) {
    this.v[1] = val
  }

  set(x: number, y: number) {
    this.x = x
    this.y = y
    return this
  }

  copy(v: Vector) {
    this.set(v.x, v.y)
    return this
  }

  mul(v: Vector) {
    return vec2.mul(this.v, this.v, v.v)
  }

  dist(v: Vector) {
    return vec2.dist(this.v, v.v)
  }

  lerp(v: Vector, amount: number) {
    return vec2.lerp(this.v, this.v, v.v, amount)
  }

  floor() {
    vec2.floor(this.v, this.v)
    return this
  }

  center(v: Vector) {
    vec2.add(TMP_V, this.v, v.v)
    vec2.divide(TMP_V, TMP_V, [2, 2])
    return new Vector(TMP_V[0], TMP_V[1])
  }

  direction(v: Vector) {
    vec2.sub(TMP_V, v.v, this.v)
    return TMP_V
  }

  angle(v: Vector) {
    return Math.atan2(v.y - this.y, v.x - this.x)
  }
}

export default Vector
