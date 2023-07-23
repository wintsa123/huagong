<template>  <t-card  :title="'欢迎回来，' + data.data.roles[0].role_name"  :bordered="false">
    <t-row>
        <t-col :span="12">
            <div v-html="svg" class="flex mx-auto"></div>
        </t-col>
    </t-row>

    <t-row>
        <t-col>
            <div>文章总数：{{ data.data.articles_total }}</div>
        </t-col>
    </t-row>
    <t-row>
        <t-col>
            <div>收到的回复：{{ data.data.receive_comments_total }}</div>
        </t-col>
    </t-row>
    <t-row>
        <t-col>
            <div>登录时间：{{ data.data.updated_at }}</div>
        </t-col>
    </t-row>

    <template #actions>
        <a href="javascript:void(0)" @click="clickHandler">注销</a>
    </template>
</t-card></template>
<script setup lang="jsx">
import { createAvatar } from '@dicebear/core';
import { adventurerNeutral } from '@dicebear/collection';

import { useRequest } from 'alova';
import { GetnowUser } from '@/api/methods/user.js';
import { useRouter } from 'vue-router';
const router = useRouter();
const avatar = createAvatar(adventurerNeutral, {
    seed: 'Felix',
    flip: false,
    size: 60,
    radius: 30

    // ... other options
});

const svg = avatar.toString();
const {
    // loading是加载状态值，当加载时它的值为true，结束后自动更新为false
    // 它是一个Ref类型的值，你可以通过loading.value访问它，或直接绑定到界面中
    loading,
    // 响应数据，同样是Ref值
    data,
} = useRequest(GetnowUser, {
    immediate: true,
    initialData: { data:   { updated_at: '****', receive_comments_total: '0', articles_total: '0', roles: [{ role_name: 'admin' }] }}
    // 请求响应前，data的初始值
});
console.log(data)
let clickHandler = () => {
    sessionStorage.removeItem('Bearer');
    router.push('/login');
}
</script>