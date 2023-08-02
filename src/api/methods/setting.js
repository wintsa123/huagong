import { alovaInstance } from "..";

export const getSetting = (params) =>
  alovaInstance.Get("/frontend/list", {
    params: params,
    transformData(rawData, headers) {
      return rawData.data.rows.map((item) => {
        item.value=+item.value
        if (item.value=='2') {
          item.value=0
        }
        return {
          ...item
        };
      });
    },
  });

export const updateSetting = (data) =>
  alovaInstance.Put(`/update/${data.id}`, data);
