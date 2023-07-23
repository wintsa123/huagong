<template>
  <t-layout class="h-screen">
    <t-aside width="auto">
      <t-menu theme="light" :collapsed="collapsed2" default-value="dashboard" v-model:value="menuValue"
        class="w-atuo h-full">
        <template #logo>
          <h1 class="mx-auto sm:text-lg   xl: font-black xl:text-2xl min-w-max	 mx-auto" v-if="!collapsed2">懋鑫化工管理系统</h1>
        </template>
        <div v-for="item in menu">
          <t-menu-item :router="router" v-if="!item.children" :key="item.key" :value="item.key" :to="item.to">
            <template #icon>
              <t-icon :name="item.key" />
            </template>
            {{ item.label }}
          </t-menu-item>
          <t-submenu :value="item.key" v-else>
            <template #icon>
              <t-icon :name="item.icon" />
            </template>
            <template #title>
              <span>{{ item.label }}</span>
            </template>
            <t-menu-item :router="router" v-for="content in item.children" :key="content.key" :value="content.key"
              :to="content.to"> {{
                content.label }} </t-menu-item>
          </t-submenu>
        </div>

        <template #operations>
          <t-button class="t-demo-collapse-btn pb-3" variant="text" shape="square" @click="changeCollapsed2">
            <template #icon><t-icon name="view-list" /></template>
          </t-button>
        </template>

      </t-menu>
    </t-aside>

    <t-layout>
      <t-header class="flex justify-between	items-center	h-12">
        <t-breadcrumb :max-item-width="150" :style="{ backgroundColor: 'white', border: '0px solid ' }">
          <t-breadcrumbItem class="h-[30px]" v-for="breadcrumb, index in breadcrumbs" :key="breadcrumb.to"
            :router="router" :to="{ path: breadcrumb.to }">
            {{ breadcrumb.text }}</t-breadcrumbItem>
        </t-breadcrumb>

        <t-popup destroyOnClose hideEmptyPopup placement="bottom"   trigger="click">
          <div v-html="svg" class='cursor-pointer'></div><template #content>
            <User></User>
          </template>
        </t-popup>
      </t-header>
      <t-content :style="{ backgroundColor: '#f0f2f5' }">
        <div><router-view></router-view></div>
      </t-content>
    </t-layout>

  </t-layout>
</template>
<script setup  lang="jsx">
import { useRouter, useRoute } from 'vue-router';
import { createAvatar } from '@dicebear/core';
import { adventurerNeutral } from '@dicebear/collection';
import UserVue from '../components/User.vue';
const User = UserVue

const router = useRouter()
const route = useRoute()

import { ref, computed } from 'vue';
const collapsed2 = ref(false);
const menuValue = ref(sessionStorage.getItem('adminNav'));
const avatar = createAvatar(adventurerNeutral, {
  seed: 'Felix',
  flip: false,
  size: 30,
  radius: 50

  // ... other options
});

const svg = avatar.toString();
const changeCollapsed2 = () => {
  collapsed2.value = !collapsed2.value;
};
const breadcrumbs = computed(() => {
  // 获取当前路由的信息
  const currentRoute = route;
  // 获取当前路由的所有匹配的路由记录
  const matchedRoutes = currentRoute.matched;

  // 创建一个空数组来存储面包屑的信息
  const breadcrumbs = [];
  console.log(currentRoute)

  // 遍历所有匹配的路由记录，获取对应的面包屑文字和路由路径
  for (const route of matchedRoutes) {
    if (route.meta && route.meta.breadcrumb) {
      // 如果路由设置了 meta.breadcrumb，则使用 meta.breadcrumb 作为面包屑文字
      breadcrumbs.push({
        text: route.meta.breadcrumb,
        to: route.path, // 或者你可以使用 route.name 来代替 route.path
      });
    }
  }
  console.log(breadcrumbs)
  // 返回面包屑数组
  return breadcrumbs;
},)


const menu = [
  { label: '仪表盘', key: 'dashboard', icon: 'dashboard', to: '/admin/dash' },
  { label: '产品中心', key: 'server', icon: 'server', to: '/admin/product' },
  { label: '消息区', key: 'mail', icon: 'mail', to: '/admin/mail' },
  { label: '用户管理', key: 'user-circle', icon: 'user-circle', to: '/admin/user' },
  {
    label: '门户编辑',
    key: 'mhEdit',
    icon: 'edit-1',
    to: '/admin/edit',
    children: [
      { label: '首页', key: 'home', to: '/admin/edit/changehome' },
      { label: '关于我们', key: 'about', to: '/admin/edit/about' },
      { label: '工厂环境', key: 'server1', to: '/admin/edit/server' },
      { label: '合作伙伴', key: 'fri', to: '/admin/edit/fri' },
      { label: '联系我们', key: 'callme', to: '/admin/edit/callme' },
    ],
  },
  // 可以添加更多的菜单项和子菜单项
]
const change = (e) => {
  console.log(e)
}
// function navigateTo(key) {
//   sessionStorage.setItem('adminNav', key)
//   // 执行路由跳转
//   switch (key) {
//     case 'dashboard':
//       router.push('/admin/dash');
//       break;
//     case 'server':
//       router.push('/admin/product');
//       break;
//     case 'mail':
//       router.push('/admin/mail');
//       break;
//     case 'user-circle':
//       router.push('/admin/user');
//       break;
//     case 'home':
//       router.push('/admin/edit/changehome');
//       break;
//     case 'about':
//       router.push('/admin/edit/about');
//       break;
//     case 'server1':
//       router.push('/admin/edit/server');
//       break;
//     case 'fri':
//       router.push('/admin/edit/fri');
//       break;
//     case 'callme':
//       router.push('/admin/edit/callme');
//       break;
//     // 其他菜单项的路由跳转
//     default:
//       break;
//   }
// }
</script>