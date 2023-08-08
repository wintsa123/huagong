<template>
    <div style="width: 350px" class="w-screen mx-auto flex items-center h-screen">

        <t-form ref="form" :data="formData" :rules="rules" @reset="onReset" @submit="onSubmit" @validate="onValidate">
            <t-form-item label="旧密码" name="oldpwd">
                <t-input v-model="formData.oldpwd"></t-input>
            </t-form-item>

            <t-form-item label="密码" name="password">
                <t-input v-model="formData.password" type="password"></t-input>
            </t-form-item>

            <t-form-item label="确认密码" name="rePassword">
                <t-input v-model="formData.rePassword" type="password"></t-input>
            </t-form-item>

            <t-form-item>
                <t-space size="small">
                    <t-button theme="primary" type="submit">提交</t-button>
                    <t-button theme="default" variant="base" type="reset">重置</t-button>
                </t-space>
            </t-form-item>
        </t-form>
    </div>
</template>
<script setup>
import { ref, reactive } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { DesktopIcon, LockOnIcon } from 'tdesign-icons-vue-next';
import { Changepwd } from '@/api/methods/user';
import { useRequest, invalidateCache } from 'alova';
import { useRouter } from 'vue-router';
const router = useRouter();
const form = ref(null);
const formData = reactive({
    oldpwd: '',
    password: '',
    rePassword: '',
});
const onReset = () => {
    MessagePlugin.success('重置成功');
};
const {
    loading,
    data,
    error,
    send,
    // 直接将Method实例传入即可发送请求
} = useRequest(() => Changepwd(formData.oldpwd, formData.rePassword), {
    // 请求响应前，data的初始值
    immediate: false
});

const onSubmit = async ({ validateResult, firstError ,e}) => {
    if (formData.password!=formData.rePassword){
        MessagePlugin.warning('密码不一致');
        return
    }
    let a = await send()
    if (validateResult === true) {
        if (a.code == 200) {
            MessagePlugin.success(a.message);
        } else {
            MessagePlugin.warning(a.message);
        }
    } else {
        MessagePlugin.warning(firstError);
    }
};

const onValidate = ({ validateResult, firstError }) => {
  if (validateResult === true) {
  } else {
  }
};
const rePassword = (val) =>
  new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve(formData.password === val);
      clearTimeout(timer);
    });
  });

  const passwordValidator = (val) => {
  if (val.length > 0 && val.length <= 2) {
    return { result: false, message: '太简单了！再开动一下你的小脑筋吧！', type: 'error' };
  }
  if (val.length > 2 && val.length < 4) {
    return { result: false, message: '还差一点点，就是一个完美的密码了！', type: 'warning' };
  }
  return { result: true, message: '太强了，你确定自己记得住吗！', type: 'success' };
};

const rules = {
    account: [
    { required: true, message: '旧密码必填', type: 'error' },
    {
      min: 1,
      message: '不填提交啥啊',
      type: 'error',
      trigger: 'blur',
    },
  ],
  password: [{ required: true, message: '密码必填', type: 'error' }, { validator: passwordValidator }],
  rePassword: [
    // 自定义校验规则
    { required: true, message: '密码必填', type: 'error' },
    { validator: rePassword, message: '两次密码不一致' },
  ],
};

</script>
  