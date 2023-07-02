<template>
  <t-swiper
    class="tdesign-demo-block--swiper w-5/6 mx-auto aspect-[16/8]"
    animation="fade"
    :navigation="{ showSlideBtn: 'hover', size: 'large' }"
  >
    <t-swiper-item v-for="item in listData" :key="item.id">
      <div class="demo-item w-screen">
        <t-image class="w-full aspect-[16/9]"  shape="round" :src="item.url"  position="center" fit="contain"  />
      </div>
    </t-swiper-item>
  </t-swiper>
</template>

<script setup lang="jsx">
import { getlistByprefix } from '../api/methods/qiniuyun.js'
import { QINIU_CDN_URL } from "@/config.js";
import { useRequest } from "alova";
const { send, data: listData, onSuccess } = useRequest(() => getlistByprefix({prefix:'homeImage/'}), {
  initialData: [{
    "data":{
      "id": "",
      "user_id": "",
      "prefix": "",
      "bucket": "",
      "qiniu_key": "",
      "qiniu_hash": "",
      "qiniu_fsize": "",
      "qiniu_mimeType": "",
      "qiniu_putTime": "",
      "qiniu_type": "",
      "qiniu_status": "",
      "qiniu_md5": "",
      "created_at": "",
      "updated_at": "",
      "deleted_at": null
    }}],
})
onSuccess(e => {
  listData.value=e.data.data

  listData.value=listData.value.map(e=>{
    const modifiedObj = { ...e }; // 创建一个副本用于修改
    modifiedObj.url=QINIU_CDN_URL+e.qiniu_key
    return modifiedObj
  })
  return e
})


</script>
