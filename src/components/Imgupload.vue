<template>
  <div class="tdesign-demo-block-column-large">

    <!-- data 表示传递给上传接口的额外数据；如果有更复杂的数据场景传递，请使用 format 方法 -->
    <!-- abridgeName 表示省略文件名中间文本，保留两侧。左侧保留的文本数量，右侧保留的文本数量] -->
    <!--
         use fileListDisplay to define any file info
         fileListDisplay={(h, { files }) => <div>{JSON.stringify(files)}</div>}
       -->
    <t-row><t-col>
        <div>是否自动上传：<t-switch v-model="autoUpload"></t-switch></div>
      </t-col></t-row>
    <t-row><t-col>
        <t-space>
          <t-upload v-model="files" :auto-upload="autoUpload" accept="image/*" theme="image" :abridge-name="[10, 8]"
            :format-Request="formatRequest" draggable action="https://upload-z2.qiniup.com/" :headers="seesion"
            :formatResponse="formatResponse" :on-Success="handleRequestSuccess" :on-fail="handleRequestFail" :on-Remove="handleRemove" />
        </t-space>
      </t-col></t-row>
  </div>
</template>
<script setup>
import { ref, watch, defineProps } from 'vue';
import { getHash, splitFile } from '@/util/index.js';
import { useRequest, invalidateCache, updateState } from 'alova';
import {
  getToken,
  SyncToSql,

  fetchDeleteQiniuDataByQiniuKey
} from '../api/methods/qiniuyun.js';
const props = defineProps({
  prefix: String,
});
import { accessAction } from '@alova/scene-vue';

const autoUpload = ref(true);
const files = ref([]);
const prefix = props.prefix

const {
  send:delKey,
  onSuccess
  // 直接将Method实例传入即可发送请求
} = useRequest((qiniu_key) => fetchDeleteQiniuDataByQiniuKey({qiniu_key}), {
  immediate: false

  // 请求响应前，data的初始值
});
const {
  send: gettoken,
  data: token,
  onSuccess: getTokenSuccess
  // 直接将Method实例传入即可发送请求
} = useRequest(() => getToken(), {
  // 请求响应前，data的初始值
});
const {
  send: SyncDate,
  data,
  onSuccess: syncDone
  // 直接将Method实例传入即可发送请求
} = useRequest((prefix, force) => SyncToSql({ prefix, force }), {
  // 请求响应前，data的初始值
  immediate: false

});
getTokenSuccess(e => {
  e.data && sessionStorage.setItem('uploadToken', e.data.data);
})

const formatRequest = (res) => {
  res['token'] = sessionStorage.getItem('uploadToken');
  res['key'] = prefix + res.file.name
  res['fname'] = prefix + res.file.name
  return res
}
const formatResponse = (res) => {
  res['url'] = 'http://rwnrmrlqg.hn-bkt.clouddn.com/' + res.key
  return res
}

const handleRequestFail = async (e) => {
  sessionStorage.removeItem('uploadToken');
  await gettoken()
}
const handleRequestSuccess = async (e) => {
  await SyncDate(prefix)
  await accessAction('getHomephohto', async ({ send }) => {
    // 调用组件A中的send函数
    await send('admin');

  });
}
const handleRemove=async(e)=>{
//   console.log(e.file.name)
// await delKey(e.file.name)
}
const seesion = { Authorization: "Bearer " + sessionStorage.getItem("Bearer") }
</script>
  