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
      <t-header class="flex justify-between	items-center">
        <t-breadcrumb :style="{ backgroundColor: 'white', border: '0px solid ' }">
          <t-breadcrumbItem  v-for="breadcrumb, index in breadcrumbs" :key="breadcrumb.to"
            :router="router" :to="{ path: breadcrumb.to }">
            {{ breadcrumb.text }}</t-breadcrumbItem>
        </t-breadcrumb>

        <t-popup destroyOnClose hideEmptyPopup placement="bottom" trigger="click">
          <div v-html="svg" class='cursor-pointer'></div><template #content>
            <User></User>
          </template>
        </t-popup>
      </t-header>
      <t-content :style="{ backgroundColor: '#f0f2f5' }">

        <router-view >
        </router-view> 
        <!-- <router-view v-slot="{Component}">

          <KeepAlive>

            <component :is="Component" />

          </KeepAlive>
        </router-view> -->

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
const menuValue = ref(route.matched.at(-1).meta?.icon || route.name);
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
  // 返回面包屑数组
  return breadcrumbs;
},)




// 生成菜单配置
function generateMenuFromRoutes(routes) {
  const menu = [];
  routes.forEach((route) => {
    if (route.path.startsWith('/admin') && route.meta) {
      const menuItem = {
        label: route.meta?.breadcrumb || route.name,
        key: route.meta?.icon || route.name,
        to: route.path,
        icon: route.meta?.icon || "", // 如果路由meta中有图标，可以通过 route.meta.icon 获取
      };
      if (!route.meta?.icon) {
        delete menuItem.icon
      }
      if (route.children && route.children.length > 0) {
        menuItem.children = generateMenuFromRoutes(route.children);
      }
      menu.push(menuItem);
    } else {
      // 处理重定向的子级情况
      if (route.children && route.children.length > 0) {
        const redirectChildren = generateMenuFromRoutes(route.children);
        menu.push(...redirectChildren);
      }
    }
  });

  return menu;
}




const menu = generateMenuFromRoutes(router.options.routes)


</script>
<style > 
.t-breadcrumb{
  height: var(--td-comp-size-xxxl);
}
</style>