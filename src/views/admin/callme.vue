<template>
  <div class=" bg-white rounded-lg w-[97%] mx-auto h-[80%]">

    <div class="w-1/2 m-auto">
      <t-divider class="text-xl font-bold subpixel-antialiased leading-[4em]">联系我们</t-divider>
    </div>
    <div v-if="!loading">
      <edit :data="data.data.rows[0]" />
    </div>
  </div>
</template>
    
<script setup>
import edit from "@/components/mdEditor.vue";
import { useRequest } from "alova";
import { ArticleType, ArticleDetail } from "@/api/methods/article";

const { loading,send: getid, onSuccess, data } = useRequest(() => ArticleType({ typename: '联系我们' }))

</script>