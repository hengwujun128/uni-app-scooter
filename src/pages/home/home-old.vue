<template>
  <view class="home">
    <uni-nav-bar dark title="基本设置" height="120rpx">
      <template #left>
        <!-- todo: replace icon lately -->
        <view class="left"><uni-icons type="paperplane-filled" size="30" color="#fff"></uni-icons></view>
      </template>
      <template #right>
        <view class="right"><uni-icons type="gear-filled" size="30" color="#fff"></uni-icons></view>
      </template>
    </uni-nav-bar>

    <view class="body">
      <!-- <MyECharts :loading="loading" :options="options"></MyECharts> -->

      <!-- uni-app -->
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import MyECharts from '../../components/echart/MyChart.vue'

const loading = ref(false)
const dataEmptyFlag = ref(false)
const options = ref({})
const fetchData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        xData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        yData: [150, 230, 224, 218, 135, 147, 260]
      })
    }, 1000)
  })
}
// 基本不变的 echarts 属性设置
const baseOption = {
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: []
}

const loadECharts = () => {
  loading.value = true
  fetchData()
    .then((res) => {
      if (res) {
        baseOption.xAxis.data = res.xData
        baseOption.series = []
        // @ts-ignore
        baseOption.series.push({
          // @ts-ignore
          data: res.yData,
          type: 'line'
        })
      } else {
        //没有数据显示空态
        dataEmptyFlag.value = true
      }
      // 赋值操作
      options.value = { ...baseOption }
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  uni.setNavigationBarTitle({
    title: '新的标题'
  })
  // loadECharts()
})
</script>

<style lang="scss" scoped>
.home {
}
</style>
