<template>
    <div class=" bg-white rounded-lg w-[97%] mx-auto h-[80%] ">
        <div class="w-1/2 m-auto">
            <t-divider class="text-xl font-bold subpixel-antialiased leading-[4em]">系统版本</t-divider>
        </div>
        <section class="t-skeleton-demo-card" v-if="loading">
            
            <div class="content">加载中...
                <t-skeleton animation="gradient"> 
                </t-skeleton>
            </div>
        </section>
        <t-card :bordered="false" :style="{ width: '100%' }">
            <t-row v-for="(i, idx) in listDatas" :key="idx" :style="{ width: '100%' }" :gutter="[
                { xs: 8, sm: 16, md: 24, lg: 32, xl: 32, xxl: 40 },
                { xs: 8, sm: 16, md: 24, lg: 32, xl: 32, xxl: 40 },
            ]">
                <t-col v-for="(j, jdx) in i" :key="jdx" :span="12 / listDatas[0].length">
                    <t-card :bordered="false" hover-shadow :style="{ width: '100%', marginBottom: '1em' }">
                        <template #title>
                            <div class="text-xs	text-blue" :style="{ color: 'rgba(0, 0, 0, 0.5)' }">{{ Object.keys(j).join()
                            }}</div>
                        </template>
                        <template #content>
                            <div class="text-lg	subpixel-antialiased">{{ Object.values(j).join() }}</div>
                        </template>

                    </t-card>
                </t-col>
            </t-row>

        </t-card>

    </div>
</template>
<script setup lang="jsx">
import { ref, computed } from 'vue';
const value = ref(1);
import { _ } from "lodash";
import { useRequest, updateState } from "alova";
import { getSystemInfo } from "@/api/methods/setting.js";
const { data, loading } = useRequest(() => getSystemInfo())


const listDatas = computed(() => {
    const keys = _.map(data.value, (value, key) => ({ [key]: value }));
    return _.chunk(keys, 4)
})
</script>