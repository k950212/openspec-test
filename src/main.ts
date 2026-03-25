import './assets/main.css'
import 'ant-design-vue/dist/reset.css'

import { createApp } from 'vue'
import Antd from 'ant-design-vue'

import App from './App.vue'
import router from './router'
import { pinia } from './stores'
import { useUiStore } from './stores/ui'

const app = createApp(App)

app.use(pinia)
app.use(Antd)
app.use(router)

const uiStore = useUiStore(pinia)
uiStore.initializeTheme()

app.mount('#app')
