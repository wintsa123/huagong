import { alovaInstance } from "..";

export const getSetting = (params) =>
  alovaInstance.Get("/frontend/list", {
    params,
    name:'getSet',
    transformData(rawData, headers) {
      return rawData.data.rows.map((item) => {
       
        item.loading = false;
        return {
          ...item,
        };
      });
    },
  });

export const updateSetting = (data) =>
  alovaInstance.Put(`/frontend/update/${data.id}`, data, {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });

export const getSystemInfo = (params) =>
  alovaInstance.Get("/other/server_info", {
    params: params,
    transformData(rawData, headers) {
      let tmp = Object.keys(rawData.data.server).filter((e) =>
        rawData.data.server[e].includes("Error")
      );
      tmp.forEach((e) => {
        delete rawData.data.server[e];
      });
      let tmp1 = Object.keys(rawData.data.server);
      const customOrder = ["系统名称", "系统版本", "升级时间"];
      let result = customOrder.concat(tmp1);
      rawData.data.server["系统名称"] = __APP_System__;
      rawData.data.server["系统版本"] = __APP_VERSION__;
      rawData.data.server["升级时间"] = __APP_Time_;
      // 将对象按照自定义顺序排序
      const sortedData = result.reduce((result, key) => {
        if (rawData.data.server[key]) {
          result[key] = rawData.data.server[key];
        }
        return result;
      }, {});
      rawData.data.server = sortedData;
      return rawData.data.server;
    },
  });
