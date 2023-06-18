<template>
  <t-swiper
    class="tdesign-demo-block--swiper w-5/6 mx-auto aspect-[16/8]"
    animation="fade"
    :navigation="{ showSlideBtn: 'hover', size: 'large' }"
  >
    <t-swiper-item v-for="item in items" :key="item.key">
      <div class="demo-item w-screen">
        <t-image class="w-full aspect-[16/9]"  shape="round" :src="item.url"  position="center" fit="contain"  />
      </div>
    </t-swiper-item>
  </t-swiper>
</template>

<script setup lang="jsx">
import { Tag } from "tdesign-vue-next";
const fit='fill'
const items = [
  {
    url: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1cCNPI.img?w=1920&h=1080&q=60&m=2&f=jpg",
    key: "1",
  },
  {
    url: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1cCPXx.img?w=1920&h=1080&q=60&m=2&f=jpg",
    key: "2",
  },
  {
    url: "https://jmy-pic.baidu.com/0/pic/-1549038296_-62235561_751148276.jpg",
    key: "3",
  },
];
const label = () => (
  <Tag
    shape="mark"
    theme="warning"
    style={{
      margin: "8px",
      borderRadius: "3px",
      background: "rgba(236,242,254,1)",
      color: "rgba(0,82,217,1)",
    }}
  >
    标签一
  </Tag>
);
</script>
