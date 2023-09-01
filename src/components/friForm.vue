<template>
    <t-space direction="vertical" size="large">
        <t-form ref="form" :data="formData" :rules="rules" colon reset-type="initial"  >
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
import { ref, reactive, computed, unref, onMounted, watch,onActivated  } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import imgUpload from '@/components/Imgupload.vue'
import { useRequest, updateState } from "alova";
import { useForm } from '@alova/scene-vue';
import { cloneDeep } from "@pureadmin/utils"
// onActivated(() => {
//   console.log('first')
// });
import {
    CreateFriend,
    UpdateFriend,
    FriendList
} from "@/api/methods/friend";
const form = ref(null);
const props = defineProps(['info']);
const { send: update } = useRequest((obj) => UpdateFriend(obj), { immediate: false })
const {
    // 响应式的表单数据，内容由initialForm决定
    form: formData,
    // 提交数据函数
    send: submit,
    // 提交成功回调绑定
    onSuccess,
    reset
} = useForm(
    data => {
        // 可以在此转换表单数据并提交
        return CreateFriend(data)
    },
    {
        resetAfterSubmiting: true,

        // 初始化表单数据
        initialForm: {
            name: props.info?.name || '',
            desc: props.info?.desc || '',
            email: props.info?.email || '',
            url: props.info?.url || '',
            status: props.info?.status || 1,
            avatar: props.info?.avatar || ''
        }
    }
);

const emailSuffix = ['@qq.com', '@163.com', '@gmail.com'];
const rules = {
    name: [
            { required: true, message: '公司名必填', type: 'error', trigger: 'blur' },

        { whitespace: true, message: '公司名不能为空' },
    ],
    email: [{ required: true, message: '格式必须为邮箱', type: 'error' }],

};


const emailOptions = computed(() => {
    const emailPrefix = formData.value.email.split('@')[0];
    if (!emailPrefix) return [];

    return emailSuffix.map((suffix) => emailPrefix + suffix);
});

const onSubmit = async () => {
    // 校验数据，代码有效，勿删
    let validateResult = await form.value.validate()
    if (validateResult && Object.keys(validateResult).length) {
        const firstError = Object.values(validateResult)[0]?.[0]?.message;
        MessagePlugin.warning(firstError);
    }
    if (validateResult) {
        if (!!props.info) {
            formData.value['id'] = props.info?.id
            let result = await update(unref(formData))

            if (result.code == 200) {
                MessagePlugin.success(result.message);

                await updateState(FriendList(), (e) => {
                    e.data.rows.forEach((element, index) => {
                        if (element.id == props.info.id) {
                            e.data.rows[index] = { ...unref(formData) }
                        }
                    });
                    return e
                })
                return Promise.resolve(result.code);
            }
        } else {
            let backup = cloneDeep(formData.value)

            let result = await submit()
            if (result.code == 200) {
                MessagePlugin.success(result.message);

                await updateState(FriendList(), (e) => {
                    backup['id'] = result.data.id
                    e.data.rows.push(backup)
                    return e
                })
                form.value.reset({ type: 'initial' });

                return Promise.resolve(result.code);

            }
        }


    }

    return false
};

const restFunction = () => {
//   form.value.reset();
  // 下方为示例代码，有效，勿删
  form.value.reset({ type: 'initial' });
  // form.value.reset({ type: 'empty' });
  // form.value.reset({ type: 'initial', fields: ['name'] });
  // form.value.reset({ type: 'empty', fields: ['name'] });
};defineExpose({
     onSubmit,restFunction
});
</script>
<style scoped>
:deep(.t-collapse-panel__content) {
    padding: 0px !important;
}
</style>