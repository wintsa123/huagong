<template>
    <t-head-menu default-value="item1" v-model="menu1Value" theme="light" @change="changeHandler">
        <template #logo>
            <img src="https://www.tencent.com/img/index/menu_logo_hover.png" width="136" />
        </template>
        <t-menu-item value="item1"> 首页 </t-menu-item>
        <t-menu-item value="item2"> 已选内容 </t-menu-item>
        <t-menu-item value="item3"> 菜单内容二 </t-menu-item>
        <t-menu-item value="item4"> 菜单内容二 </t-menu-item>

        <t-menu-item value="item5"> 菜单内容三 </t-menu-item>
        <template #operations>
            <div >

                <t-button variant="text" shape="square">
                    <template #icon><t-icon name="mail" /></template>
                </t-button>

            </div>
        </template>
    </t-head-menu>
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
  