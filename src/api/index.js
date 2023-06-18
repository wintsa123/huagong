export const alovaInstance = createAlova({
    baseURL: 'https://127.0.0.1:3000',
    
    // vue项目传入VueHook，react项目传入ReactHook
    statesHook: VueHook,
    
    // 传一个请求适配器，GlobalFetch是我们提供的fetch api适配器
    // 你想用axios也可以自定义一个适配器
    requestAdapter: GlobalFetch(),
    
    // 是不是有熟悉的味道
    // beforeRequest(config) {
    //     config.headers.Authorization = 'Bearer ';
    // },
    async responsed(response) {
      const json = await response.json();
      if (json.code !== 200) {
        throw new Error(json.message);
      }
      return json.data;
    },
});