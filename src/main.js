import { createApp } from 'vue'

import './styles/output.css'
import './assets/main.scss'
import './assets/css/baseline.css'
import './assets/font.css'

import App from './App.vue'

const urlPrefix = 'http://localhost:8080/'
createApp(App).mount('#app')
