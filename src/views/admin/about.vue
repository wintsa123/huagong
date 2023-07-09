<template>
  <edit :data="!!data?data:{}" />
</template>
  
<script setup>
import edit from "../../components/mdEditor.vue";
import { useRequest } from "alova";
import { ArticleType, ArticleDetail } from "@/api/methods/article";

const { send: getid, onSuccess } = useRequest(() => ArticleType({ typename: '关于我们' }))
const { send: getArticleInfo, data } = useRequest((id) => ArticleDetail(id), {
  immediate: false
})
onSuccess(e => {
  console.log(data)
  getArticleInfo(e.data[0])
})
</script>