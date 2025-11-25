import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'

// Import Dialtone styles (base + default theme for tokens)
import '@dialpad/dialtone/css'
import '@dialpad/dialtone/css-default-theme'

// Import custom styles
import './assets/styles/main.css'
import './assets/styles/dialtone-fallback.css'
import './assets/intercom-styles.css'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

app.mount('#app')
