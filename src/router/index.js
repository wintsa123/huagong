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
          meta: { breadcrumb: "仪表盘", icon: "dashboard" },
          component: () => import("../views/admin/dashboard.vue"),
        },
        {
          path: "/admin/product",
          name: "后台产品中心",
          meta: { breadcrumb: "产品中心", icon: "server" },
          component: () => import("../views/admin/product.vue"),
        },
        {
          path: "/admin/mail",
          name: "mail消息区",
          meta: { breadcrumb: "消息区", icon: "mail" },
          component: () => import("../views/admin/mail.vue"),
        },
        {
          path: "/admin/edit",
          name: "编辑区",
          meta: { breadcrumb: "门户编辑", icon: "edit-1" },
          redirect: "/admin/edit/changehome",
          children: [
            {
              path: "/admin/edit/changehome",
              name: "photo更改图片",
              meta: { breadcrumb: "首页" },
              component: () => import("../views/admin/photo.vue"),
            },
            {
              path: "/admin/edit/server",
              name: "server工厂环境",
              meta: { breadcrumb: "工厂环境" },
              component: () => import("../views/admin/server1.vue"),
            },
            {
              path: "/admin/edit/about",
              name: "about关于我们",
              meta: { breadcrumb: "关于我们" },
              component: () => import("../views/admin/about.vue"),
            },
            {
              path: "/admin/edit/fri",
              name: "fri合作伙伴",
              meta: { breadcrumb: "合作伙伴" },
              component: () => import("../views/admin/fri.vue"),
            },
            {
              path: "/admin/edit/callme",
              name: "callme联系我们",
              meta: { breadcrumb: "联系我们" },
              component: () => import("../views/admin/callme.vue"),
            },
          ],
        },
        {
          path: "/admin/otherNet",
          name: "第三方网页",
          meta: { breadcrumb: "第三方网页", icon: "internet" },
          redirect: "/admin/otherNet/Markdowm",

          children: [
            {
              path: "/admin/otherNet/Markdowm",
              name: "Markdowm使用教程",
              meta: {
                breadcrumb: "编辑器使用教程",
                frameSrc: "https://imzbf.github.io/md-editor-rt/zh-CN/grammar",
              },
              component: () => import("../views/admin/iframe/Markdowm.vue"),
            },
          ],
        },

        {
          path: "/admin/result",
          name: "结果页",
          redirect: "/admin/result/notFound",
          meta: { breadcrumb: "结果页", icon: "check-circle" },
          children: [
            {
              path: "/admin/result/notFound",
              name: "notFound",
              component: () => import("@/layout/404.vue"),
              meta: { breadcrumb: "404未发现" },
            },
          ],
        },
        {
          path: "/admin/user",
          name: "user用户管理",
          meta: { breadcrumb: "用户管理", icon: "user-circle" },
          component: () => import("../views/admin/UserView.vue"),
        },
        {
          path: "/admin/editMarkdowm",
          name: "markdowm编辑",
          props: true,
          component: () => import("../components/mdEditor.vue"),
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login.vue"),
    },
    {
      path: "/404",
      name: "NotFound",
      component: () => import("../layout/404.vue"), // 404 页面的组件
    },
    {
      path: "/:catchAll(.*)",
      redirect: "/404", // 将所有未匹配的路径重定向到 404 页面
    },
  ],
});

export default router;
