<template>
    
    <div class=" bg-white rounded-lg">
        <div class="w-1/2 m-auto ">
            <t-divider class="text-xl font-bold subpixel-antialiased leading-[4em]">产品中心</t-divider>
        </div>
        <div  class="rounded-lg">
                <t-table :loading="productLoading" class=" bg-white" row-key="id" :data="!productLoading?datas:[]" :columns="columns" :stripe="stripe"
                    :bordered="bordered" :table-layout="tableLayout ? 'auto' : 'fixed'" size="medium"
                    :selected-row-keys="selectedRowKeys" :sort="sort" multiple-sort @sort-change="sortChange"
                    @select-change="rehandleSelectChange" :pagination="pagination" cell-empty-content="-" resizable
                    drag-sort="col" @drag-sort="onDragSort" v-model:filterValue="filterValue"
                    @filter-change="onFilterChange">
                    <template #topContent>

                        <t-space class="w-full ">
                            <div class="m-2 ">
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
                            <t-button variant="outline" :theme="row.status == 1 ? 'danger' : 'success'" ghost
                                :loading="row.loading" @click="update(row)">
                                {{ row.status === 1 ? '下架' : '上架' }}
                            </t-button>
                            <t-button variant="outline" theme="primary" ghost @click="ChangeArticle(row)">
                                编辑
                            </t-button>
                        </t-space>

                    </template>
                </t-table>
        </div>
    </div>
</template>
  
<script setup lang="jsx">
import { ref, computed, watchEffect } from 'vue';
import { useRequest, updateState } from "alova";
import { ArticleType, DeleteArticle, UpdateArticle } from "@/api/methods/article";
import { useRouter } from 'vue-router';
import { MessagePlugin, DateRangePickerPanel } from "tdesign-vue-next";
import isNumber from 'lodash/isNumber';
import _ from "lodash";
import { storageLocal } from "@pureadmin/utils"
// 使用组合式 API 定义组件

// 设置组件名称为 ComponentA
const name = 'product';
const router = useRouter();
const filterValue = ref({});

const request = (filters) => {
    const timer = setTimeout(() => {
        clearTimeout(timer);
        const rows = data.value.data.rows.filter((item) => {
            let result = true;
            if (isNumber(filters.status)) {
                result = item.status === filters.status;
            }
            if (filters.title) {
                // 创建一个正则表达式对象，用来匹配string2
                const regex = new RegExp(filters.title);
                // 使用test()方法检查string1是否匹配正则表达式
                result = regex.test(item.title);

            }
            return result;
        })
        datas.value = rows;
        pagination.value.total = rows.length
    }, 100);
};
const onFilterChange = (filters) => {
    filterValue.value = {
        ...filters,
    };
    request(filters);
};

import { CheckCircleFilledIcon, CloseCircleFilledIcon, DeleteIcon, AddIcon } from 'tdesign-icons-vue-next';
const {loading:productLoading, send, onSuccess, data } = useRequest(() => ArticleType({ typename: '产品中心' }), {
    initialData: {
        "code": 200,
        "data": {
            "nowPage": 1,
            "pageSize": 2,
            "hasMore": false,
            "total": 0,
            "rows": [
                {
                    id: '0',
                    tags: [], types: [], click: 1
                }
            ]
        },
        "message": "获取成功！"
    },
})
const { send: delId, onSuccess: delList } = useRequest((id) => DeleteArticle(id), {
    immediate: false,
})

//更新文章
const { send: updateArticle } = useRequest((data) => UpdateArticle(data), {
    immediate: false,
});

const createArticle = () => {
    router.push({ name: 'markdowm' })
}
const deleteArticle = async () => {
    try {
        if (selectedRowKeys.value.length == 0) {
            MessagePlugin.error('请先选择一行')
            return false
        }
        const parallelRequest = async () => {
            let tmp = selectedRowKeys.value.map(e => {
                return delId(e)
            })
            const result = await Promise.all(tmp);
            return result
            // 并行请求完成，继续处理业务...
        };
        let result = await parallelRequest()
        if (result.every(obj => obj.code == 200)) {
            MessagePlugin.success("删除成功");
            await updateState(ArticleType({ typename: '产品中心' }), List => {
                let result = List.data.rows && List.data.rows.filter(e => {
                    return !selectedRowKeys.value.includes(e.id)
                })
                List.data.total = List.data.total - selectedRowKeys.value.length
                List.data.rows = result
                datas.value = [...result]
                return List
            });
            pagination.value.total = pagination.value.total - selectedRowKeys.value.length
            selectedRowKeys.value = []
            // invalidateCache(ArticleType({ typename: '产品中心' }))


        } else {
            result.forEach((obj, index) => {
                if (obj.code !== 200) {
                    let title = selectedRowDatas.value[index].title
                    MessagePlugin.warning(title + '未删除成功');
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
const columns = computed(() => [
    { colKey: 'row-select', type: 'multiple', width: 50, },
    {
        colKey: 'title', title: '产品', width: '100', filter: {
            type: 'input',

            // 文本域搜索
            // component: Textarea,

            resetValue: '',
            // 按下 Enter 键时也触发确认搜索
            confirmEvents: ['onEnter'],
            props: {
                placeholder: '输入关键词过滤',
            },
            // 是否显示重置取消按钮，一般情况不需要显示
            showConfirmAndReset: true,
        }
    },
    {
        colKey: 'head_img', title: '背景图',
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
    {
        colKey: 'priority', title: '权重', sortType: 'all',
        sorter: (a, b) => a.priority - b.priority,
    },
    {
        colKey: 'tags', title: '标签',


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
    {
        colKey: 'created_at', title: '创建时间', sortType: 'all', sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at), ellipsis: false,

    },
    {
        colKey: 'status', title: '状态', align: 'center',
        sortType: 'all',
        sorter: (a, b) => a.status - b.status,
        filter: {
            type: 'single',
            list: [
                { label: '审批通过', value: 1 },
                { label: '下架', value: 2 },
            ],

        },
        cell: (h, { row }) => {
            if (row.status == 1) {
                return (
                    <t-tag
                        shape="round"
                        theme='success'
                        variant="light-outline"
                    >
                        <CheckCircleFilledIcon />
                        审核通过
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
    { colKey: 'click', title: '点击量', sortType: 'all',
        sorter: (a, b) => a.click - b.click, },
    { colKey: 'operation', title: '操作', width: 120, align: 'center', foot: '-' },
]);

const sort = ref([

]);


const sortChange = (sortVal, options) => {
    // sort.value 和 data.value 的赋值都是必须
    sort.value = sortVal;
    datas.value = options.currentDataSource;
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
    selectedRowDatas.value = selectedRowData
};
const pagination = ref({
    defaultCurrent: 1,
    defaultPageSize: 5,
    total: data.value.data.total
})
const datas = ref()
onSuccess((e) => {
    pagination.value.defaultCurrent = e.data.data.nowPage
    pagination.value.total = e.data.data.total

    datas.value = [...e.data.data.rows]

})
const loading = ref(false)
const update = async (row) => {
    row.loading = true
    let result = await updateArticle({
        id: row.id,
        title: row.title,
        content: row.content,
        desc: row.desc,
        head_img: row.imgurl,
        is_comment: row.is_comment,
        status: row.status == 1 ? 2 : 1,
        tags: row.tags.map(e => e.id),
        types: row.types.map(e => e.id),
        priority: row.priority,
    })
    if (result.code == 200) {
        row.loading = false
        updateState(send(), (e) => {
            e.data.rows.forEach(e => {
                if (e.id == row.id) {
                    e.status = e.status == 1 ? 2 : 1
                }
                return e
            })
            return e
        })
    }

}
const ChangeArticle =async (row) => {
    storageLocal().setItem('info', {
        row
    })
    await router.push({ name: 'markdowm' })


}

</script>
