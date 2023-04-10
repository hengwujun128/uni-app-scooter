<template>
  <view class="main">
    <view class="header row">
      <view class="col">
        <u-icon
          width="80"
          height="80"
          space="10"
          hover-class="hover-class"
          name="/static/images/scooter/icon-blueTooth.png"
        ></u-icon>
      </view>
      <view class="col title-wrapper">
        <view class="title">标题</view>
        <view class="title-sub">版本:V1.1</view>
      </view>
      <view class="col">
        <u-icon
          width="80"
          height="80"
          size="60"
          space="10px"
          hover-class="hover-class"
          name="/static/images/scooter/icon-setting.png"
        ></u-icon>
      </view>
    </view>
    <view class="body">
      <view class="dashBoard">
        <!-- <uni-chart ref="chartRef" :option="option" @inited="inited" /> -->
        <image src="/static/images/scooter/背景.png" class="back" mode="widthFix"></image>
        <image class="arc" src="/static/images/scooter/圆弧.png" mode="widthFix"></image>
        <image :style="pointStyle" class="point" src="/static/images/scooter/指针.png" mode="widthFix"></image>
        <!-- 电池 -->
        <view class="power">
          <!-- <image
            class="power-back power-back__first"
            src="/static/images/scooter/power/back-1.png"
            mode="widthFix"
          ></image>
          <image
            class="power-back power-back__second"
            src="/static/images/scooter/power/back-2.png"
            mode="widthFix"
          ></image> -->
          <!-- 坑爹,直接使用带背景的电池即可 -->
          <image class="power-battery" src="/static/images/scooter/power/0.png" mode="widthFix"></image>

          <!-- 这里应该使用 background -->
          <!-- <view class="battery-wrapper">
            <image class="power-battery" src="/static/images/scooter/power/0.png" mode="widthFix"></image>
          </view> -->
          <!-- <image class="power-battery" src="/static/images/scooter/power/battery.png" mode="widthFix"></image> -->
        </view>
      </view>

      <view class="actions"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted } from 'vue'
import useDashBoard, { option } from './useDashBoard.ts'

const chartRef: Ref | null = ref(null)

const { inited } = useDashBoard(chartRef)
const pointStyle = ref({})

const setDegree = () => {
  const deg = Math.floor(Math.random() * 100) + 1
  pointStyle.value = {
    transition: 'all linear 1s',
    transform: `translate(-50%, -50%) rotate(${deg}deg)`
  }
}
onMounted(() => {
  setInterval(() => {
    setDegree()
  }, 3000)
})
</script>

<style lang="scss" scoped>
.main {
  height: 100vh;
  width: 100vw;
  background-color: rgba(58, 62, 86);
  color: #fff;
  .header {
    height: 220rpx;
    padding: 84rpx 45rpx;
    padding-bottom: 50rpx;
    background-color: rgba(49, 53, 76);
    border-bottom-left-radius: 80rpx;
    border-bottom-right-radius: 80rpx;
  }
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .col {
    text-align: center;
  }
  .title-wrapper {
    flex: 1;
    .title {
      font-size: 36rpx;
      margin-bottom: 8rpx;
    }
    .title-sub {
      font-size: 24rpx;
      opacity: 0.5;
    }
  }
  .body {
    .dashBoard {
      width: 100vw;
      height: 50vh;
      margin: 0 auto;
      position: relative;
    }

    .back {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .arc {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .point {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .power {
      position: relative;
      left: 50%;
      top: 70%;
      transform: translate(-50%, -50%);
      margin: 0 auto;
    }
    .power-back {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .power-back__first {
    }
    .power-back__second {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .power-battery {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 300rpx;
      // margin-left: -103rpx;
      // margin-top: -70rpx;
    }
    //
    .battery-wrapper {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 206rpx;
      height: 96rpx;
      margin-left: -103rpx;
      margin-top: -70rpx;
      background: url(/static/images/scooter/power/battery.png) no-repeat;
      background-size: contain;
    }
  }
}
</style>
