<template>
  <div v-if=" typeof data =='object'">
    <edit :data="data.data.rows[0]" />
  </div>
</template>
  
<script setup>
import edit from "../../components/mdEditor.vue";
import { useRequest } from "alova";
import { ArticleType, ArticleDetail } from "@/api/methods/article";

const { send: getid, onSuccess ,data} = useRequest(() => ArticleType({ typename: '关于我们' }))
// const { send: getArticleInfo, data } = useRequest((id) => ArticleDetail(id), {
//   immediate: false
// })

</script>