
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'tdesign-vue-next/es/style/index.css';
import TDesign from 'tdesign-vue-next';
import './style/index.js';
import _ from 'lodash'; // 导入 Lodash

const app = createApp(App)
// app.config.globalProperties.$router = router;
app.config.globalProperties.$lodash = _;

app.use(createPinia())
app.use(router)
app.use(TDesign);


app.mount('#app')
