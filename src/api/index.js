import { createAlova } from "alova";
import GlobalFetch from "alova/GlobalFetch";
import VueHook from "alova/vue";
import { MessagePlugin } from 'tdesign-vue-next';
import { axiosRequestAdapter } from '@alova/adapter-axios';
import router from '../router'
export const alovaInstance = createAlova({
  baseURL: "http://127.0.0.1:3300",
  statesHook: VueHook,
  requestAdapter: GlobalFetch(),

  beforeRequest(methods) {
    methods.config.headers.Accept = "application/json, text/plain, */*";
    // if (
    //   methods.url == "/qiniu_data/get_token" &&
    //   !!sessionStorage.getItem("uploadToken")
    // ) {
    //   methods.abort();
    // }

    if (sessionStorage.getItem("Bearer")) {
      methods.config.headers.Authorization =
        "Bearer " + sessionStorage.getItem("Bearer");
    }
  },

  responded: {
    // 请求成功的拦截器
    // 当使用GlobalFetch请求适配器时，第一个参数接收Response对象
    // 第二个参数为当前请求的method实例，你可以用它同步请求前后的配置信息
    onSuccess: async (response, method) => {
      const json = await response.json();
      if (response.status > 400) {
        if (json.message.includes('登录信息过期')||json.message.includes('未登录')) {
          MessagePlugin.question(json.message)
          sessionStorage.removeItem("Bearer")
          router.replace('/login')

         }

        throw new Error(response.statusText);
      }
        // 解析的响应数据将传给method实例的transformData钩子函数，这些函数将在后续讲解
        return json;
    },
    onError: (err, method) => {
    }
   
  },
  timeout: 50000,
});

// upload alova instance
export const uploadAlova = createAlova({
  baseURL: 'http://up-as0.qiniup.com',
  statesHook: VueHook,
  shareRequest: false,
  requestAdapter: axiosRequestAdapter()
});