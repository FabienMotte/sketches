import { ICanvas } from '../store'

export interface SketchSetupOptions {
  canvas: ICanvas
}

export interface SketchLoopOptions {
  time: number
  delta: number
  canvas: ICanvas
}

export interface SketchResizeOptions {
  width: number
  height: number
  canvas: ICanvas
}
