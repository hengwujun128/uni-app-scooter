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
        <!-- tips -->
        <u-icon
          width="80"
          height="80"
          space="10"
          class="speed-tips"
          name="/static/images/scooter/icon-speedTips.png"
        ></u-icon>
        <view class="speed-data">
          <text class="speed-value">28</text>
          <text class="speed-unit">km/h</text>
        </view>
        <view class="power">
          <image class="power-battery" :src="batteryPath" mode="widthFix"></image>
        </view>
        <view class="row baseInfo">
          <view class="col">
            <u-icon
              width="45"
              height="45"
              margin-left="12rpx"
              margin-top="12rpx"
              hover-class="btn-hover-class"
              name="/static/images/scooter/icon-weather.svg"
            ></u-icon>
            <view class="weather">
              <text>天气</text>
              <text>15°</text>
            </view>
          </view>
          <view class="col">
            <u-icon
              width="45"
              height="45"
              margin-left="12rpx"
              margin-top="12rpx"
              hover-class="btn-hover-class"
              name="/static/images/scooter/icon-controller.svg"
            ></u-icon>
            <view class="controller">
              <text>控制器</text>
              <text>15°</text>
            </view>
          </view>
        </view>
        <view class="row baseInfo">
          <view class="col">
            <u-icon
              width="45"
              height="45"
              margin-left="12rpx"
              margin-top="12rpx"
              hover-class="btn-hover-class"
              name="/static/images/scooter/icon-altitude.svg"
            ></u-icon>
            <view class="altitude">
              <text>海拔</text>
              <text>124m</text>
            </view>
          </view>
          <view class="col">
            <u-icon
              width="45"
              height="45"
              margin-left="12rpx"
              margin-top="12rpx"
              hover-class="btn-hover-class"
              name="/static/images/scooter/icon-voltage.svg"
            ></u-icon>
            <view class="voltage">
              <text>电压</text>
              <text>124°</text>
            </view>
          </view>
        </view>
      </view>
      <view class="actions">
        <view class="row row-action">
          <view class="col col-action" hover-class="background-hover-class" @click="lockHandler">
            <view class="col-action__inner">
              <u-icon
                width="45"
                height="45"
                label="锁定"
                label-size="36"
                label-color="#fff"
                margin-left="12rpx"
                margin-top="12rpx"
                hover-class="btn-hover-class"
                :name="icon('lock')"
              ></u-icon>
            </view>
          </view>
          <view class="col col-action" hover-class="background-hover-class" @click="assistanceHandler">
            <view class="col-action__inner">
              <u-icon
                width="42"
                height="44"
                space="10"
                label="助力"
                label-size="36"
                label-color="#fff"
                margin-left="12rpx"
                hover-class="btn-hover-class"
                :name="icon('assistance')"
              ></u-icon>
            </view>
          </view>
        </view>
        <view class="row row-action">
          <view class="col col-action" hover-class="background-hover-class" @click="lightHandler">
            <view class="col-action__inner">
              <u-icon
                width="50"
                height="50"
                space="10"
                label="灯光"
                label-size="36"
                label-color="#fff"
                margin-left="12rpx"
                hover-class="btn-hover-class"
                :name="icon('light')"
              ></u-icon>
            </view>
          </view>
          <view class="col col-action" hover-class="background-hover-class" @click="speedHandler">
            <view class="col-action__inner">
              <u-icon
                width="50"
                height="50"
                space="10"
                label="低速"
                label-size="36"
                label-color="#fff"
                margin-left="12rpx"
                hover-class="btn-hover-class"
                :name="icon('speed')"
              ></u-icon>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, Ref, onMounted, computed } from 'vue'
import useDashBoard, { option } from './useDashBoard.ts'

import status0 from '../../static/images/scooter/power/0.png'
import status1 from '../../static/images/scooter/power/10.png'
import status2 from '../../static/images/scooter/power/20.png'
import status3 from '../../static/images/scooter/power/30.png'
import status4 from '../../static/images/scooter/power/40.png'
import status5 from '../../static/images/scooter/power/50.png'
import status6 from '../../static/images/scooter/power/60.png'
import status7 from '../../static/images/scooter/power/70.png'
import status8 from '../../static/images/scooter/power/80.png'
import status9 from '../../static/images/scooter/power/90.png'
import status10 from '../../static/images/scooter/power/100.png'

const chartRef: Ref | null = ref(null)

const { inited } = useDashBoard(chartRef)
const pointStyle = ref({})

const batteryStatus = ref(0)

const batteryPath = computed(() => {
  const valuePathMap = new Map([
    [0, status0],
    [1, status1],
    [2, status2],
    [3, status3],
    [4, status4],
    [5, status5],
    [6, status6],
    [7, status7],
    [8, status8],
    [9, status9],
    [10, status10]
  ])
  return valuePathMap.get(batteryStatus.value)
})

// 根据 icon
const icon = (type: string) => {
  let iconPath = ''

  if (type === 'lock') {
    return `/static/images/scooter/actions/${pageState.lock ? 'icon-lock__locked' : 'icon-lock__unlocked'}.png`
  }

  if (type === 'assistance') {
    return `/static/images/scooter/actions/${
      pageState.assistance ? 'icon-assistance__high' : 'icon-assistance__low'
    }.png`
  }

  if (type === 'light') {
    return `/static/images/scooter/actions/${pageState.light ? 'icon-light__high' : 'icon-light__low'}.png`
  }

  if (type === 'speed') {
    if (pageState.speed === 1) {
      iconPath = '/static/images/scooter/actions/icon-speed__medium.png'
    } else if (pageState.speed === 2) {
      iconPath = '/static/images/scooter/actions/icon-speed__high.png'
    } else {
      iconPath = '/static/images/scooter/actions/icon-speed__low.png'
    }
    return iconPath
  }
}

const pageState = reactive({
  lock: false,
  assistance: false,
  light: false,
  speed: 0 // 0 低速 1 中速 2 高速
})

const setDegree = () => {
  const deg = Math.floor(Math.random() * 100) + 1
  batteryStatus.value = Math.floor(Math.random() * 10) + 1

  pointStyle.value = {
    transition: 'all linear 1s',
    transform: `translate(-50%, -50%) rotate(${deg}deg)`
  }
}
// 锁定
const lockHandler = () => {
  // setCmd
  pageState.lock = !pageState.lock
}
// 助力
const assistanceHandler = () => {
  // setCmd
  pageState.assistance = !pageState.assistance
}
// 灯光
const lightHandler = () => {
  // setCmd
  pageState.light = !pageState.light
}
// 低速
const speedHandler = () => {
  // setCmd 根据接口返回 确定是 speed
  if (pageState.speed === 2) {
    pageState.speed = 0
  }
  pageState.speed = pageState.speed + 1
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
    display: flex;
    align-items: center;
  }
  .title-wrapper {
    flex-direction: column;
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
    height: calc(100vh - 220rpx);
    .dashBoard {
      width: 100vw;
      height: 46vh;
      margin: 0 auto;
      position: relative;
    }

    .back {
      width: 100%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .arc {
      width: 100%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .point {
      width: 100%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .speed-tips {
      position: absolute;
      left: 50%;
      top: 15%;
      transform: translate(-50%, -50%);
    }
    .speed-data {
      position: absolute;
      left: 50%;
      top: 240rpx;
      transform: translate(-50%, -50%);
    }
    .speed-value {
      display: block;
      font-size: 200rpx;
      line-height: 200rpx;
    }
    .speed-unit {
      display: block;
      text-align: center;
      opacity: 0.5;
    }
    .power {
      position: relative;
      left: 50%;
      top: 80%;
      transform: translate(-50%, -50%);
      margin: 0 auto;
      text-align: center;
    }

    .power-battery {
      // position: absolute;
      // left: 50%;
      // top: 50%;
      // transform: translate(-50%, -50%);
      width: 300rpx;
    }
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
    .baseInfo {
      position: relative;
      text {
        display: block;
      }
    }
  }

  .actions {
    position: relative;
    padding: 0rpx 24rpx;
    height: calc(100% - 46vh);
    padding-top: 50rpx;
    background-color: rgb(49, 53, 76);
    border-top-left-radius: 80rpx;
    border-top-right-radius: 80rpx;
  }
  .row-action {
    &:nth-last-child(1) {
      margin-top: 74rpx;
    }
  }
  .col-action {
    width: 280rpx;
    height: 130rpx;
    background: linear-gradient(180deg, #5b5f77 0%, #1c1f2e 100%);
    border: 6rpx solid #0b0d16;
    border-radius: 100rpx;
    // background: url(/static/images/scooter/actions/btn__active.png) no-repeat;
    // background-size: contain;

    display: flex;
    align-items: center;
    justify-content: center;
  }
  .col-action__inner {
    width: 250rpx;
    height: 100rpx;
    background: linear-gradient(360deg, #3e4054 0%, #181c2d 100%);
    border-radius: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .background-hover-class {
    background: url(/static/images/scooter/actions/btn__default.png) no-repeat;
    background-size: contain;
  }
  .btn-hover-class {
  }
}
</style>
