<template>
    <t-space direction="vertical" size="large">
        <t-form ref="form" :data="formData" :rules="rules" reset-type="initial" colon>
            <t-form-item label="公司名" name="name">
                <t-input v-model="formData.name"></t-input>
            </t-form-item>
            <t-form-item label="邮箱" name="email">
                <t-auto-complete v-model="formData.email" :options="emailOptions" filterable></t-auto-complete>
            </t-form-item>

            <t-form-item label="简介" name="desc">
                <t-input v-model="formData.desc"></t-input>
            </t-form-item>

            <t-form-item label="链接" name="url">
                <t-input-adornment prepend="https://">
                    <t-input placeholder="请输入内容" v-model="formData.url" />
                </t-input-adornment>
            </t-form-item>
            <t-form-item label="头像" name="avatar">
                <imgUpload prefix="friendImage/" v-model:uploadImg="formData.avatar"></imgUpload>
            </t-form-item>

        </t-form>

    </t-space>
</template>
<script setup>
import { ref, reactive, computed } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import imgUpload from '@/components/Imgupload.vue'
import { useRequest, invalidateCache, updateState } from "alova";
import { useForm } from '@alova/scene-vue';

import {
    CreateFriend,
    UpdateFriend
} from "@/api/methods/friend";
const form = ref(null);
const {
    // 提交状态
    loading: submiting,
    // 响应式的表单数据，内容由initialForm决定
    form: formData,
    // 提交数据函数
    send: submit,
    // 提交成功回调绑定
    onSuccess,
} = useForm(
    data => {
        // 可以在此转换表单数据并提交
        return CreateFriend(data)
    },
    {
        resetAfterSubmiting: true,
        // 初始化表单数据
        initialForm: {
            name: '',
            desc: '',
            email: '',
            url: '',
            status: 1,
            avatar: ''
        }
    }
);
const emailSuffix = ['@qq.com', '@163.com', '@gmail.com'];
const rules = {
    name: [
        { required: true, message: '公司名必填', type: 'error', trigger: 'blur' },
        { required: true, message: '公司名必填', type: 'error', trigger: 'change' },
        { whitespace: true, message: '公司名不能为空' },

    ],

    email: [{ required: true, message: '格式必须为邮箱', type: 'warning' }],

};
const emailOptions = computed(() => {
    const emailPrefix = formData.value.email.split('@')[0];
    if (!emailPrefix) return [];

    return emailSuffix.map((suffix) => emailPrefix + suffix);
});
const onReset = () => {
    form.value.reset({ type: 'initial' });
    MessagePlugin.success('重置完成');
};
const onSubmit = async () => {
    form.value.submit();
    //   submit()
    // 校验数据，代码有效，勿删
    let validateResult = await form.value.validate()
    if (validateResult && Object.keys(validateResult).length) {
        const firstError = Object.values(validateResult)[0]?.[0]?.message;
        MessagePlugin.warning(firstError);
    } else if (validateResult) {
        let result = await submit()
        console.log(result)
        form.value.reset({ type: 'initial' });
    }

};


defineExpose({
    onReset, onSubmit
});
</script>
  