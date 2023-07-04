<template>
    <t-form ref="form" :rules="FORM_RULES" :data="formData" :colon="true" @submit="onSubmit"   @reset="onReset" resetType="initial" 
        class="mr-10 mt-10 mb-10">
        <t-form-item label="标题" name="title">
            <t-input v-model.trim="formData.title" placeholder="请输入内容"></t-input>
        </t-form-item>
        <t-form-item label="简介" name="desc">
            <t-input v-model.trim="formData.desc" placeholder="请输入内容"></t-input>
        </t-form-item>
        <t-form-item label="标签" name="tag">
            <t-select v-model.trim="formData.tag" creatable filterable multiple  placeholder="输入按回车就可以创建/搜索哦"
                :options="allTag.rows" :autoWidth="true" :clearable="true" style="width: 400px" @create="createOptions" />
        </t-form-item>
        <t-form-item label="权重" name="weight">
            <t-input-number v-model="formData.weight" theme="column" :max="100" :min="0"></t-input-number>
        </t-form-item>
        <t-form-item label="图片" name="imgFile">
            <uploadImg prefix="articleImage/" v-model:uploadImg="formData.imgurl"/>
        </t-form-item>
        <t-form-item label="内容" name="text">
            <MdEditor v-model="formData.text" />
        </t-form-item>
        <t-form-item>
            <t-space size="small">
                <t-button theme="primary" type="submit">提交</t-button>
                <!-- 下方示例代码，有效，勿删 -->
                <t-button theme="default" variant="base" type="reset">重置</t-button>
            </t-space>
        </t-form-item>
    </t-form>
</template>
  
<script setup>
import { ref, reactive } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import uploadImg from './Imgupload.vue';
import { useRequest, updateState } from "alova";
import { CreateTag, taglist,CreateArticle,UpdateArticle } from "@/api/methods/article";
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { actionDelegationMiddleware } from '@alova/scene-vue';
import * as _ from 'lodash'


const text = ref('# Hello Editor');
const { send: creatrtag, data } = useRequest((name, color) => CreateTag({ name, color }), { immediate: false })
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

const FORM_RULES = { title: [{ required: true, message: '标题必填' }] };

const formData = reactive({
    title: '',
    content: '',
    weight: 0,
    desc: '',
    text: '# 在这任意编辑哦，创意由你定',
    tag: '',
    imgurl:'',
    status: false,
});
const form = ref(null);

const createOptions = async (val) => {
    let result = await creatrtag(val, 'green')
    await updateState(taglist(), (todoList) => {
        console.log(todoList.rows)
        if (_.some(todoList.rows, { value: val })) { return todoList }
        todoList.rows.push({ label: val, value: result.data, id: result.data })
        return todoList
    });
    formData.tag[formData.tag.length-1]=result.data 
    // await accessAction('getTagList', async ({ send }) => {
    //     // 调用组件A中的send函数
    //     await send('getTag');
    // });
};


const onSubmit = ({ validateResult, firstError }) => {
    if (validateResult === true) {
        MessagePlugin.success('提交成功');
    } else {
        console.log('Validate Errors: ', firstError, validateResult);
        MessagePlugin.warning(firstError);
    }
};
const onReset = () => {
  MessagePlugin.success('重置成功');
};



</script >
