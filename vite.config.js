import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import replace from '@rollup/plugin-replace';

// import  prettier  from "prettier-plugin-tailwindcss";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: { isCustomElement: (tag) => tag.startsWith('wc-') }
    }
  }), vueJsx(), replace({
    __APP_System__: JSON.stringify(require('./package.json').name),
    __APP_VERSION__: JSON.stringify(require('./package.json').version),
    __APP_Time_: JSON.stringify(require('./package.json').updateTime)

  })],
  server: {
    host:'0.0.0.0',
    port: 9099,//自定义端口
    // 是否开启 https
    https: false,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    // exclude: [...configDefaults.exclude, 'e2e/*'],
    root: fileURLToPath(new URL('./src', import.meta.url)),
    transformMode: {
      web: [/\.[jt]sx$/]
    },
  }
})
