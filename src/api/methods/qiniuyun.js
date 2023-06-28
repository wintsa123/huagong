//data:
// id?: number;
// user_id?: number;
// prefix?: string;
// bucket?: string;
// qiniu_key?: string;
// qiniu_hash?: string;
// qiniu_fsize?: number;
// qiniu_mimeType?: string;
// qiniu_putTime?: number;
// qiniu_type?: number;
// qiniu_status?: number;
// qiniu_md5?: string;
import { alovaInstance } from "..";

export const getToken = (params) =>
  alovaInstance.Get("/qiniu_data/get_token", { params: params });

export const fetchQiniuDataList = (params) =>
  alovaInstance.Get("/qiniu_data/list", {
    params: params,
    transformData(rawData, headers) {
      // console.log(rawData.data)

      return rawData.data.rows.map((item) => {
        return item;
      });
    },
  });

  export const getlistByprefix = (params) =>
  alovaInstance.Get("/qiniu_data/listByprefix/"+params)


export const fetchDiff = (params) =>
  alovaInstance.Get("/qiniu_data/diff", { params: params });
// 上传图片
export const fetchUpload = (data) =>
  alovaInstance.Post("/qiniu_data/upload", data, { timeout: 1000 * 60 });

// 上传chunk
export const fetchUploadChunk = (data) =>
  alovaInstance.Post("/qiniu_data/upload_chunk", data, {
    headers: { "Content-Type": "multipart/form-data;" },
    timeout: 1000 * 60,
  });

// 合并chunk
export const fetchUploadMergeChunk = (data) =>
  alovaInstance.Post("/qiniu_data/merge_chunk", data, {
    timeout: 1000 * 60,
  });

// 获取上传图片进度
export const fetchUploadProgress = (params) =>
  alovaInstance.Post("/qiniu_data/progress", {
    timeout: 1000 * 60,
    params: params,
  });

export const fetchCreateLink = (data) =>
  alovaInstance.Post("/qiniu_data/create", data, {});

export const fetchUpdateQiniuData = (data) =>
  alovaInstance.Put(`/qiniu_data/update/${data.id}`, data);

export const fetchDeleteQiniuData = (id) =>
  alovaInstance.Delete("/qiniu_data/delete/" + id);

export const fetchDeleteQiniuDataByQiniuKey = (qiniu_key) =>
  alovaInstance.Delete("/qiniu_data/delete_by_qiniukey/" ,qiniu_key);

export const SyncToSql = (prefix) =>
  alovaInstance.Post("/qiniu_data/sync_qiniu_data", prefix, {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
