# Sketches

## Why

Try Vue.js 3 new composition API along with Vuex and Canvas 2D API.  
Experiment throught UI/Canvas 2D sketches.

## Technologies

- [Vite](https://vitejs.dev/)
- [Vue.js 3](https://v3.vuejs.org/)
- [Vuex](https://next.vuex.vuejs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [Stylus](https://stylus-lang.com/)

## Usage

### Dependencies

Install dependencies

```bash
npm install
```

### Development

Just run and visit http://localhost:4000

Use http://localhost:4000/?sketch-id=0 to go to a specific sketch.

```bash
npm run dev
```

### Build

To build the project, run

```bash
npm run build
```

And you will see the generated file in `dist` that ready to be served.

## Structure

### Main components

`src/components/`

- `Sketch.vue`: Load asynchronously (dynamic `import`), setup and render sketches components.
- `Canvas.vue`: Handle canvas DOM element and resize.

### Store

Vuex global store is located in `src/store/index.ts`.  
Each sketch has its own store module.

### Sketches

All sketches are located in `src/sketches/`.

Sketch structure:

- `src/sketches/sketch_xx/components/`: Sketch components.
- `src/sketches/sketch_xx/entities/`: TypeScript classes representing entities.
- `src/sketches/sketch_xx/store/`: Sketch store module.
- `src/sketches/sketch_xx/SketchXX.vue`: Sketch entry point.

## Coding Style

- [Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode/) single quotes, no semi, 2 spaces.
