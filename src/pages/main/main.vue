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
        <uni-chart ref="chartRef" :option="option" @inited="inited" />
        <view class="battery">电池</view>
        <text>hello</text>
      </view>
      <view class="actions"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import useDashBoard, { option } from './useDashBoard'

const chartRef: Ref | null = ref(null)

const { inited } = useDashBoard(chartRef)
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
    .battery {
      position: absolute;
      bottom: 10rpx;
      left: 50%;
    }
  }
}
</style>
