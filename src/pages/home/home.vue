<template>
  <!-- 参考文档 -->
  <!-- https://ext.dcloud.net.cn/plugin?name=echarts-for-uniapp -->
  <view class="home-page">
    <view class="content">
      <!-- <uni-tag text="标签" type="error" :circle="true"></uni-tag> -->
      <view class="icon icon-leftTop">
        <u-icon label="天气" size="40" label-color="#ffffff" name="/static/images/天气.png"></u-icon>
      </view>
      <view class="icon icon-rightTop">
        <u-icon label="控制器" size="40" label-color="#ffffff" name="/static/images/控制器.png"></u-icon>
      </view>
      <view class="icon icon-leftBottom">
        <u-icon label="控制器" size="40" label-color="#ffffff" name="/static/images/海拔.png"></u-icon>
      </view>
      <view class="icon icon-rightBottom">
        <u-icon label="电压" size="40" label-color="#ffffff" name="/static/images/电压.png"></u-icon>
      </view>
      <uni-chart ref="chartRef" :option="option" @inited="inited" />
      <!-- <uni-chart ref="chartRef" :option="option" theme="dark" @inited="inited" /> -->
    </view>
    <view class="content content-action">
      <view class="row">
        <view class="col">
          <u-icon
            label="锁定"
            label-size="40"
            width="40"
            height="40"
            label-color="#ffffff"
            label-pos="right"
            space="10"
            hover-class="hover-class"
            name="/static/images/控制器.png"
          ></u-icon>
        </view>
        <view class="col">
          <u-icon
            label="助力"
            size="60"
            label-size="40"
            label-color="#ffffff"
            label-pos="right"
            space="10px"
            hover-class="hover-class"
          ></u-icon>
        </view>
      </view>
      <view class="row">
        <view class="col">
          <u-icon
            label="灯光"
            size="60"
            label-size="40"
            label-color="#ffffff"
            label-pos="right"
            space="10"
            hover-class="hover-class"
          ></u-icon>
        </view>
        <view class="col">
          <u-icon
            label="低速"
            size="60"
            label-size="40"
            label-color="#ffffff"
            label-pos="right"
            space="10"
            hover-class="hover-class"
          ></u-icon>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { ref, Ref } from 'vue'
const chartRef: Ref | null = ref(null)

const option = {
  series: [
    {
      type: 'gauge',
      min: 0,
      max: 100,
      // 不适合分阶段的仪表盘,axisLine.color 为数组的时候就不适合
      progress: {
        show: true,
        width: 18,
        clip: false,
        // roundCap: true,
        itemStyle: {
          // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
          // color: '#7CFFB2'
        }
      },
      pointer: {
        show: true,
        showAbove: false
        // itemStyle: {
        //   color: 'rgba(255, 0, 0, 0.97)',
        //   borderColor: 'rgba(20, 234, 155, 1)'
        // }
      },
      axisLine: {
        lineStyle: {
          width: 18
          //
          // color: [
          //   [0.5, '#7CFFB2'],
          //   [0.75, '#FDDD60'],
          //   [1, '#FF6E76']
          // ]
        }
      },
      // 刻度线
      axisTick: {
        show: true,
        lineStyle: {}
      },
      // splitLine
      splitLine: {
        length: 15,
        lineStyle: {
          width: 4,
          color: '#999'
        }
      },
      axisLabel: {
        distance: 25,
        color: '#999',
        fontSize: 30
      },

      anchor: {
        show: true,
        showAbove: true,
        size: 25,
        itemStyle: {
          borderWidth: 10
        }
      },

      title: {
        show: true,
        offsetCenter: [0, '30%'],
        fontSize: 40,
        fontWeight: 'lighter'
      },
      // todo: 可以放入其他文本
      detail: {
        valueAnimation: true,
        formatter: '{value} km/h',
        fontSize: 50,
        offsetCenter: [0, '70%']
      },
      data: [
        {
          value: 70,
          name: '速度' // 注意: title.show 属性不能为 false
        }
      ]
    }
  ]
}

const inited = (chart: unknown) => {
  chartRef.value = chart
  setInterval(() => {
    // @ts-ignore
    chart.setOption({
      series: [
        {
          data: [
            {
              value: +(Math.random() * 100).toFixed(2),
              name: '速度'
            }
          ]
        }
      ]
    })
    // 获取电量信息
    // uni.getBatteryInfo({
    //   success(res) {
    //     console.log(res)
    //     uni.showToast({
    //       title: '当前电量：' + res.level + '%',
    //       icon: 'none'
    //     })
    //   }
    // })
  }, 1000 * 2)
}
// onMounted(() => {})
</script>

<style lang="scss" scoped>
@import '@dcloudio/uni-ui/lib/uni-scss/index.scss';

.home-page {
  height: 100vh;
  width: 100vw;
  background-color: $uni-black;
}
.content {
  width: 100vw;
  height: 50vh;
  margin: 0 auto;
  position: relative;
  // background-color: $uni-black;
  color: $uni-white;
  .icon {
    position: absolute;
    z-index: 1;
    cursor: pointer;
    padding: 10rpx 30rpx;
    // border: 1rpx solid red;
  }
  .icon-leftTop {
    left: 40rpx;
    top: 60rpx;
  }
  .icon-rightTop {
    right: 40rpx;
    top: 60rpx;
  }
  .icon-leftBottom {
    left: 40rpx;
    bottom: 60rpx;
  }
  .icon-rightBottom {
    right: 40rpx;
    bottom: 60rpx;
  }
}

.content-action {
  text-align: center;
  background-color: rgba(164, 156, 156, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  .row {
    display: flex;
    align-items: center;
    height: 10vh;
  }
  .col {
    flex: 1;
    text-align: center;
  }
}
</style>
