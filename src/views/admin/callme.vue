<template>
      <div class="w-1/2 m-auto">
                <t-divider class="text-xl font-bold subpixel-antialiased">联系我们</t-divider>
            </div>
  <div v-if=" typeof data =='object'">
    <edit :data="data.data.rows[0]" />
  </div>  
  </template>
    
  <script setup>
  import edit from "../../components/mdEditor.vue";
  import { useRequest } from "alova";
  import { ArticleType, ArticleDetail } from "@/api/methods/article";
  
  const { send: getid, onSuccess,data } = useRequest(() => ArticleType({ typename: '联系我们' }))
  // const { send: getArticleInfo, data } = useRequest((id) => ArticleDetail(id), {
  //   immediate: false
  // })
  // onSuccess(e => {
  //   console.log(data)
  //   getArticleInfo(e.data[0])
  // })
  </script>