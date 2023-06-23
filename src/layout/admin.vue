<template>
  <t-layout class="h-screen">
    <t-aside width="auto">
      <t-menu theme="light" :collapsed="collapsed2"  v-model:value="menuValue" class="w-atuo h-full">
        <template #logo>
          <h1 class="mx-auto sm:text-lg   xl: font-black xl:text-2xl min-w-max	 mx-auto" v-if="!collapsed2">懋鑫化工管理系统</h1>

        </template>
        <t-menu-item v-for="item in items" :key="item.key" :value="item.key" @click="navigateTo(item.key)">
          <template #icon>
            <t-icon :name="item.key" />
          </template>
          {{ item.label }}
        </t-menu-item>


        <t-submenu value="3">
          <template #icon>
            <t-icon name="edit-1" />
          </template>
          <template #title>
            <span> 门户编辑</span>
          </template>
          <t-menu-item v-for="item in items2" :key="item.key" :value="item.key" @click="navigateTo(item.key)"> {{
            item.label }} </t-menu-item>
        </t-submenu>
        <template #operations>
          <t-button class="t-demo-collapse-btn pb-3" variant="text" shape="square" @click="changeCollapsed2">
            <template #icon><t-icon name="view-list" /></template>
          </t-button>
        </template>

      </t-menu>
    </t-aside>

    <t-layout>
      <t-content>
        <div><router-view></router-view></div>
      </t-content>
    </t-layout>

  </t-layout>
</template>
<script setup  lang="jsx">
import { useRouter } from 'vue-router';
const router = useRouter()
import { ref } from 'vue';
const collapsed2 = ref(false);
const menuValue = ref(sessionStorage.getItem('adminNav'));

const changeCollapsed2 = () => {
  collapsed2.value = !collapsed2.value;
};
const items = [
  { label: '仪表盘', key: 'dashboard' }, // 菜单项务必填写 key
  { label: '产品中心', key: 'server' },
  { label: '消息区', key: 'mail' },
  { label: '用户管理', key: 'user-circle' },
]
const items2 = [
  { label: '首页', key: 'home' },
  { label: '关于我们', key: 'about' }, // 菜单项务必填写 key
  { label: '工厂环境', key: 'server1' },
  { label: '合作伙伴', key: 'fri' },
  { label: '联系我们', key: 'callme' },
]
const change = (e) => {
  console.log(e)
}
function navigateTo(key) {
  sessionStorage.setItem('adminNav',key)
  // 执行路由跳转
  switch (key) {
    case 'dashboard':
      router.push('/admin/dash');
      break;
    case 'server':
      router.push('/admin/product');
      break;
    case 'mail':
      router.push('/admin/mail');
      break;
    case 'user-circle':
      router.push('/admin/user');
      break;
    case 'home':
      router.push('/admin/edit/changehome');
      break;
    case 'about':
      router.push('/admin/edit/about');
      break;
    case 'server1':
      router.push('/admin/edit/server');
      break;
    case 'fri':
      router.push('/admin/edit/fri');
      break;
    case 'callme':
      router.push('/admin/edit/callme');
      break;
    // 其他菜单项的路由跳转
    default:
      break;
  }
}
</script>