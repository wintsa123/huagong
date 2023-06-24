<template>
  <div class="tdesign-demo-block-column-large">
    
    <!-- data 表示传递给上传接口的额外数据；如果有更复杂的数据场景传递，请使用 format 方法 -->
    <!-- abridgeName 表示省略文件名中间文本，保留两侧。左侧保留的文本数量，右侧保留的文本数量] -->
    <!--
         use fileListDisplay to define any file info
         fileListDisplay={(h, { files }) => <div>{JSON.stringify(files)}</div>}
       -->
    <t-space>
      <t-upload v-model="files" :auto-upload="autoUpload" accept="image/*" theme="image"
         :abridge-name="[10, 8]" :format-Request="formatRequest"
        draggable action="https://upload-z2.qiniup.com/" :headers="seesion" :formatResponse="formatResponse"/>
    </t-space>
  </div>
</template>
<script setup>
import { ref,watch } from 'vue';
import { getHash, splitFile } from '@/util/index.js';
import { useRequest, invalidateCache } from 'alova';

import {
  getToken,

} from '../api/methods/qiniuyun.js';
const autoUpload = ref(true);
const files = ref([]);


const {
  send: gettoken,
  data:token
  // 直接将Method实例传入即可发送请求
} = useRequest(() => getToken(), {
 
  // 请求响应前，data的初始值
});

watch(token, (newValue, oldValue) => {
  console.log(newValue.data)
  sessionStorage.setItem('uploadToken', newValue.data);
  // 在ref变化时触发的函数
});
// const {
//   send: uolpadToQiniu,
//   // 直接将Method实例传入即可发送请求
// } = useRequest((e) => fetchUpload(e), {
//   // 请求响应前，data的初始值
//   immediate: false
// });
// const mergeAndUpload = async ({ hash, ext, id }) => {
//   await merge({ hash, ext });
//   console.log('12')
//   const { data } = await uolpadToQiniu({
//     hash,
//     ext,
//     prefix: prefix,
//   });
//   files.value.forEach((val) => {
//     if (val.id === id) {
//       val.status = 'finished';
//       val.percentage = 100;
//       val.url = data.resultUrl;
//     }
//   });
//   clearInterval(timerObj.value[id]);

//   return data;
// };


const prefix = 'homeImage';

// res.url 图片地址；res.uploadTime 文件上传时间；res.error 上传失败的原因
// const {
//   send: UploadChunk,
//   // 直接将Method实例传入即可发送请求
// } = useRequest((e) => fetchUploadChunk(e), {
//   // 请求响应前，data的初始值
//   immediate: false
// });


// res.url 图片地址；res.uploadTime 文件上传时间；res.error 上传失败的原因
const formatRequest = (res) => {
  res['token'] =   sessionStorage.getItem('uploadToken');
  res['key'] = prefix+res.file.name
  res['fname'] = prefix+res.file.name
  return res
}
const formatResponse = async (res) => {
  if (!res.key) {
    res.error='token过期'
    
    sessionStorage.removeItem('uploadToken');
    await gettoken()
    return res
  }
  res['url']='http://rwnrmrlqg.hn-bkt.clouddn.com/'+res.key
  return res
 
}




// const handleSelectChange = async (files) => {
//   const { hash, ext } = await getHash(files[0]);
//   fileInfo.value.hash = hash
//   fileInfo.value.ext = ext
// };

// const diyUpload = async (data) => {
//   const id = files.id;

//   const { hash, ext } = await getHash(data.raw);
//   const { code } = await fetchUploadProgress({ prefix, hash, ext });

//   if (code === 3) {
//     const { data } = await fetchUpload({ prefix, hash, ext });
//     files.value.forEach((val) => {
//       if (val.id === id) {
//         val.status = 'finished';
//         val.percentage = 100;
//         val.url = data.resultUrl;
//       }
//     });
//     return data;
//   }
//   const chunkList = splitFile(data.raw);
//   let isMerge = false;
//   return new Promise((resolve) => {
//     for (let i = 0; i < chunkList.length; i += 1) {
//       const v = chunkList[i];
//       const form = new FormData();
//       form.append('prefix', prefix);
//       form.append('hash', hash);
//       form.append('ext', ext);
//       form.append('chunkName', v.chunkName);
//       form.append('chunkTotal', `${chunkList.length}`);
//       form.append('uploadFiles', v.chunk);
//       UploadChunk(form).then((res) => {
//         files.value.forEach((val) => {
//           if (val.id === id) {
//             val.status = 'uploading';
//             val.percentage = res.data.percentage;
//             if (res.data.percentage === 50) {
//               if (!isMerge) {
//                 mergeAndUpload({ hash, ext, id }).then((uploadRes) => {
//                   resolve(uploadRes);
//                 });
//                 isMerge = true;
//               }
//             }
//           }
//         });
//       });
//     }
//     let flag = false;
//     timerObj.value[id] = setInterval(async () => {
//       try {
//         // eslint-disable-next-line @typescript-eslint/no-shadow
//         const { code, data, message } = await fetchUploadProgress({
//           hash,
//           prefix,
//           ext,
//         });
//         if (flag) {
//           clearInterval(timerObj.value[id]);
//           return;
//         }
//         if (code === 1) {
//           const percentage = data.percentage;
//           files.value.forEach((v) => {
//             if (v.id === file.id) {
//               v.status = percentage < 100 ? 'uploading' : 'finished';
//               v.percentage = percentage;
//             }
//           });
//           if (percentage === 100) {
//             flag = true;
//           }
//         } else if (code === 2) {
//           files.value.forEach((v) => {
//             if (v.id === file.id) {
//               v.status = 'uploading';
//               v.percentage = 0;
//             }
//           });
//         } else {
//         }
//       } catch (error) {
//         console.log(error);
//         clearInterval(timerObj.value[id]);
//       }
//     }, 1000);
//   });
// }





const seesion = { Authorization: "Bearer " + sessionStorage.getItem("Bearer") }
</script>
  