<template>
  <div style="width: 350px" class="w-screen mx-auto flex items-center h-screen">
    <t-form :data="formData" :label-align="formData.labelAlign" :label-width="60" @reset="onReset" @submit="onSubmit">
      <div class="font-bold text-2xl">海鑫化工管理后台</div>
      <t-form-item label="账户:" name="user">
        <t-input v-model="formData.user"></t-input>
      </t-form-item>
      <t-form-item label="密码:" name="password">
        <t-input v-model="formData.password" type="password"></t-input>
      </t-form-item>
      <t-form-item>
        <t-space size="small">
          <t-button theme="primary" type="submit">登录</t-button>
          <t-button theme="default" variant="base" type="reset">重置</t-button>
        </t-space>
      </t-form-item>
    </t-form>
  </div>
</template>
<script setup>
import { reactive } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { DesktopIcon, LockOnIcon } from 'tdesign-icons-vue-next';
import { LoginUser } from '@/api/methods/user';
import { useRequest, invalidateCache } from 'alova';
import { useRouter } from 'vue-router';
const router = useRouter();

// const route = useRoute();
const formData = reactive({
  labelAlign: 'top',
  user: '',
  password: '',
});
const onReset = () => {
  MessagePlugin.success('重置成功');
};
const {
  loading,
  data,
  error,
  send:login,
  // 直接将Method实例传入即可发送请求
} = useRequest(() => LoginUser(Number(formData.user),formData.password), {
  // 请求响应前，data的初始值
  immediate: false
});

const onSubmit = async ({ validateResult, firstError }) => {
  let a= await login()

  if (validateResult === true) {
     sessionStorage.setItem('Bearer', a.data);
    if (a.code==200) {
      MessagePlugin.success(a.message);

      router.push('/admin');
    }else{
      MessagePlugin.warning(a.message);

    }


  } else {
    MessagePlugin.warning(firstError);
  }
};

</script>
