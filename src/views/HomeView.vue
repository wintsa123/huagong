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
import { fetchQiniuDataList } from '../api/methods/qiniuyun.js'
import { QINIU_CDN_URL } from "@/config.js";
import { useRequest } from "alova";
const { send, data: listData, onSuccess } = useRequest(() => fetchQiniuDataList(), {
  initialData: {
    "data": {
      "nowPage": 1,
      "pageSize": 4,
      "hasMore": false,
      "total": 4,
      "rows": [
        {
          "id": 3,
          "user_id": 1,
          "prefix": "",
          "bucket": "",
          "qiniu_key": "",
          "qiniu_hash": "",
          "qiniu_fsize": "",
          "qiniu_mimeType": "",
          "qiniu_putTime": "",
          "qiniu_type": "0",
          "qiniu_status": "0",
          "qiniu_md5": "",
          "created_at": "",
          "updated_at": "",
          "deleted_at": null,
          "url":"https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1cCNPI.img?w=1920&h=1080&q=60&m=2&f=jpg"
        }]
    }
  },
})
onSuccess(e => {
  listData.value=e.data.filter(item=>{return item.prefix=='homeImage/'})

  listData.value=listData.value.map(e=>{
    const modifiedObj = { ...e }; // 创建一个副本用于修改
    modifiedObj.url=QINIU_CDN_URL+e.qiniu_key
    return modifiedObj
  })
  console.log(listData.value)
  return e
})


</script>
