<template>
    <t-collapse :default-value="[0]" >
        <t-collapse-panel key="1" header="友链自定义"  :disabled="disable0">
            <template #headerRightContent>
                <t-space size="small">
                    <t-checkbox :checked="!disable0" @change="toggleDisable0">启用</t-checkbox>
                </t-space>
            </template>
                <template #content>
                    <edit :data="data" :disabled="disable0" />
                </template>
        </t-collapse-panel>
        <t-collapse-panel key="2" header="友链格式化"  :disabled="!disable0">
            <template #headerRightContent>
                <t-space size="small">
                    <t-checkbox :checked="disable0" @change="toggleDisable0">启用</t-checkbox>
                </t-space>
            </template>
                <template #content>
                </template>
        </t-collapse-panel>
    </t-collapse>
</template>
    
<script setup>
import edit from "../../components/mdEditor.vue";
import { useRequest } from "alova";
import { ArticleType, ArticleDetail } from "@/api/methods/article";
import { ref } from "vue";

const { send: getid, onSuccess } = useRequest(() => ArticleType({ typename: '合作伙伴' }))
const { send: getArticleInfo, data } = useRequest((id) => ArticleDetail(id), {
    immediate: false
})
onSuccess(e => {
    console.log(data)
    getArticleInfo(e.data[0])
})
const disable0 = ref(true)

const toggleDisable0=() =>{
    disable0.value = !disable0.value;
  }
</script>