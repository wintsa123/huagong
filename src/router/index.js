import { createRouter, createWebHistory } from "vue-router";
import { NotifyPlugin } from "tdesign-vue-next";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/home",
      component: () => import("../layout/main.vue"),
      children: [
        {
          path: "/home",
          name: "home",
          component: () => import("../views/HomeView.vue"),
        },
        {
          path: "/about",
          name: "about1",
          component: () => import("../views/AboutView.vue"),
        },
        {
          path: "/product",
          name: "产品中心",
          component: () => import("../views/ProductView.vue"),
        },
        {
          path: "/callme",
          name: "联系我们",
          component: () => import("../views/Callme.vue"),
        },
        {
          path: "/HistroyView",
          name: "环境",
          component: () => import("../views/HistroyView.vue"),
        },
        {
          path: "/PartnersView",
          name: "合作公司",
          component: () => import("../views/PartnersView.vue"),
        },
        // 前台页面路由配置
      ],
    },
    {
      path: "/admin",
      redirect: "/admin/dash",
      name: "admin",
      component: () => import("../layout/admin.vue"),
      beforeEnter: (to, from) => {
        const sessionToken = sessionStorage.getItem("Bearer");
        if (
          // 检查用户是否已登录
          !sessionToken
        ) {
          // 将用户重定向到登录页面
          NotifyPlugin("warning", {
            title: "未登录！",
            content: "请先登录",
            duration: 3000,
          });
          return (to.name = "login");
        }
      },
      children: [
        // 后台页面路由配置
        {
          path: "/admin/dash",
          name: "dash",
          component: () => import("../views/admin/dashboard.vue"),
        },
        {
          path: "/admin/product",
          name: "后台产品中心",
          component: () => import("../views/admin/product.vue"),
        },
        {
          path: "/admin/mail",
          name: "mail消息区",
          component: () => import("../views/admin/mail.vue"),
        },
        {
          path: "/admin/user",
          name: "user用户管理",
          component: () => import("../views/admin/UserView.vue"),
        },
        {
          path: "/admin/edit/fri",
          name: "fri合作伙伴",
          component: () => import("../views/admin/fri.vue"),
        },
        {
          path: "/admin/edit/server",
          name: "server工厂环境",
          component: () => import("../views/admin/server1.vue"),
        },
        {
          path: "/admin/edit/about",
          name: "about关于我们",
          component: () => import("../views/admin/about.vue"),
        },
  
        {
          path: "/admin/edit/callme",
          name: "callme联系我们",
          component: () => import("../views/admin/callme.vue"),
        },
     
        {
          path: "/admin/edit/changehome",
          name: "photo更改图片",
          component: () => import("../views/admin/photo.vue"),
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login.vue"),
    },
  ],
});

export default router;
