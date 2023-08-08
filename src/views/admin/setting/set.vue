<template>
    <div class=" bg-white rounded-lg w-[97%] mx-auto h-[80%]">
        <div class="w-1/2 m-auto">
            <t-divider class="text-xl font-bold subpixel-antialiased leading-[4em]">前台设置</t-divider>
        </div>

        <div class="border-t border-transparent	 ">
            <t-list split>
                <t-list-item v-for="item in data" :key="item.id">

                    <t-list-item-meta :title="item.desc"> <template #description>
                            <span v-if="item.type !== 'switch' && !editable">{{
                                item.value }}</span>

                            <t-input v-model="item.value" v-if="item.type !== 'switch' && editable" autoWidth autofocus
                                clearable />

                        </template>
                    </t-list-item-meta>

                    <template #action>
                        <t-switch :loading="item.loading" v-if="item.type == 'switch'" :modelValue="isSwitchOn(item.value)"
                            size="large" :label="renderContent" @change="updateSwitchValue(item)"></t-switch>
                        <t-button v-if="item.type !== 'switch' && !editable" variant="text" shape="square"
                            @click="editable = true">
                            <edit-icon />
                        </t-button>
                        <t-button v-if="item.type !== 'switch' && editable" variant="text" shape="square"
                            @click="updateValue(item)">
                            <save-icon />
                        </t-button>
                    </template>
                </t-list-item>

            </t-list>
        </div>
    </div>
</template>
<script setup lang="jsx">
import { useRequest, updateState } from "alova";
import { ref ,onActivated} from "vue";
import { getSetting, updateSetting } from "@/api/methods/setting.js";
import { CloseIcon, CheckIcon, EditIcon, SaveIcon } from 'tdesign-icons-vue-next';
import { cloneDeep } from "lodash";
const editable = ref(false)
const renderContent = (h, data) => {
    return data.value == 1 ? (<CheckIcon />) : (<CloseIcon />);
};
const { data } = useRequest(()=>getSetting(), {
    managedStates: {
        editable
    },
})
const { send } = useRequest((data) => updateSetting(data), {
    immediate: false
})
const isSwitchOn = (value) => {
    return value === '1' ? true : false;
}
const updateSwitchValue = async (event) => {
    event.loading = true
    let params = cloneDeep(event)
    if (params.value == '0') {
        params.value = '1'
    } else {
        params.value = '0'
    }
    let result = await send(params)
    if (result.code == 200) {
        
        updateState(getSetting(), (e) => {
            console.log(e)
            let tmp = e.value?e.value.filter(item => item.id == event.id):e.filter(item => item.id == event.id)
            tmp.forEach(element => {
                element.value = event.value == '0' ? '1' : '0';
            })
            return e
        })
        event.loading = false
    }
}
const updateValue = async (event) => {
    // editable.value = false
    let params = cloneDeep(event)
    let result = await send(params)
    if (result.code == 200) {
        updateState(getSetting(), {
            data: (e) => {
                console.log(e)
                let tmp = e.value?e.value.filter(item => item.id == event.id):e.filter(item => item.id == event.id)
                tmp.forEach(element => {
                    element.value = event.value
                })
                return e
            },
            editable: (e) => {
                return !e
            }
        })

    }
}
</script>
<style scoped>
.switch-demo .tdesign-demo-block {
    width: 150px;
    display: flex;
    justify-content: space-around;
}
</style>