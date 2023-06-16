<template>
    <div class="h-screen w-screen flex flex-col">
    <t-layout  >
      <t-header >
        <t-head-menu theme="light" default-value="item1" :v-model="menu1Value" height="120px" class="mx-auto">
          <template #logo>
            <img width="100" class="logo" src="https://www.tencent.com/img/index/menu_logo_hover.png" alt="logo" />
            <h1 width="136">化工有限公司</h1>
          </template>
          <t-menu-item value="item1"> 首页 </t-menu-item>
          <t-menu-item value="item2"> 主营业务 </t-menu-item>
          <t-menu-item value="item3"> 关于我们 </t-menu-item>
          <t-menu-item value="item4"> 合伙人 </t-menu-item>
          <t-menu-item value="item5" > 联系我们 </t-menu-item>
          <template #operations>
            <a href="javascript:;">
              <t-popup content="联系我们">
                <t-icon class="t-menu__operations-icon " name="mail" />
        </t-popup></a>
          </template>
        </t-head-menu>
      </t-header>
      <t-content>
        <div>Content</div>
      </t-content>
      <t-footer class="mx-auto"> Copyright @ 2019-{{ new Date().getFullYear() }} Tencent. All Rights Reserved </t-footer>
    </t-layout>
</div>
  </template>


<script setup>
import { ref } from 'vue';

const menu1Value = ref('item2');

const changeHandler = (active) => {
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