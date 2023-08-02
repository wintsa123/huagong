
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {VueMasonryPlugin} from 'vue-masonry';
import App from './App.vue'
import router from './router'
import 'tdesign-vue-next/es/style/index.css';
import TDesign from 'tdesign-vue-next';
import './style/index.js';
import { bootSilentFactory } from '@alova/scene-vue';
import { alovaInstance } from '@/api/index.js';
bootSilentFactory({
    alova: alovaInstance
  });
const app = createApp(App)
// app.config.globalProperties.$router = router;

app.use(createPinia())
app.use(router)
app.use(TDesign);
app.use(VueMasonryPlugin)

app.mount('#app')
