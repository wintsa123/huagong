import { alovaInstance } from "..";

//列表
export const FriendList = (params) => {
  return alovaInstance.Get("/link/list", { params });
};

//创建文章
export const CreateFriend = (data) =>
  alovaInstance.Post("/admin/link/create", data, {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
//更改文章
export const UpdateFriend = (data) =>
  alovaInstance.Put(`/link/update/${data.id}`, data, {headers: {
    "Content-Type": "application/json;charset=UTF-8",
  }});
//删除文章
export const DeleteFriend = (id) =>
  alovaInstance.Delete(`/link/delete/${id}`);

