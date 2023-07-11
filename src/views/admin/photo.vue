<template>
  <t-row>
    <t-col>
      <t-collapse :default-value="[0]" @change="handlePanelChange">
        <t-collapse-panel key="1" header="首页轮播图列表">
          <div class="flex flex-wrap" v-if="listData&&listData.length>0"><t-card bordered class="basis-1/5 m-8" v-for="(item, index) in listData"
              :key="item.qiniu_key">
              <template #cover>
                <div >
                  <t-image-viewer :key="item.qiniu_key" :default-index="Number(index)" :images="list">
                    <template #trigger="{ open }">
                      <div class=" tdesign-demo-image-viewer__ui-image tdesign-demo-image-viewer__base ">
                        <img alt="test" :src="QINIU_CDN_URL + item.qiniu_key"
                          class="tdesign-demo-image-viewer__ui-image--img" />
                        <div class="tdesign-demo-image-viewer__ui-image--hover" @click="open">
                          <span>
                            <BrowseIcon size="1.4em" /> 预览
                          </span>
                        </div>
                      </div>
                    </template>
                  </t-image-viewer>
                </div>
              </template>
              <template #footer>
                <t-row :align="'middle'" justify="center" style="gap: 24px">
                  <!-- <t-col flex="auto" style="display: inline-flex; justify-content: center">
                    <t-button variant="text" shape="square"  :onClick="downloadImage((QINIU_CDN_URL + item.qiniu_key),item.qiniu_key)">
                      <download-icon />
                    </t-button>
                  </t-col> -->
                  <t-col flex="auto" style="display: inline-flex; justify-content: center">
                    <t-button variant="text" shape="square" @click="deletePhoto(item.id)">
                      <delete-icon />
                    </t-button>
                  </t-col>
                </t-row>
              </template>
            </t-card></div>
          <div>新增轮播图
            <t-row><t-col>
                <imgUpload prefix="homeImage/"></imgUpload>
              </t-col></t-row>
          </div>
        </t-collapse-panel>

      </t-collapse>
    </t-col>
  </t-row>
</template>
  
<script setup>
import {  DeleteIcon, BrowseIcon } from 'tdesign-icons-vue-next';
import { ref, reactive } from "vue";
import { useRequest, useWatcher, updateState } from "alova";
import { getlistByprefix, fetchDeleteQiniuData, getToken } from '../../api/methods/qiniuyun.js'
import { QINIU_CDN_URL } from "@/config.js";
import imgUpload from "../../components/Imgupload.vue";
import { actionDelegationMiddleware } from '@alova/scene-vue';
const { send: delPhoto, data } = useRequest((id) => fetchDeleteQiniuData(id), {
  immediate: false
})
const list = ref([]);
const { send, data: listData, onSuccess } = useRequest(() => getlistByprefix({prefix:'homeImage/'}), {
 
  force: isForce => { return !!isForce },
  middleware: actionDelegationMiddleware('getHomephohto')
})
onSuccess(e => {
  listData.value=e.data.data
  let tmp = listData.value.map(e => {
    return QINIU_CDN_URL + e.qiniu_key
  })
  list.value = tmp
  return e
})
const currentItem = ref([1]);
const handlePanelChange = (val) => {
  currentItem.value = val;
};
const deletePhoto = async (id) => {
  let tmp = await delPhoto(id)
  if (tmp.code == 200) {
    updateState(getlistByprefix({prefix:'homeImage/'}), oldListData => {
      console.log(oldListData)
      const index = oldListData.findIndex((item) => { return item.id === id });
      oldListData.splice(index, 1);
      return oldListData;
    });
  }
}

</script>
<style scoped>
.tdesign-demo-image-viewer__ui-image {
  width: 100%;
  height: 100%;
  display: inline-flex;
  position: relative;
  justify-content: center;
  align-items: center;
  border-radius: var(--td-radius-small);
  overflow: hidden;
}

.tdesign-demo-image-viewer__ui-image--hover {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: var(--td-text-color-anti);
  line-height: 22px;
  transition: 0.2s;
}

.tdesign-demo-image-viewer__ui-image:hover .tdesign-demo-image-viewer__ui-image--hover {
  opacity: 1;
  cursor: pointer;
}

.tdesign-demo-image-viewer__ui-image--img {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
  position: absolute;
}

.tdesign-demo-image-viewer__ui-image--footer {
  padding: 0 16px;
  height: 56px;
  width: 100%;
  line-height: 56px;
  font-size: 16px;
  position: absolute;
  bottom: 0;
  color: var(--td-text-color-anti);
  background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%);
  display: flex;
  box-sizing: border-box;
}

.tdesign-demo-image-viewer__ui-image--title {
  flex: 1;
}

.tdesign-demo-popup__reference {
  margin-left: 16px;
}

.tdesign-demo-image-viewer__ui-image--icons .tdesign-demo-icon {
  cursor: pointer;
}

.tdesign-demo-image-viewer__base {
  width: 100%;
  height: 160px;
  border: 4px solid var(--td-bg-color-secondarycontainer);
  border-radius: var(--td-radius-medium);
}
</style>