import { alovaInstance } from "..";

//列表
export const ArticleList = (params) => {
  return alovaInstance.Get("/article/list", { params });
};
//关键词搜索
export const KeyArticleList = (params) => {
  return alovaInstance.Get("/article/keyword_list", { params });
};
//根据id获取
export const ArticleDetail = (id) => {
  return alovaInstance.Get(`/article/find/${id}`,{ transformData(rawData, headers) {
    return rawData.data;
  }});
};
//创建文章
export const CreateArticle = (data) =>
  alovaInstance.Post("/article/create", data, {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
//更改文章
export const UpdateArticle = (data) =>
  alovaInstance.Put(`/article/update/${data.id}`, data, {headers: {
    "Content-Type": "application/json;charset=UTF-8",
  }});
//删除文章
export const DeleteArticle = (id) =>
  alovaInstance.Delete(`/article/delete/${id}`);

//根据typename获取文章总数以及文章id
export const ArticleType = (params) =>
  alovaInstance.Get("/article/type", {
    params,
    name: 'ArticleList',
    // transformData(rawData, headers) {
    //   rawData.data.rows.forEach(element => {
    //     element.tags=element.tags.length>0?element.tags.map(e=>e.id):[]
    //     element.types=element.types.length>0?element.types.map(e=>e.id):[]

    //   });
    //   return rawData;
    // }
    
  });

//标签
//创建标签
export const CreateTag = (params) =>
  alovaInstance.Post("/tag/create", params, {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
//所有标签
export const taglist = (params) =>
  alovaInstance.Get("/tag/list", {
    params,
    transformData(rawData, headers) {
      rawData.data.rows = rawData.data.rows.map((e) => {
        let objtmp = {};
        objtmp["label"] = e.name;
        objtmp["value"] = e.id;
        objtmp["id"] = e.id;

        return objtmp;
      });
      return rawData.data;
    },

  });
