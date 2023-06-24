<template>
  <div >
    <t-layout>
      <t-header>
        <t-head-menu theme="light" default-value="item-1"  v-model:value="menu1Value" height="120px" @change="changeHandler">
          <template #logo>
            <h1  class="sm:text-lg ph:text-sm  ph:mr-[0em] xl:mr-[16em] font-black xl:text-2xl min-w-max	2xl:mr-[35em]  4k:mr-[60em] lg:mr-[8em]  ">广州懋鑫化工有限公司</h1>
          </template>

          <t-menu-item v-for="item in items " :key="item.key" class="sm:text-lg xl:text-lg ph:text-sm " :value="item.key"
            @click="navigateTo(item.key)">
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
        <div><router-view></router-view> </div>
      </t-content>
      <t-back-top container=".baseListSmall-container" :visible-height="0" style="position: absolute"
        :offset="['24px', '80px']" :duration="2000"></t-back-top>
      <t-footer class="mx-auto"> Copyright @ 2019-{{ new Date().getFullYear() }}  All Rights Reserved </t-footer>
    </t-layout>

    <t-sticky-tool class="z-40" shape="round" :offset="['-56px', '150px']" placement="right-bottom" @click="handleClick"
      @hover="handleHover">

      <t-sticky-item label="English" :icon="renderTranIcon"> </t-sticky-item>
      <t-sticky-item label="与我沟通" :icon="renderChatIcon" :popup="renderPopup"
        :popup-props="{ overlayInnerStyle: { padding: '4px', height: '128px' } }">
      </t-sticky-item>
    </t-sticky-tool>

  </div>
</template>


<script setup  lang="jsx">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ChatIcon, TranslateIcon  } from 'tdesign-icons-vue-next';

const router = useRouter();
const size = 150
const renderChatIcon = () => {
  return <ChatIcon />;
};
const renderTranIcon = () => {
  return <TranslateIcon />;
};

const renderPopup = () => {
  return <img alt="TDesign Logo" width="120" height="120" src="https://tdesign.gtimg.com/site/site.jpg" />;
};
const handleClick = (context) => {
  console.log('click', context);
};
const handleHover = (context) => {
  console.log('hover', context);
};

const menu1Value = ref(sessionStorage.getItem('HomeNav'));

const items = [
  { label: '首页', key: 'item-1' }, // 菜单项务必填写 key
  { label: '产品中心', key: 'item-2' },
  { label: '关于我们', key: 'item-3' },
  { label: '工厂环境', key: 'item-4' },
  { label: '合作伙伴', key: 'item-5' },
  { label: '联系我们', key: 'item-6' }
]
function navigateTo(key) {
  sessionStorage.setItem('HomeNav',key)
  // 执行路由跳转
  switch (key) {
    case 'item-1':
      console.log(router)
      router.push('/home');
      break;
    case 'item-2':
      router.push('/product');
      break;
    case 'item-3':
      router.push('/about');
      break;
    case 'item-4':
      router.push('/HistroyView');
      break;
    case 'item-5':
      router.push('/PartnersView');
      break;
    case 'item-6':
      router.push('/callme');
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