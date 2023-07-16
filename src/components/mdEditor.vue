<template>
  <t-form
    ref="form"
    :rules="FORM_RULES"
    :data="formData"
    :colon="true"
    @submit="onSubmit"
    @reset="onReset"
    :disabled="disabled"
    resetType="initial"
    class="mr-10 mt-10 mb-10"
  >
    <t-form-item label="标题" name="title" v-if="shouldDisplayTitleFormItem">
      <t-input v-model.trim="formData.title" placeholder="请输入内容"></t-input>
    </t-form-item>
    <t-form-item label="简介" name="desc" v-if="shouldDisplayDescFormItem">
      <t-input v-model.trim="formData.desc" placeholder="请输入内容"></t-input>
    </t-form-item>
    <t-form-item label="标签" name="tags" v-if="shouldDisplayTagsFormItem">
      <t-select
        v-model.trim="formData.tags"
        creatable
        filterable
        multiple
        placeholder="输入按回车就可以创建/搜索哦"
        :options="allTag.rows"
        :autoWidth="true"
        :clearable="true"
        style="width: 400px"
        @create="createOptions"
      />
    </t-form-item>
    <t-form-item
      label="权重"
      v-if="shouldDisplaypriorityFormItem"
      name="priority"
    >
      <t-input-number
        v-model="formData.priority"
        theme="column"
        :max="100"
        :min="0"
      ></t-input-number>
    </t-form-item>
    <t-form-item label="图片" name="imgFile" v-if="shouldDisplayImageFormItem">
      <uploadImg prefix="articleImage/" v-model:uploadImg="formData.imgurl" />
    </t-form-item>
    <t-form-item label="内容" name="content" >
      <MdEditor
        v-model="formData.content"
        @onUploadImg="onUploadImg"
        :disabled="disabled"
      />
    </t-form-item>
    <t-form-item>
      <t-space size="small">
        <t-button theme="primary" type="submit" :loading="loading"
          >提交</t-button
        >
        <!-- 下方示例代码，有效，勿删 -->
        <t-button theme="default" variant="base" type="reset">重置</t-button>
      </t-space>
    </t-form-item>
  </t-form>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

import { ref, reactive, watch, computed, getCurrentInstance } from "vue";
import { MessagePlugin } from "tdesign-vue-next";
import uploadImg from "./Imgupload.vue";
import { useRequest, invalidateCache, useFetcher,updateState } from "alova";
import {
  CreateTag,
  taglist,
  CreateArticle,
  UpdateArticle,
  ArticleType,
} from "@/api/methods/article";

import {
  ArticleImg,
  getToken,
  fetchDeleteQiniuDataByQiniuKey,
  SyncToSql,
} from "@/api/methods/qiniuyun.js";
import { QINIU_CDN_URL } from "@/config.js";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { actionDelegationMiddleware, useForm } from "@alova/scene-vue";
import * as _ from "lodash";
const {
  // fetching属性与loading相同，发送拉取请求时为true，请求结束后为false
  fetching,
  error,
  onSuccess,
  onError,
  onComplete,

  // 调用fetch后才会发送请求拉取数据，可以重复调用fetch多次拉取不同接口的数据
  fetch,
} = useFetcher();
const props = defineProps({
  data: Object,
  disabled: Boolean,
});

//创建标签
const { send: creatrtag } = useRequest(
  (name, color) => CreateTag({ name, color }),
  { immediate: false }
);
//创建文章
const { send: creatArticle } = useRequest((data) => CreateArticle(data), {
  immediate: false,
});
//更新文章
const { send: updateArticle } = useRequest((data) => UpdateArticle(data), {
  immediate: false,
});
const { send: upimg } = useRequest((data) => ArticleImg(data), {
  immediate: false,
});
const { send, data: allTag } = useRequest(() => taglist(), {
  initialData: [
    {
      data: {
        rows: {
          label: "",
          value: "",
        },
      },
    },
  ],
  // force: isForce => { return !!isForce },
  // middleware: actionDelegationMiddleware('getTagList')
});
//获取token
const {
  send: gettoken,
  data: token,
  onSuccess: getTokenSuccess,
  // 直接将Method实例传入即可发送请求
} = useRequest(() => getToken(), {});
const {
  send: SyncDate,
  data,
  onSuccess: syncDone,
} = useRequest((prefix, force) => SyncToSql({ prefix, force }), {
  immediate: false,
});
getTokenSuccess((e) => {
  e.data && sessionStorage.setItem("uploadToken", e.data.data);
});
const loading = ref(false);
const form = ref(null);
const disabled = ref(props.disabled);
const FORM_RULES = { title: [{ required: true, message: "标题必填" }] };
const formData = reactive({
    title: props.data?  (props.data.title || ''):'',
    desc: props.data ? (props.data.desc || ''):'',
    content: props.data ? (props.data.content || '# 在这任意编辑哦，创意由你定') : '# 在这任意编辑哦，创意由你定',
    tags: props.data ? props.data.tags.map(e=>{return e.id}):[],
    imgurl: props.data ?(props.data.head_img || ''):'',
    is_comment: props.data ? (props.data.is_comment || 1):1,
    status: props.data ? (props.data.status || 1):1,
    types: props.data ? props.data.types.map(e=>{return e.id}):[],
    priority: props.data ?(props.data.priority || 0):0
});


const shouldDisplayImageFormItem = computed(() => {
  if (!props.data) return true;
  const excludedIds = [2, 3, 4, 5];
  return !excludedIds.includes(props.data?.id);
});
const shouldDisplaypriorityFormItem = computed(() => {
  if (!props.data) return true;
  const excludedIds = [2, 3, 4, 5];
  return !excludedIds.includes(props.data?.id);
});
const shouldDisplayDescFormItem = computed(() => {
  if (!props.data) return true;
  const excludedIds = [2, 3, 4, 5];
  return !excludedIds.includes(props.data?.id);
});
const shouldDisplayTagsFormItem = computed(() => {
  if (!props.data) return true;
  const excludedIds = [2, 3, 4, 5];
  return !excludedIds.includes(props.data?.id);
});
const shouldDisplayTitleFormItem = computed(() => {
  if (!props.data) return true;
  const excludedIds = [2, 3, 4, 5];
  return !excludedIds.includes(props.data?.id);
});

watch(
  () => props.disabled,
  (newData) => {
    disabled.value = newData;
  }
);
const createOptions = async (val) => {
  let result = await creatrtag(val, "green");
  await updateState(taglist(), (todoList) => {
    if (_.some(todoList.rows, { value: val })) {
      return todoList;
    }
    todoList.rows.push({ label: val, value: result.data, id: result.data });
    return todoList;
  });
  formData.tags[formData.tags.length - 1] = result.data;
  // await accessAction('getTagList', async ({ send }) => {
  //     // 调用组件A中的send函数
  //     await send('getTag');
  // });
};
const onSubmit = async ({ validateResult, firstError }) => {
  if (validateResult === true) {
    loading.value = true;
    let result;
    //创建文章
    if (typeof props.data == "undefined") {
      result = await creatArticle({
        title: formData.title,
        content: formData.content,
        desc: formData.desc,
        head_img: formData.imgurl,
        is_comment: formData.is_comment,
        status: formData.status,
        tags: formData.tags,
        types: [1],
        priority: formData.priority,
      });
      if (result.code == 200) {
        MessagePlugin.success(result.message);
        // updateState(
        //  'ArticleList',
        //   (e) => {
        //     console.log(e)
        //     return e;
        //   }
        // );
                invalidateCache(ArticleType({ typename: '产品中心' }))

        router.go(-1);
      } else {
        MessagePlugin.warning(result.message);
      }
    } else {
      result = await updateArticle({
          id: props.data.id,
          title: formData.title,
          content: formData.content,
          desc: formData.desc,
          head_img: formData.imgurl,
          is_comment: formData.is_comment,
          status: formData.status,
          tags: formData.tags,
          types: formData.types,
          priority: formData.priority,
      })
      if (result.code == 200) {
        updateState(
          ArticleType({ typename: props.data.types[0].name }),
          (e) => {
            e.data.rows[0].content = formData.content;
            e.data.rows[0].desc = formData.desc;
            e.data.rows[0].tags = formData.tags;
            e.data.rows[0].priority = formData.priority;
            e.data.rows[0].head_img = formData.head_img;
            return e;
          }
        );
        // invalidateCache(ArticleType({ typename: props.data.types[0].name }))
        // fetch(ArticleType({ typename: props.data.types[0].name }));

        // await router.go(0)
        MessagePlugin.success(result.message);
      } else {
        MessagePlugin.warning(result.message);
      }
    }
    loading.value = false;
  } else {
    MessagePlugin.warning(firstError);
  }
};
const onReset = () => {
  reset();
  // formData.title = props.data.title;
  // formData.desc = props.data.desc;
  // formData.text = props.data.content ? props.data.content : formData.content;
  // formData.imgurl = props.data.head_img;
  // formData.tags = props.data.tags;
  // formData.status = props.data.status;
  // formData.types = [props.data.types[0].id]
  MessagePlugin.success("重置成功");
};
getTokenSuccess((e) => {
  e.data && sessionStorage.setItem("uploadToken", e.data.data);
});
const onUploadImg = async (files, callback) => {
  await gettoken();
  const result = await Promise.all(
    files.map((file) => {
      return new Promise(async (rev, rej) => {
        const form = new FormData();
        form.append("token", sessionStorage.getItem("uploadToken"));
        form.append("key", "articleImage/" + file.name);
        form.append("fname", "articleImage/" + file.name);
        form.append("file", file);
        // rev(upimg(form))
        try {
          const res = await upimg(form);
          await SyncDate("articleImage/");
          rev(res);
        } catch (error) {
          rej(error);
        }
      });
    })
  );
  callback(result.map((item) => QINIU_CDN_URL + item.data.key));
};
</script>
