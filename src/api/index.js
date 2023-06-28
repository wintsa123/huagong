import { createAlova } from "alova";
import GlobalFetch from "alova/GlobalFetch";
import VueHook from "alova/vue";
import {  useRoute  } from "vue-router";
const router=useRoute()
console.log(this)
export const alovaInstance = createAlova({
  baseURL: "http://127.0.0.1:3300",
  statesHook: VueHook,
  requestAdapter: GlobalFetch(),

  beforeRequest(methods) {
    methods.config.headers.Accept = "application/json, text/plain, */*";
    if (
      methods.url == "/qiniu_data/get_token" &&
      !!sessionStorage.getItem("uploadToken")
    ) {
      methods.abort();
    }

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
        if (json.message=='登录信息过期！'||json.message=='未登录') {
          sessionStorage.removeItem("Bearer")
          router.push('/login')
         }
        throw new Error(response.statusText);
      }
      
    
        // 解析的响应数据将传给method实例的transformData钩子函数，这些函数将在后续讲解
        return json;
      
    },
    onError: (err, method) => {
      console.log(err.message);
    }
   
  },
  timeout: 50000,
});
