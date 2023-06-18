import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/product',
      name: '产品中心',
      component: () => import('../views/ProductView.vue')
    },
    {
      path: '/callme',
      name: '联系我们',
      component: () => import('../views/Callme.vue')
    },
    {
      path: '/HistroyView',
      name: '环境',
      component: () => import('../views/HistroyView.vue')
    },
    {
      path: '/PartnersView',
      name: '合作公司',
      component: () => import('../views/PartnersView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../layout/admin.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    }
  ]
})
router.beforeEach( (to, from) => {
  const sessionToken = sessionStorage.getItem('Bearer');
  console.log(to)
  if (
    // 检查用户是否已登录
    !sessionToken &&
    // ❗️ 避免无限重定向
    to.name == 'admin'
  ) {
    // 将用户重定向到登录页面
    return to.name='login' 
  }
})

export default router
