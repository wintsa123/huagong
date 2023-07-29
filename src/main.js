
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {VueMasonryPlugin} from 'vue-masonry';
import App from './App.vue'
import router from './router'
import 'tdesign-vue-next/es/style/index.css';
import TDesign from 'tdesign-vue-next';
import './style/index.js';

const app = createApp(App)
// app.config.globalProperties.$router = router;

app.use(createPinia())
app.use(router)
app.use(TDesign);
app.use(VueMasonryPlugin)

app.mount('#app')
