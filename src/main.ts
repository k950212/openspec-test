import './assets/main.css'
import 'ant-design-vue/dist/reset.css'

import { createApp } from 'vue'
import Antd from 'ant-design-vue'

import App from './App.vue'
import router from './router'
import { pinia } from './stores'

const app = createApp(App)

app.use(pinia)
app.use(Antd)
app.use(router)

app.mount('#app')
