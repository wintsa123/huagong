import { alovaInstance } from "..";

// 获取用户信息
export const getUserInfo = (id) => alovaInstance.Get("/user/find/" + id);

// 编辑用户信息
export const LoginUser = (id, password) =>
  alovaInstance.Post("/user/login", {
    id,
    password,
  });

// 移除用户
export const Changepwd = (oldpwd, newpwd) =>
  alovaInstance.Put("/user/update_pwd", { oldpwd, newpwd, });
