<template>
    <div class="w-1/2 m-auto">
        <t-divider class="text-xl font-bold subpixel-antialiased">合作伙伴</t-divider>
    </div>
    <t-collapse>
        <t-collapse-panel key="1" header="友链格式化" :disabled="alldisable || !disable0">
            <template #headerRightContent>
                <t-space size="small">
                    <t-checkbox :disabled="alldisable" :checked="disable0"
                        @change="toggleDisable0(1, disable0)">启用</t-checkbox>
                </t-space>
            </template>
            <template #content>
                <wc-waterfall gap="10" cols="6" v-if="!friLoading">

                    <div class="item" v-for="item in friData.data.rows">
                        <t-card bordered theme="poster2" :cover="item.avatar || cover">
                            <template #footer>
                                <t-comment :author='item.name' :title="item.desc">
                                </t-comment>
                            </template>

                            <template #actions>
                                <t-dropdown :options="getOptions(item)" :min-column-width="80">
                                    <t-button :disabled="alldisable || !disable0" variant="text" shape="square">
                                        <more-icon />
                                    </t-button>
                                </t-dropdown>
                            </template></t-card>
                    </div>
                </wc-waterfall>

                <t-button theme="primary" @click="visibleModal = true" :disabled="alldisable || !disable0">
                    <template #icon><add-icon /></template>
                    新建
                </t-button>
                <t-dialog v-model:visible="visibleModal" mode="modal" header="新增合作伙伴"
                    :on-confirm="close">
                    <template #body>
                        <component :is="friForm" ref="formRef"></component>
                    </template>
                    <template #footer>
                        <t-button theme="default" variant="base" @click="resetForm">重置</t-button>
                        <t-button theme="default" variant="base" @click="close">取消</t-button>
                        <t-button theme="primary" @click="sendForm" :loading="loading">
                            确定
                        </t-button></template>

                </t-dialog>
                <t-dialog v-if="visibleBianji" v-model:visible="visibleBianji" mode="modal" header="编辑"
                    :on-confirm="close"><template #body>
                        <!-- <component v-if="visibleBianji" :is="friForm" ref="formRef1" :info="initialValues"></component> -->
                        <friForm v-if="visibleBianji" ref="formRef1" :info="initialValues"></friForm>
                    </template>
                    <template #footer>
                        <t-button theme="default" variant="base" @click="formRef1.restFunction()">重置</t-button>
                        <t-button theme="default" variant="base" @click="close">取消</t-button>
                        <t-button theme="primary" @click="sendForm1" :loading="loading">
                            确定
                        </t-button></template>
                </t-dialog>
            </template>
        </t-collapse-panel>
        <t-collapse-panel key="2" header="友链自定义" :disabled="alldisable || disable0">
            <template #headerRightContent>
                <t-space size="small">
                    <t-checkbox :disabled="alldisable" :checked="!disable0"
                        @change="toggleDisable0(2, disable0)">启用</t-checkbox>
                </t-space>
            </template>
            <template #content>
                <div v-if="!ArticleLoading" class="w-full">
                    <edit :data="data.data.rows[0]" :disabled="alldisable || disable0" />
                </div>
            </template>
        </t-collapse-panel>

    </t-collapse>
</template>
    
<script setup>
import 'wc-waterfall'

import edit from "@/components/mdEditor.vue";
import { useRequest, updateState } from "alova";
import { ArticleType, ArticleDetail } from "@/api/methods/article";
import { getSetting, updateSetting } from "@/api/methods/setting.js";

import { AddIcon } from 'tdesign-icons-vue-next';
import friForm from '@/components/friForm.vue'
import {
    FriendList,
    DeleteFriend
} from "@/api/methods/friend";
import { ref, onActivated, watch } from "vue";

const alldisable = ref(true)
const { send, data: setData, onSuccess: getSuccess } = useRequest(getSetting())

onActivated(e => {
    send()
})
getSuccess((e) => {
    let isflag = e.data.find(item => item.key == 'Type_link').value
    disable0.value = !!Number(isflag)
    alldisable.value = false
})
const { loading: ArticleLoading, send: getid, onSuccess, data } = useRequest(() => ArticleType({ typename: '合作伙伴' }))
const { loading: friLoading, send: getFri, data: friData } = useRequest((params) => FriendList(params))
const { send: delLink } = useRequest((id) => DeleteFriend(id), { immediate: false })
const { send: setOpen } = useRequest((data) => updateSetting(data), {
    immediate: false
})
// {keyWord:'Type_link'}
const disable0 = ref(true)

const toggleDisable0 = async (e, isflag) => {
    alldisable.value = true
    let result
    if ((e == 1 && isflag == true) || (e == 2 && isflag == true)) {
        result = await setOpen({ id: 9, value: '0' })
    } else {
        result = await setOpen({ id: 9, value: '1' })
    }
    if (result.code == 200) {
        updateState(getSetting(), (e) => {
            let tmp = e.value ? e.value.filter(item => item.id == 9) : e.filter(item => item.id == 9)
            tmp.forEach(element => {
                console.log(element.value)
                element.value = element.value == '0' ? '1' : '0';
            })
            return e
        })
        alldisable.value = false
        disable0.value = !disable0.value;


    }

}
import { MessagePlugin } from 'tdesign-vue-next';
import { MoreIcon } from 'tdesign-icons-vue-next';
const visibleModal = ref(false);

const close = () => {
    visibleBianji.value=false
    formRef.value.restFunction()
    visibleModal.value = false
};


const formRef = ref(null);

const formRef1 = ref(null);
const submiting = ref(null);
const resetForm = () => {
    formRef.value.restFunction()
};
const sendForm = async () => {
    loading.value = true
    let result = await formRef.value.onSubmit()
    if (result == 200) {
        visibleModal.value = false
        loading.value = false

    }else{
        loading.value
    }
};
const sendForm1 = async () => {
    loading.value = true

    let result = await formRef1.value.onSubmit()
    if (result == 200) {
        visibleBianji.value = false
        loading.value = false

    }else{
        loading.value = false

    }
};
const initialValues = ref({
    name: '',
    desc: '',
    email: '',
    url: '',
    status: 1,
    avatar: ''
})
const visibleBianji = ref(false)
const getOptions = (item) => {
    return [
        {
            content: '编辑',
            value: 1,
            onClick: () => {

                initialValues.value = item
                visibleBianji.value = true;
            },

        },
        {
            content: '删除',
            value: 2,
            onClick: () => delLink(item.id).then(e => {
                if (e.code == 200) {
                    MessagePlugin.success(e.message)
                    updateState(FriendList(), e => {

                        e.data.rows = e.data.rows.filter(content => content.id !== item.id)
                        return e
                    })
                }
            }),
        },
    ];
}
const loading = ref(false)


const cover = 'https://tdesign.gtimg.com/site/source/card-demo.png';
</script>
<style scoped>
/* .waterfall-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-gap: 10px;
    grid-template-rows: masonry;
} */

/* .item {
    background-color: #f0f0f0;
    padding: 10px;
} */
</style>