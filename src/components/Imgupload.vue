<template>
  <div class="tdesign-demo-block-column-large">

    <!-- data 表示传递给上传接口的额外数据；如果有更复杂的数据场景传递，请使用 format 方法 -->
    <!-- abridgeName 表示省略文件名中间文本，保留两侧。左侧保留的文本数量，右侧保留的文本数量] -->
    <!--
         use fileListDisplay to define any file info
         fileListDisplay={(h, { files }) => <div>{JSON.stringify(files)}</div>}
       -->
    <t-row><t-col>
        <div>自动上传：<t-switch :disabled="true" v-model="autoUpload"></t-switch></div>
      </t-col></t-row>
    <t-row><t-col>
        <t-space>
          <t-upload ref="uploadRef" v-model="files" :auto-upload="autoUpload" accept="image/*" theme="image" :abridge-name="[10, 8]"
            :format-Request="formatRequest" action="https://upload-z2.qiniup.com/" :headers="seesion"
            :formatResponse="formatResponse" :on-Success="handleRequestSuccess" :on-fail="handleRequestFail"
            :on-Remove="handleRemove" />
        </t-space>
      </t-col></t-row>
  </div>
</template>
<script setup>
import { QINIU_CDN_URL } from "@/config.js";
import { ref, watch ,defineEmits} from 'vue';
import { getHash, splitFile } from '@/util/index.js';
import { useRequest, invalidateCache, updateState } from 'alova';
import {
  getToken,
  SyncToSql,
  fetchDeleteQiniuDataByQiniuKey
} from '../api/methods/qiniuyun.js';
const props = defineProps({
  prefix: String,
  uploadImg: String
});
const emit = defineEmits(['update:uploadImg']);
import { accessAction } from '@alova/scene-vue';

const autoUpload = ref(true);
const files = ref([]);
const prefix = props.prefix
//同步传值
props.uploadImg ? files.value = [{
  name: props.uploadImg.match(/\/([^\/]+)$/)[1], url: props.uploadImg, status: 'success',
}] :  files.value = [];
//处理异步

watch(() => props.uploadImg, (newData) => {

  if (newData) {
    files.value = [{
      name: newData.match(/\/([^\/]+)$/)[1], url: newData, status: 'success',
    }];
  }else{
    files.value = [];
  }
});
//根据名字删除
const {
  send: delKey,
  onSuccess
} = useRequest((qiniu_key) => fetchDeleteQiniuDataByQiniuKey({ qiniu_key }), {
  immediate: false
});
//获取token
const {
  send: gettoken,
  data: token,
  onSuccess: getTokenSuccess
  // 直接将Method实例传入即可发送请求
} = useRequest(() => getToken(), {
});
//同步
const { send: SyncDate, data, onSuccess: syncDone } = useRequest((prefix, force) => SyncToSql({ prefix, force }), { immediate: false });
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
  res['url'] = QINIU_CDN_URL + res.key
  emit('update:uploadImg', res['url'])
  return res
}

const handleRequestFail = async (e) => {
  sessionStorage.removeItem('uploadToken');
  await gettoken()
}
const handleRequestSuccess = async (e) => {
  await SyncDate(prefix)
  if (prefix == 'homeImage/') {
    await accessAction('getHomephohto', async ({ send }) => {
      // 调用组件A中的send函数
      await send('admin');
    });
  }

}
const uploadRef=ref(null)
const handleRemove =  (e) => {
  files.value = [];

  // files._rawValue=[]
}
defineExpose({handleRemove});
const seesion = { Authorization: "Bearer " + sessionStorage.getItem("Bearer") }
</script>
  