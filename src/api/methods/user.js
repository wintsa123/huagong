import { alovaInstance } from "..";

// 获取用户信息
export const getUserInfo = (id) => alovaInstance.Get("/user/find/" + id, {});

// 登录用户信息
export const LoginUser = (username, password) =>
  alovaInstance.Post(
    "/user/login",
    {
      username,
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
