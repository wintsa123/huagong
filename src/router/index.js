import { createRouter, createWebHistory } from "vue-router";
import { NotifyPlugin } from "tdesign-vue-next";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: "/",
    //   redirect: "/home",
    //   component: () => import("../layout/main.vue"),
    //   children: [
    //     {
    //       path: "/home",
    //       name: "home",
    //       component: () => import("../views/HomeView.vue"),
    //     },
    //     {
    //       path: "/about",
    //       name: "about1",
    //       component: () => import("../views/AboutView.vue"),
    //     },
    //     {
    //       path: "/product",
    //       name: "产品中心",
    //       component: () => import("../views/ProductView.vue"),
    //     },
    //     {
    //       path: "/callme",
    //       name: "联系我们",
    //       component: () => import("../views/Callme.vue"),
    //     },
    //     {
    //       path: "/HistroyView",
    //       name: "环境",
    //       component: () => import("../views/HistroyView.vue"),
    //     },
    //     {
    //       path: "/PartnersView",
    //       name: "合作公司",
    //       component: () => import("../views/PartnersView.vue"),
    //     },
    //     // 前台页面路由配置
    //   ],
    // },
    {
      path: "/",
      redirect: "/dash",
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
          path: "/dash",
          name: "dashboard",
          meta: { breadcrumb: "仪表盘", icon: "dashboard" ,keepAlive:true,menu:true},
          component: () => import("../views/admin/dashboard.vue"),
        },
        {
          path: "/product",
          name: "product",
          meta: { breadcrumb: "产品中心", icon: "server" ,keepAlive:true,menu:true},
          component: () => import("../views/admin/product.vue"),
        },
        {
          path: "/mail",
          name: "mail",
          meta: { breadcrumb: "消息区", icon: "mail" ,keepAlive:true,menu:true},
          component: () => import("../views/admin/mail.vue"),
        },
        {
          path: "/user",
          name: "UserView",
          meta: { breadcrumb: "用户管理", icon: "user-circle",menu:true },
          component: () => import("../views/admin/UserView.vue"),
        },
        {
          path: "/edit",
          name: "changehome",
          meta: { breadcrumb: "门户编辑", icon: "edit-1",menu:true },
          redirect: "/admin/edit/changehome",
          children: [
            {
              path: "/edit/changehome",
              name: "photo",
              meta: { breadcrumb: "首页",keepAlive:true,menu:true },
              component: () => import("../views/admin/photo.vue"),
            },
            {
              path: "/edit/server",
              name: "server1",
              meta: { breadcrumb: "工厂环境" ,keepAlive:true ,menu:true},
              component: () => import("../views/admin/server1.vue"),
            },
            {
              path: "/edit/about",
              name: "about",
              meta: { breadcrumb: "关于我们",menu:true },
              component: () => import("../views/admin/about.vue"),
            },
            {
              path: "/edit/fri",
              name: "fri",
              meta: { breadcrumb: "合作伙伴" , keepAlive:true,menu:true },
              component: () => import("@/views/admin/fri.vue"),
            },
            {
              path: "/edit/callme",
              name: "callme",
              meta: { breadcrumb: "联系我们" ,menu:true},
              component: () => import("../views/admin/callme.vue"),
            },
          ],
        },
        {
          path: "/otherNet",
          name: "other",
          meta: { breadcrumb: "第三方网页", icon: "internet",menu:true },
          redirect: "/otherNet/Markdowm",
          children: [
            {
              path: "/otherNet/Markdowm",
              name: "MarkdowmUseed",
              meta: {
                keepAlive:true,
                breadcrumb: "编辑器使用教程",
                frameSrc: "https://imzbf.github.io/md-editor-rt/zh-CN/grammar",
                menu:true
              },
              component: () => import("../views/admin/iframe/iframe.vue"),
            },
            {
              path: "/otherNet/chinaColoe",
              name: "chinaColoe",
              meta: {
                keepAlive:true,
                breadcrumb: "中国颜色",
                frameSrc: "http://zhongguose.com/",
                menu:true
              },
              component: () => import("../views/admin/iframe/iframe.vue"),
            },
          ],
        },

        {
          path: "/result",
          name: "Done",
          redirect: "/result/notFound",
          meta: { breadcrumb: "结果页", icon: "check-circle" ,menu:true},
          children: [
            {
              path: "/result/notFound",
              name: "notFound",
              component: () => import("@/layout/404.vue"),
              meta: { breadcrumb: "404未发现" ,keepAlive:true,menu:true},
            },
          ],
        },
        {
          path: "/setting",
          name: "setting",
          meta: { breadcrumb: "系统设置", icon: "setting",menu:true },
          redirect: "/setting/set",
          children: [
            {
              path: "/setting/set",
              name: "set",
              meta: { breadcrumb: "前台设置" ,keepAlive:true,menu:true},
              component: () => import("@/views/admin/setting/set.vue"),
            },
            {
              path: "/tagManage",
              name: "tagManage",
              meta: { breadcrumb: "标签管理" ,keepAlive:true,menu:true},
              props: true,
              component: () => import("@/views/admin/setting/tag.vue"),
            },
            {
              path: "/setting/info",
              name: "info",
              meta: { breadcrumb: "系统版本" ,keepAlive:true,menu:true},
              component: () => import("@/views/admin/setting/info.vue"),
            },
          ],
        },
        {
          path: "/editMarkdowm",
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
