import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

export interface ICanvas {
  el: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
}

export interface State {
  canvas: ICanvas | null
}

export const key: InjectionKey<Store<State>> = Symbol()

export function useStore<S = State>() {
  return baseUseStore<S>(key)
}

export default createStore<State>({
  state: {
    canvas: null,
  },

  mutations: {
    updateCanvas(state, payload: ICanvas) {
      state.canvas = { ...state.canvas, ...payload }
    },
  },
})
