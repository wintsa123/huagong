<template>
    <div class="border-t border-transparent	 ">
    <t-list split>
        <t-list-item v-for="item in data">
            {{ item.desc }}
            <template #action>
                <t-switch v-model="item.value" size="large" :label="renderContent"></t-switch>

            </template>
        </t-list-item>

    </t-list>
</div>
</template>
<script setup lang="jsx">
import { useRequest } from "alova";

import { getSetting, updateSetting } from "@/api/methods/setting.js";
import { CloseIcon, CheckIcon } from 'tdesign-icons-vue-next';

const renderActiveContent = () => {
  return (<CheckIcon />);
};
const renderInactiveContent = () => {
  return <CloseIcon />;
};
const renderContent = (h, data) => {
  return data.value ? (<CheckIcon />) : (<CloseIcon />);
};
const { data } = useRequest(() => getSetting())
console.log(data)
</script>
<style scoped>
.switch-demo .tdesign-demo-block {
  width: 150px;
  display: flex;
  justify-content: space-around;
}
</style>