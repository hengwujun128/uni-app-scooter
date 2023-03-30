<template>
  <div>
    <div class="chart-container" :style="containerStyle">
      <div v-show="dataEmptyFlag" class="chart-empty">
        <span class="empty-title">没有符合条件的内容</span>
        <span>请修改查询条件后重试</span>
      </div>
      <div ref="canvasEl" :style="containerStyle" />
      <div v-show="loading" class="chart-loading">loading...</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'

import useChart from './useEchart.js'
import type { ECOption } from './useEchart.js'

interface ChartProps {
  containerStyle?: any
  loading: boolean
  dataEmptyFlag: boolean
  options: ECOption
}

const props = withDefaults(defineProps<ChartProps>(), {
  containerStyle: {
    height: '350px',
    width: '600px'
  },
  loading: false,
  dataEmptyFlag: false
})

const { myChart, canvasEl } = useChart()

watch(
  () => props?.options,
  (cur) => {
    if (myChart) {
      console.log('myChart---', myChart)
      myChart.value.setOption(cur)
    }
  }
)
</script>
<style scoped>
.gov-line-chart-name {
  color: #000000;
  font-size: 14px;
  font-weight: 500;
  height: 22px;
  line-height: 22px;
}
.chart-container {
  position: relative;
  width: 100%;
}
.chart-loading {
  align-items: center;
  background-color: #ffffff;
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1999;
}
.chart-empty {
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  color: #888;
  font-size: 14px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.empty-title {
  font-size: 16px;
  font-weight: 500;
  color: #000;
}
</style>
