<template>
    <t-form ref="form" :rules="FORM_RULES" :data="formData" :colon="true" @submit="onSubmit" @reset="onReset"
        :disabled="disabled" resetType="initial" class="mr-10 mt-10 mb-10">
        <t-form-item label="标题" name="title" v-if="shouldDisplayTitleFormItem">
            <t-input v-model.trim="formData.title" placeholder="请输入内容"></t-input>
        </t-form-item>
        <t-form-item label="简介" name="desc" v-if="shouldDisplayDescFormItem">
            <t-input v-model.trim="formData.desc" placeholder="请输入内容"></t-input>
        </t-form-item>
        <t-form-item label="标签" name="tags" v-if="shouldDisplayTagsFormItem">
            <t-select v-model.trim="formData.tags" creatable filterable multiple placeholder="输入按回车就可以创建/搜索哦"
                :options="allTag.rows" :autoWidth="true" :clearable="true" style="width: 400px" @create="createOptions" />
        </t-form-item>
        <t-form-item label="权重" v-if="shouldDisplaypriorityFormItem" name="priority">
            <t-input-number v-model="formData.priority" theme="column" :max="100" :min="0"></t-input-number>
        </t-form-item>
        <t-form-item label="图片" name="imgFile" v-if="shouldDisplayImageFormItem">
            <uploadImg prefix="articleImage/" v-model:uploadImg="formData.imgurl" />
        </t-form-item>
        <t-form-item label="内容" name="content" >
            <MdEditor v-model="formData.content" @onUploadImg="onUploadImg" :disabled="disabled" />
        </t-form-item>
        <t-form-item>
            <t-space size="small">
                <t-button theme="primary" type="submit" :loading="loading">提交</t-button>
                <!-- 下方示例代码，有效，勿删 -->
                <t-button theme="default" variant="base" type="reset">重置</t-button>
            </t-space>
        </t-form-item>
    </t-form>
</template>
  
<script setup>
import { ref, reactive, watch, toRef, toRefs, computed } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import uploadImg from './Imgupload.vue';
import { useRequest, updateState } from "alova";
import { CreateTag, taglist, CreateArticle, UpdateArticle } from "@/api/methods/article";
import { ArticleImg, getToken, fetchDeleteQiniuDataByQiniuKey,SyncToSql } from "@/api/methods/qiniuyun.js";
import { QINIU_CDN_URL } from "@/config.js";
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { useRoute } from 'vue-router'
import { actionDelegationMiddleware } from '@alova/scene-vue';
import * as _ from 'lodash'
const text = ref('# Hello Editor');
const props = defineProps({
    data: Object,
    disabled: Boolean
});
const shouldDisplayImageFormItem = computed(() => {
    if (!props.data) return false;
    const excludedIds = [2, 3, 4, 5];
    return !excludedIds.includes(props.data?.id);
})
const shouldDisplaypriorityFormItem = computed(() => {
    if (!props.data) return false;
    const excludedIds = [2, 3,4, 5];
    return !excludedIds.includes(props.data?.id);
})
const shouldDisplayDescFormItem = computed(() => {
    if (!props.data) return false;
    const excludedIds = [2, 3, 4,5];
    return !excludedIds.includes(props.data?.id);
})
const shouldDisplayTagsFormItem = computed(() => {
    if (!props.data) return false;
    const excludedIds = [2, 3,4, 5];
    return !excludedIds.includes(props.data?.id);
})
const shouldDisplayTitleFormItem = computed(() => {
    if (!props.data) return false;
    const excludedIds = [2, 3,4, 5];
    return !excludedIds.includes(props.data?.id);
})
//创建标签
const route = useRoute();
const { send: creatrtag } = useRequest((name, color) => CreateTag({ name, color }), { immediate: false })
//创建文章
const { send: creatArticle } = useRequest((data) => CreateArticle(data), { immediate: false })
//更新文章
const { send: updateArticle } = useRequest((data) => UpdateArticle(data), { immediate: false })
const { send: upimg } = useRequest((data) => ArticleImg(data), { immediate: false })
const { send, data: allTag } = useRequest(() => taglist(), {
    initialData: [{
        data: {
            "rows": {
                "label": "",
                "value": "",
            }
        }
    }],
    // force: isForce => { return !!isForce },
    // middleware: actionDelegationMiddleware('getTagList')
})
//获取token
const {
    send: gettoken,
    data: token,
    onSuccess: getTokenSuccess
    // 直接将Method实例传入即可发送请求
} = useRequest(() => getToken(), {
});
const { send: SyncDate, data, onSuccess: syncDone } = useRequest((prefix, force) => SyncToSql({ prefix, force }), { immediate: false });
getTokenSuccess(e => {
    e.data && sessionStorage.setItem('uploadToken', e.data.data);
})
const loading = ref(false);
const form = ref(null);
const disabled = ref(props.disabled);
const FORM_RULES = { title: [{ required: true, message: '标题必填' }] };
const formData = reactive({
    title: props.data.title||'',
    desc: props.data.desc||'',
    content: props.data.content ? props.data.content : '# 在这任意编辑哦，创意由你定',
    tags:[props.data.tags[0]?.id]|| '',
    imgurl: props.data.head_img||'',
    is_comment: props.data.is_comment||1,
    status: props.data.status||1,
    types: [props.data.types[0].id]|| [],
    priority: props.data.priority||1
});


watch(() => props.disabled, (newData) => {
    disabled.value = newData;
});
const createOptions = async (val) => {
    let result = await creatrtag(val, 'green')
    await updateState(taglist(), (todoList) => {
        if (_.some(todoList.rows, { value: val })) { return todoList }
        todoList.rows.push({ label: val, value: result.data, id: result.data })
        return todoList
    });
    formData.tags[formData.tags.length - 1] = result.data
    // await accessAction('getTagList', async ({ send }) => {
    //     // 调用组件A中的send函数
    //     await send('getTag');
    // });
};
const onSubmit = async ({ validateResult, firstError }) => {
    if (validateResult === true) {
        loading.value = true
        // if (route.query.id) {

        // } else {

        let result = await updateArticle({
            id: props.data.id,
            title: formData.title,
            content: formData.text,
            desc: formData.desc,
            head_img: formData.imgurl,
            is_comment: formData.is_comment,
            status: formData.status,
            tags: formData.tags,
            types: formData.types,
            priority: formData.priority,
        })
        console.log(result)
        loading.value = false
        //提交
        // let result = await creatArticle({
        //     title: formData.title,
        //     content: formData.text,
        //     desc: formData.desc,
        //     head_img: formData.imgurl,
        //     is_comment: formData.is_comment,
        //     status: formData.status,
        //     tags: formData.tag,
        //     types: formData.types,
        //     priority: formData.priority,
        // })
        // loading.value = false

        // }

        MessagePlugin.success('提交成功');
    } else {
        MessagePlugin.warning(firstError);
    }
};
const onReset = () => {
    // formData.title = props.data.title;
    // formData.desc = props.data.desc;
    // formData.text = props.data.content ? props.data.content : formData.content;
    // formData.imgurl = props.data.head_img;
    // formData.tags = props.data.tags;
    // formData.status = props.data.status;
    // formData.types = [props.data.types[0].id]
    MessagePlugin.success('重置成功');
};
getTokenSuccess(e => {
    e.data && sessionStorage.setItem('uploadToken', e.data.data);
})
const onUploadImg = async (files, callback) => {
    await gettoken()
    const result = await Promise.all(
        files.map((file) => {
            return new Promise(async (rev, rej) => {
                const form = new FormData();
                form.append('token', sessionStorage.getItem('uploadToken'));
                form.append('key', 'articleImage/' + file.name);
                form.append('fname', 'articleImage/' + file.name);
                form.append('file', file);
                // rev(upimg(form))
                try {
                    const res = await upimg(form);
                    await SyncDate('articleImage/')
                    rev(res);
                } catch (error) {
                    rej(error);
                }
            });
        })
    );
    callback(result.map((item) => QINIU_CDN_URL + item.data.key));
};


</script >
