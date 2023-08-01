<template>
    <div class="w-1/2 m-auto">
        <t-divider class="text-xl font-bold subpixel-antialiased">合作伙伴</t-divider>
    </div>
    <t-collapse>
        <t-collapse-panel key="1" header="友链格式化" :disabled="!disable0">
            <template #headerRightContent>
                <t-space size="small">
                    <t-checkbox :checked="disable0" @change="toggleDisable0">启用</t-checkbox>
                </t-space>
            </template>
            <template #content>
                <div class="waterfall-container" v-if="!!friData">
                    <div class="item" v-for="item in friData.data.rows"> <t-card bordered theme="poster2"
                            :cover="item.avatar || cover">
                            <template #footer>
                                <t-comment :author='item.name' :title="item.desc">
                                </t-comment>
                            </template>

                            <template #actions>
                                <t-dropdown :options="getOptions(item)" :min-column-width="80">
                                    <t-button variant="text" shape="square">
                                        <more-icon />
                                    </t-button>
                                </t-dropdown>
                            </template></t-card></div>
                </div>

                <t-button theme="primary" @click="visibleModal = true">
                    <template #icon><add-icon /></template>
                    新建
                </t-button>
                <t-dialog v-model:visible="visibleModal" mode="modal" header="新增合作伙伴" :confirm-btn="{
                    content: '保存中...',
                    theme: 'primary',
                    loading: loading,
                }" :on-confirm="() => (visibleModal = false)"><template #body>
                        <!-- <friForm ref="formRef"></friForm> -->
                        <component :is="friForm" ref="formRef"></component>
                    </template>
                    <template #footer>
                        <t-button theme="default" variant="base" @click="resetForm">重置</t-button>
                        <t-button theme="default" variant="base" @click="close">取消</t-button>
                        <t-button theme="primary" @click="sendForm">
                            确定
                        </t-button></template>

                </t-dialog>
                <t-dialog v-if="visibleBianji" v-model:visible="visibleBianji" mode="modal" header="编辑" :confirm-btn="{
                    content: '保存中...',
                    theme: 'primary',
                    loading: loading,
                }" :on-confirm="() => (visibleBianji = false)"><template #body>
                        <!-- <component :is="friForm" ref="formRef1" :info="initialValues"></component> -->
                        <friForm v-if="visibleBianji" ref="formRef1" :info="initialValues"></friForm>
                    </template>
                    <template #footer>
                        <t-button theme="default" variant="base" @click="formRef1.onReset()">重置</t-button>
                        <t-button theme="default" variant="base" @click="visibleBianji = false">取消</t-button>
                        <t-button theme="primary" @click="sendForm1">
                            确定
                        </t-button></template>
                </t-dialog>
            </template>
        </t-collapse-panel>
        <t-collapse-panel key="2" header="友链自定义" :disabled="disable0">
            <template #headerRightContent>
                <t-space size="small">
                    <t-checkbox :checked="!disable0" @change="toggleDisable0">启用</t-checkbox>
                </t-space>
            </template>
            <template #content>
                <div v-if="typeof data == 'object'" class="w-full">
                    <edit :data="data.data.rows[0]" :disabled="disable0" />
                </div>
            </template>
        </t-collapse-panel>

    </t-collapse>
</template>
    
<script setup>
import edit from "../../components/mdEditor.vue";
import { useRequest, updateState } from "alova";
import { ArticleType, ArticleDetail } from "@/api/methods/article";
import { ref, getCurrentInstance } from "vue";
import { AddIcon } from 'tdesign-icons-vue-next';
import friForm from '@/components/friForm.vue'
import {
    FriendList,
    DeleteFriend
} from "@/api/methods/friend";
const { send: getid, onSuccess, data } = useRequest(() => ArticleType({ typename: '合作伙伴' }))
const { send: getFri, data: friData } = useRequest((params) => FriendList(params))
const { send: delLink } = useRequest((id) => DeleteFriend(id), { immediate: false })

// onSuccess(e => {
//     console.log(data)
//     getArticleInfo(e.data[0])
// })
const disable0 = ref(true)
const loading = ref(false)

const toggleDisable0 = () => {
    disable0.value = !disable0.value;
}
import { MessagePlugin } from 'tdesign-vue-next';
import { MoreIcon } from 'tdesign-icons-vue-next';
import { cloneDeep } from "lodash";
const visibleModal = ref(false);

const close = () => {
    visibleModal.value = false
};


const formRef = ref(null);

const formRef1 = ref(null);

const resetForm = () => {
    formRef.value.onReset()
};
const sendForm = async () => {
    let result = await formRef.value.onSubmit()
    if (result == 200) {
        visibleModal.value = false
    }
};
const sendForm1 = async () => {
    let result = await formRef1.value.onSubmit()
    if (result == 200) {
        visibleBianji.value = false
    }
};
const initialValues= ref({
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

                initialValues.value=item
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

const cover = 'https://tdesign.gtimg.com/site/source/card-demo.png';
</script>
<style scoped>
.waterfall-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-gap: 10px;
    grid-template-rows: masonry;
}

.item {
    background-color: #f0f0f0;
    padding: 10px;
}
</style>