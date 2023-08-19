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
          name: "dashboard",
          meta: { breadcrumb: "仪表盘", icon: "dashboard" ,keepAlive:true},
          component: () => import("../views/admin/dashboard.vue"),
        },
        {
          path: "/admin/product",
          name: "product",
          meta: { breadcrumb: "产品中心", icon: "server" ,keepAlive:true},
          component: () => import("../views/admin/product.vue"),
        },
        {
          path: "/admin/mail",
          name: "mail",
          meta: { breadcrumb: "消息区", icon: "mail" ,keepAlive:true},
          component: () => import("../views/admin/mail.vue"),
        },
        {
          path: "/admin/user",
          name: "UserView",
          meta: { breadcrumb: "用户管理", icon: "user-circle" },
          component: () => import("../views/admin/UserView.vue"),
        },
        {
          path: "/admin/edit",
          name: "changehome",
          meta: { breadcrumb: "门户编辑", icon: "edit-1" },
          redirect: "/admin/edit/changehome",
          children: [
            {
              path: "/admin/edit/changehome",
              name: "photo",
              meta: { breadcrumb: "首页",keepAlive:true },
              component: () => import("../views/admin/photo.vue"),
            },
            {
              path: "/admin/edit/server",
              name: "server1",
              meta: { breadcrumb: "工厂环境" },
              component: () => import("../views/admin/server1.vue"),
            },
            {
              path: "/admin/edit/about",
              name: "about",
              meta: { breadcrumb: "关于我们" },
              component: () => import("../views/admin/about.vue"),
            },
            {
              path: "/admin/edit/fri",
              name: "fri",
              meta: { breadcrumb: "合作伙伴" , keepAlive:true },
              component: () => import("@/views/admin/fri.vue"),
            },
            {
              path: "/admin/edit/callme",
              name: "callme",
              meta: { breadcrumb: "联系我们" },
              component: () => import("../views/admin/callme.vue"),
            },
          ],
        },
        {
          path: "/admin/otherNet",
          name: "other",
          meta: { breadcrumb: "第三方网页", icon: "internet", },
          redirect: "/admin/otherNet/Markdowm",

          children: [
            {
              path: "/admin/otherNet/Markdowm",
              name: "MarkdowmUseed",
              meta: {
                keepAlive:true,
                breadcrumb: "编辑器使用教程",
                frameSrc: "https://imzbf.github.io/md-editor-rt/zh-CN/grammar",
              },
              component: () => import("../views/admin/iframe/iframe.vue"),
            },
            {
              path: "/admin/otherNet/chinaColoe",
              name: "chinaColoe",
              meta: {
                keepAlive:true,
                breadcrumb: "中国颜色",
                frameSrc: "http://zhongguose.com/",
              },
              component: () => import("../views/admin/iframe/iframe.vue"),
            },
          ],
        },

        {
          path: "/admin/result",
          name: "Done",
          redirect: "/admin/result/notFound",
          meta: { breadcrumb: "结果页", icon: "check-circle" },
          children: [
            {
              path: "/admin/result/notFound",
              name: "notFound",
              component: () => import("@/layout/404.vue"),
              meta: { breadcrumb: "404未发现" ,keepAlive:true},
            },
          ],
        },
        {
          path: "/admin/setting",
          name: "setting",
          meta: { breadcrumb: "系统设置", icon: "setting" },
          redirect: "/admin/setting/set",
          children: [
            {
              path: "/admin/setting/set",
              name: "set",
              meta: { breadcrumb: "前台设置" ,keepAlive:true},
              component: () => import("@/views/admin/setting/set.vue"),
            },
            {
              path: "/admin/setting/info",
              name: "info",
              meta: { breadcrumb: "系统版本" ,keepAlive:true},
              component: () => import("@/views/admin/setting/info.vue"),
            },
          ],
        },
   
        
        {
          path: "/admin/editMarkdowm/",
          name: "markdowm",
          props: true,
          component: () => import("@/components/mdEditor.vue"),
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
