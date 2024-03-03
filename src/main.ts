/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'
import router from './router';

// Composables
import { createApp } from 'vue'

const app = createApp(App)

app.config.globalProperties.$URL = 'http://localhost:8080/api';

registerPlugins(app)

app.use(router);

app.mount('#app')
