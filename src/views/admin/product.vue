<template>
    <div>
        <div class="w-1/2 m-auto">
            <t-divider class="text-xl font-bold subpixel-antialiased">产品中心</t-divider>
        </div>
        <!-- <t-space direction="vertical" class="w-full mt-2"> -->
        <!-- 按钮操作区域 -->

        <!-- <t-space class="w-full ">
                <div class="m-2"><t-checkbox v-model="stripe"> 显示斑马纹 </t-checkbox>
                    <t-checkbox v-model="bordered"> 显示表格边框 </t-checkbox>
                    <t-checkbox v-model="tableLayout"> 宽度自适应 </t-checkbox>
                </div>
                <div class="grow flex justify-end mr-3"> <t-button theme="primary" :onclick="deleteArticle" class="mr-3">
                        <template #icon>
                            <DeleteIcon />
                        </template>
                        删除
                    </t-button><t-button theme="primary" :onclick="createArticle">
                        <template #icon><add-icon /></template>
                        新建
                    </t-button></div>

            </t-space> -->

        <!-- 当数据为空需要占位时，会显示 cellEmptyContent -->
        <div v-if="typeof data == 'object'">
            <t-table row-key="id" :data="data.data.rows" :columns="columns" :stripe="stripe" :bordered="bordered"
                :table-layout="tableLayout ? 'auto' : 'fixed'" size="medium" :selected-row-keys="selectedRowKeys"
                select-on-row-click @select-change="rehandleSelectChange" :pagination="pagination" cell-empty-content="-"
                resizable @row-click="handleRowClick" drag-sort="col" @drag-sort="onDragSort">
                <template #topContent>

                    <t-space class="w-full bg-transparent">
                        <div class="m-2 bg-transparent">
                            <t-checkbox v-model="stripe"> 显示斑马纹 </t-checkbox>
                            <t-checkbox v-model="bordered"> 显示表格边框 </t-checkbox>
                            <t-checkbox v-model="tableLayout"> 宽度自适应 </t-checkbox>
                            <t-checkbox v-model="showPhoto"> 显示图片</t-checkbox>

                        </div>
                        <div class="grow flex justify-end mr-3"> <t-button theme="primary" :onclick="deleteArticle"
                                class="mr-3">
                                <template #icon>
                                    <DeleteIcon />
                                </template>
                                删除
                            </t-button><t-button theme="primary" :onclick="createArticle">
                                <template #icon><add-icon /></template>
                                新建
                            </t-button></div>

                    </t-space>
                </template>
                <template #empty>
                    <span
                        style="display: flex; align-items: center; justify-content: center; height: 100px; color: rgba(0, 0, 0, 0.26)">
                        😊 暂无数据
                    </span>
                </template>
                <template #operation="{ row }">
                    <t-space direction="vertical">

                        <t-link theme="primary" hover="color" @click="rehandleClickOp(row)">
                            {{ row.status === 1 ? '下架' : '审核通过' }}
                        </t-link>
                        <t-link theme="primary" hover="color" @click="rehandleClickOp(row)">
                            {{ row.status === 2 ? '查看详情' : '再次申请' }}
                        </t-link>
                    </t-space>

                </template>
            </t-table>
        </div>

        <!-- </t-space> -->
    </div>
</template>
  
<script setup lang="jsx">
import { ref } from 'vue';
import { useRequest, updateState } from "alova";
import { ArticleType, ArticleDetail, DeleteArticle } from "@/api/methods/article";
import { useRouter } from 'vue-router';
import { MessagePlugin } from "tdesign-vue-next";
const router = useRouter();
import { CheckCircleFilledIcon, CloseCircleFilledIcon, DeleteIcon, AddIcon } from 'tdesign-icons-vue-next';
const { send, onSuccess, data } = useRequest(() => ArticleType({ typename: '产品中心' }), {
    initialData: {
        "code": 200,
        "data": {
            "nowPage": 1,
            "pageSize": 2,
            "hasMore": false,
            "total": 0,
            "rows": [
                {
                    tags: [], types: []
                }
            ]
        },
        "message": "获取成功！"
    }
})
const { send: delId, onSuccess: delList } = useRequest((id) => DeleteArticle(id), {
    immediate: false,
})


const createArticle = () => {
    router.push({ name: 'markdowm编辑', query: { username: 'eduardo' } })
}
const deleteArticle = async () => {
    try {
        const parallelRequest = async () => {
            let tmp = selectedRowKeys.value.map(e => {
                return delId(e)
            })
            const result= await Promise.all(tmp);
            return result
            // 并行请求完成，继续处理业务...
        };
        let result = await parallelRequest()
        // console.log(result)
        if (result.every(obj => obj.code == 200)) {
            MessagePlugin.success("删除成功");
            // pagination.value.total--
            await updateState(ArticleType({ typename: '产品中心' }), List => {
                let result = List.data.rows && List.data.rows.filter(e => {
                    return !selectedRowKeys.value.includes(e.id)
                })
                List.data.total = List.data.total - selectedRowKeys.value.length
                List.data.rows = result
                return List
            });
            pagination.value.total = pagination.value.total - selectedRowKeys.value.length
            selectedRowKeys.value = []


        } else {
            result.forEach((obj,index) => {
                if (obj.code !== 200) {
                    let title=selectedRowDatas.value[index].title
                    MessagePlugin.warning(title+'未删除成功');
                }
            });
        }

    } catch (error) {
        throw error
    }

}
const stripe = ref(true);
const bordered = ref(true);
const tableLayout = ref(false);
const showPhoto = ref(true);

const columns = ref([
    {
        colKey: 'row-select',
        type: 'multiple',
        // 禁用行选中方式一：使用 disabled 禁用行（示例代码有效，勿删）。disabled 参数：{row: RowData; rowIndex: number })
        // 这种方式禁用行选中，当前行会添加行类名 t-table__row--disabled，禁用行文字变灰
        // disabled: ({ rowIndex }) => rowIndex === 1 || rowIndex === 3,

        // 禁用行选中方式二：使用 checkProps 禁用行（示例代码有效，勿删）
        // 这种方式禁用行选中，行文本不会变灰
        // checkProps: ({ rowIndex }) => ({ disabled: rowIndex % 2 !== 0 }),
        width: 50,
    },
    { colKey: 'title', title: '产品', width: '100' },
    {
        colKey: 'head_img',
        title: '背景图',
        cell: (h, { row }) => {
            if (row.head_img) {
                if (showPhoto.value) {
                    return (
                        <div class='w-15'>
                            <t-image
                                src={row.head_img}
                                fit="fill"
                            />
                        </div>
                    )
                } else {
                    return (<div></div>)
                }

            }
        },
    },
    { colKey: 'priority', title: '权重' },
    {
        colKey: 'tags',
        title: '标签',
        cell: (h, { row }) => {
            return (
                <div class='flex flex-wrap	'>
                    {row.tags.map((item, index) => (
                        <t-tag
                            class='m-1'
                            key={index}
                            theme={['danger', 'primary', 'success', 'warning'][item.id % 4]}
                            variant="outline"
                        >
                            {item.name}
                        </t-tag>
                    ))}
                </div>
            );
        },
    },
    { colKey: 'created_at', title: '创建时间', ellipsis: true },
    {
        colKey: 'status',
        title: '状态',
        align: 'center',

        cell: (h, { row }) => {
            if (row.status == 1) {
                return (
                    <t-tag
                        shape="round"
                        theme='success'
                        variant="light-outline"
                    >
                        <CheckCircleFilledIcon />
                        审批通过
                    </t-tag>
                );
            } else {
                return (
                    <t-tag
                        shape="round"
                        theme='danger'
                        variant="light-outline"
                    >
                        <CloseCircleFilledIcon />
                        下架

                    </t-tag>
                );
            }
        },
    },
    { colKey: 'operation', title: '操作', width: 120, align: 'center', foot: '-' },


]);

const handleRowClick = (e) => {
    console.log(e);
};
const selectedRowKeys = ref([]);
const selectedRowDatas = ref([]);

// currentData is going to be deprecated
const onDragSort = ({ currentIndex, targetIndex, current, target, data, newData, e, sort }) => {
    if (sort === 'col') {
        columns.value = newData;
    }
};
const rehandleSelectChange = (value, { selectedRowData }) => {
    selectedRowKeys.value = value;
    selectedRowDatas.value=selectedRowData
};
const pagination = ref({
    defaultCurrent: 1,
    defaultPageSize: 5,
    total: data.value.data.total
})
onSuccess((e) => {
    pagination.value.defaultCurrent = e.data.data.nowPage
    pagination.value.total = e.data.data.total

})
</script>
<style>
.t-table__top-content {
    background-color: antiquewhite;

}
</style>