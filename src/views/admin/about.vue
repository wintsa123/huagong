<template>
    <edit/>
  </template>
  
  <script setup>
import  edit  from "../../components/mdEditor.vue";
  import { useRequest  } from "alova";
  import { ArticleType,CreateArticle } from "@/api/methods/article";

  const {send:getid,data}=useRequest(()=>ArticleType({typename:'关于我们'}), { immediate: false })
  const {send}=useRequest(()=>CreateArticle({typename:'关于我们'}), { immediate: false })


  </script>