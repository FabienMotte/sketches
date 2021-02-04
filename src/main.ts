import { createApp } from 'vue'
import App from './App.vue'
import store, { key } from './store'
import './styles/index.styl'

const app = createApp(App)
app.use(store, key)
app.mount('body')
