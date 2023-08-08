import {
    fetchUpload,
    fetchUploadChunk,
    fetchUploadMergeChunk,
    fetchUploadProgress,
  } from '../api/methods/qiniuyun.js';
  import { getHash, splitFile } from '../util/index.js';
  
  export const useUpload = async ({
    prefix,
    file,
  }) => {
    let timer;
    let isMerge = false;
  
    const mergeAndUpload = async ({ hash, ext }) => {
      await fetchUploadMergeChunk({ hash, ext });
      const { data } = await fetchUpload({
        hash,
        ext,
        prefix,
      });
      clearInterval(timer);
      return data;
    };
  
    try {
      const { hash, ext } = await getHash(file);
      const { code } = await fetchUploadProgress({ prefix, hash, ext });
      if (code === 3) {
        const res = await fetchUpload({ prefix, hash, ext });
        return new Promise((resolve) => {
          resolve(res.data);
        });
      }
      const chunkList = splitFile(file);
      return new Promise((resolve) => {
        for (let i = 0; i < chunkList.length; i += 1) {
          const v = chunkList[i];
          const form = new FormData();
          form.append('prefix', prefix);
          form.append('hash', hash);
          form.append('ext', ext);
          form.append('chunkName', v.chunkName);
          form.append('chunkTotal', `${chunkList.length}`);
          form.append('uploadFiles', v.chunk);
          fetchUploadChunk(form).then((res) => {
            if (res.data.percentage === 50) {
              if (!isMerge) {
                mergeAndUpload({ hash, ext }).then((uploadRes) => {
                  resolve(uploadRes);
                });
                isMerge = true;
              }
            }
          });
        }
        let flag = false;
        timer = setInterval(async () => {
          try {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const { code, data, message } = await fetchUploadProgress({
              hash,
              prefix,
              ext,
            });
            if (flag) {
              clearInterval(timer);
              return;
            }
            if (code === 1) {
              const percentage = data&&data.percentage
              if (percentage === 100) {
                flag = true;
              }
            } else {
            }
          } catch (error) {
            clearInterval(timer);
          }
        }, 1000);
      });
    } catch (error) {
      clearInterval(timer);
    }
  };
  