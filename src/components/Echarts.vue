<template>
    <div>
        <div ref="echartsContainer" style="width: 400px; height: 300px;"></div>
    </div>
</template>
  
<script>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import * as echarts from 'echarts';

export default {
    setup() {
        // 定义 echarts 实例
        let myChart;
        // 使用 onMounted 钩子初始化 echarts
        onMounted(() => {
            myChart = echarts.init(echartsContainer.value);
            // 在这里可以进行 echarts 的配置和数据设置
            myChart.setOption({
                // echarts 配置项
                title: {
                    text: 'ECharts 入门示例'
                },
                tooltip: {},
                xAxis: {
                    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
                },
                yAxis: {},
                series: [
                    {
                        name: '销量',
                        type: 'bar',
                        data: [5, 20, 36, 10, 10, 20]
                    }
                ]
            });
        });

        // 使用 onBeforeUnmount 钩子释放 echarts 资源
        onBeforeUnmount(() => {
            myChart.dispose();
        });

        const echartsContainer = ref(null);
        return { echartsContainer };

    },
};
</script>
  