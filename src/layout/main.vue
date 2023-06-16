<template>
  <div class="h-screen w-screen flex flex-col">
    <t-layout>
      <t-header>
        <t-head-menu theme="light" default-value="item-1" :v-model="menu1Value" height="120px" @change="changeHandler">
          <template #logo>
            <img width="100" class="logo" src="https://www.tencent.com/img/index/menu_logo_hover.png" alt="logo" />
            <h1 width="136">化工有限公司</h1>
          </template>

          <t-menu-item v-for="item in items " :key="item.key" :value="item.key" @click="navigateTo(item.key)">
            {{ item.label }} </t-menu-item>

          <template #operations>
            <a href="javascript:;">
              <t-popup content="联系我们">
                <t-icon class="t-menu__operations-icon" name="mail" />
              </t-popup></a>
          </template>
        </t-head-menu>
      </t-header>
      <t-content>
        <div><router-view></router-view></div>
      </t-content>
      <t-footer class="mx-auto"> Copyright @ 2019-{{ new Date().getFullYear() }} Tencent. All Rights Reserved </t-footer>
    </t-layout>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const menu1Value = ref('item2');
const items = [
  { label: '首页', key: 'item-1' }, // 菜单项务必填写 key
  { label: '主营业务', key: 'item-2' },
  { label: '关于我们', key: 'item-3' },
  { label: '合伙人', key: 'item-4' },
  { label: '联系我们', key: 'item-5' }
]
function navigateTo(key) {
  // 执行路由跳转
  switch (key) {
    case 'item-1':
      console.log(router)
      router.push('/');
      break;
    case 'item-2':
      router.push('/business');
      break;
    case 'item-3':
      router.push('/about');
      break;
    // 其他菜单项的路由跳转
    default:
      break;
  }
}

function changeHandler(active) {
  console.log('change', active);
};
</script>
<style lang="less" scoped>
.t-menu__operations {
  .t-button {
    margin-left: 8px;
  }
}

.t-demo-menu--dark {
  .t-button {
    color: #fff;

    &:hover {
      background-color: #4b4b4b;
      border-color: transparent;
      --ripple-color: #383838;
    }
  }
}

</style> 