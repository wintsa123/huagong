import { alovaInstance } from "..";

// 获取用户信息
export const getUserInfo = (id) => alovaInstance.Get("/user/find/" + id, {});

// 编辑用户信息
export const LoginUser = (id, password) =>
  alovaInstance.Post(
    "/user/login",
    {
      id,
      password,
    },
    {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    }
  );

// 移除用户
export const Changepwd = (oldpwd, newpwd) =>
  alovaInstance.Put("/user/update_pwd", { oldpwd, newpwd });

// 获取用户信息
export const GetnowUser = (id) => alovaInstance.Get("/user/get_user_info", {});
