<template>
  <div class="w-screen">
    <t-space direction="vertical">


      <t-list :split="true">
        <template #header> 已有轮播图 </template>

        <t-list-item>
          <t-list-item-meta :image="avatarUrl" title="列表主内容" description="列表内容列表内容" />
          <template #image>
            <div class="tdesign-demo-image-viewer__base">
              
            </div>
          </template>

          <template #action>

            <t-button variant="text" shape="square">
              <download-icon />
            </t-button>
            <t-button variant="text" shape="square">
              <delete-icon />
            </t-button>
          </template>
        </t-list-item>
      </t-list>
    </t-space>
  </div>
</template>
  
<script setup>
import { EditIcon, DownloadIcon, DeleteIcon } from 'tdesign-icons-vue-next';

const avatarUrl = 'https://tdesign.gtimg.com/site/avatar.jpg';
</script>
  