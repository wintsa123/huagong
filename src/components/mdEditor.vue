<template>
    <t-form ref="form" :rules="FORM_RULES" :data="formData" :colon="true" @reset="onReset" @submit="onSubmit"
        class="mr-10 mt-10 ">
        <t-form-item label="标题" name="title">
            <t-input v-model="formData.title" placeholder="请输入内容"></t-input>
        </t-form-item>

        <t-form-item label="简介" name="desc">
            <t-input v-model="formData.desc" placeholder="请输入内容"></t-input>
        </t-form-item>
        <t-form-item label="标签" name="tag">
            <t-select v-model="formData.tag" creatable filterable multiple placeholder="输入按回车就可以创建/搜索哦"
                :options="allTag.rows" :autoWidth="true" :clearable="true" style="width: 400px" @create="createOptions" />
        </t-form-item>
        <t-form-item label="权重" name="weight">
            <t-input-number v-model="formData.weight" theme="column" :max="100" :min="0"></t-input-number>
        </t-form-item>
        <t-form-item label="首页图" name="imgFile">
            <uploadImg prefix="articleImage/" />
        </t-form-item>
        <t-form-item label="内容" name="markdowm">
            <MdEditor v-model="formData.text" />
        </t-form-item>
        <t-form-item>
            <t-space size="small">
                <t-button theme="primary" type="submit">提交</t-button>
                <t-button theme="default" variant="base" type="reset">重置</t-button>
                <!-- 下方示例代码，有效，勿删 -->
                <!-- <t-button theme="default" @click="submitForm">实例方法提交</t-button> -->
                <!-- <t-button theme="default" variant="base" @click="resetForm">实例方法重置</t-button> -->
                <!--<t-button theme="default" variant="base" @click="validateOnly">仅校验</t-button>-->
            </t-space>
        </t-form-item>
    </t-form>
</template>
  
<script setup>
import { ref, reactive } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import uploadImg from './Imgupload.vue';
import { useRequest, updateState } from "alova";
import { CreateTag, taglist } from "@/api/methods/article";
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
                "id":''
            }
        }
    }],
    // force: isForce => { return !!isForce },
    // middleware: actionDelegationMiddleware('getTagList')
})

const FORM_RULES = { name: [{ required: true, message: '姓名必填' }] };

const formData = reactive({
    title: '',
    content: '',
    weight: 0,
    desc: '',
    text: '',
    tag: '',
    status: false,
});
const form = ref(null);

const createOptions = async (val) => {
    let result = await creatrtag(val, 'green')
    await updateState(taglist(), (todoList) => {
        console.log(todoList.rows)
        if (_.some(todoList.rows, { value: val })) { return todoList }
        todoList.rows.push({ label: val, value:val,id: result.data })
        return todoList
    });
    // await accessAction('getTagList', async ({ send }) => {
    //     // 调用组件A中的send函数
    //     await send('getTag');
    // });
    console.log('create option:', formData.tag);
};

const onReset = () => {
    MessagePlugin.success('重置成功');
};

const onSubmit = ({ validateResult, firstError }) => {
    if (validateResult === true) {
        MessagePlugin.success('提交成功');
    } else {
        console.log('Validate Errors: ', firstError, validateResult);
        MessagePlugin.warning(firstError);
    }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const submitForm = async () => {
    form.value.submit();
    form.value.submit({ showErrorMessage: false });

    // 校验数据，代码有效，勿删
    // form.value.validate();

    // 校验数据：只提交和校验，不在表单中显示错误文本信息。下方代码有效，勿删
    // form.value.validate({ showErrorMessage: false }).then((validateResult) => {
    //   if (validateResult && Object.keys(validateResult).length) {
    //     const firstError = Object.values(validateResult)[0]?.[0]?.message;
    //     MessagePlugin.warning(firstError);
    //   }
    // });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const resetForm = () => {
    form.value.reset();
    // 下方为示例代码，有效，勿删
    // form.value.reset({ type: 'initial' });
    form.value.reset({ text: '2' });
    // form.value.reset({ type: 'initial', fields: ['name'] });
    // form.value.reset({ type: 'empty', fields: ['name'] });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const validateOnly = async () => {
    const result = await form.value.validateOnly();
    MessagePlugin.success('打开控制台查看校验结果');
    console.log('validateOnly', result);
};



</script >
