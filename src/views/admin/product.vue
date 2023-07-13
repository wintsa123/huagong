<template>
    <DIV>
        <t-space direction="vertical" class="w-full">
            <!-- 按钮操作区域 -->
            <t-space>
                <t-checkbox v-model="stripe"> 显示斑马纹 </t-checkbox>
                <t-checkbox v-model="bordered"> 显示表格边框 </t-checkbox>
                <t-checkbox v-model="tableLayout"> 宽度自适应 </t-checkbox>
            </t-space>
            <!-- 当数据为空需要占位时，会显示 cellEmptyContent -->
            <t-table row-key="index" :data="data" :columns="columns" :stripe="stripe" :bordered="bordered"
                :table-layout="tableLayout ? 'auto' : 'fixed'" size="medium" :pagination="pagination" cell-empty-content="-"
                resizable @row-click="handleRowClick">
            </t-table>
        </t-space>
    </DIV>
</template>
  
<script setup lang="jsx">
import { ref } from 'vue';
import { CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-vue-next';

const statusNameListMap = {
    0: { label: '审批通过', theme: 'success', icon: <CheckCircleFilledIcon /> },
    1: { label: '已下架', theme: 'danger', icon: <CloseCircleFilledIcon /> },
};
const data = [];
const total = 28;


const stripe = ref(true);
const bordered = ref(true);
const tableLayout = ref(false);

const columns = ref([
    { colKey: 'title', title: '产品', width: '100' },
    {
        colKey: 'img',
        title: '背景图', 
        cell: (h, { row }) => {
            return (<DIV></DIV>
                
            );
        },
    },
    { colKey: 'priority', title: '权重' },
    { colKey: 'tags', title: '标签' },
    { colKey: 'createTime', title: '创建时间', ellipsis: true },
    {
        colKey: 'status',
        title: '状态',
        cell: (h, { row }) => {
            return (
                <t-tag shape="round" theme={statusNameListMap[row.status].theme} variant="light-outline">
                    {statusNameListMap[row.status].icon}
                    {statusNameListMap[row.status].label}
                </t-tag>
            );
        },
    },
]);

const handleRowClick = (e) => {
    console.log(e);
};

const pagination = {
    defaultCurrent: 1,
    defaultPageSize: 5,
    total,
};
</script>
  