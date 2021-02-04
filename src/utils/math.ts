export function lerp(val: number, x: number, y: number) {
  return x + (y - x) * val
}

export function map(
  val: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number,
) {
  return ((val - start1) / (stop1 - start1)) * (stop2 - start2) + start2
}

export function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val))
}

export function randomFloat(min: number, max: number, precision = 2) {
  return parseFloat(
    Math.min(min + Math.random() * (max - min), max).toFixed(precision),
  )
}

export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180
}

export function toDegrees(radians: number) {
  return radians * (180 / Math.PI)
}
