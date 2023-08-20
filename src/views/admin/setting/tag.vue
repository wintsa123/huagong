<template>
    <div class=" bg-white rounded-lg w-[97%] mx-auto h-[80%]">
        <div class="w-1/2 m-auto">
            <t-divider class="text-xl font-bold subpixel-antialiased leading-[4em]">标签管理</t-divider>
        </div>
        <div v-if="(typeof allTag=='object')"> <t-card title="标签池" shadow :bordered="false" hover-shadow :style="{ margin: '20px' }">
                <t-space class="tag-block">
                    <t-tag theme="primary" closable v-for="(item, index) in allTag.rows" :key="item"
                        @close="handleClose(item, index)">{{ item.label }}</t-tag>

                </t-space>
            </t-card></div>

    </div>
</template>
<script setup>
import { ref, nextTick } from "vue";
import { useRequest, updateState } from "alova";
import { taglist, DeleteTag } from "@/api/methods/article";
const theme = ['primary', 'success', 'warning', 'danger']
const { loading, data: allTag } = useRequest(() => taglist());
const { data, send } = useRequest((id) => DeleteTag(id), { immediate: false });
console.log(typeof allTag=='object')
const handleClose = async (item, index) => {
    const result = await send(item.value)
    updateState(
        taglist(),
        (e) => {
            e.rows.splice(index, 1);
            return e;
        }
    );
};
console.log(allTag)
</script>