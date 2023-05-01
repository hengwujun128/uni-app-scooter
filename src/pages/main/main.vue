<template>
  <view class="main">
    <view class="header row">
      <!-- 蓝牙状态,如果已经连接成功,就改变Bluetooth 的icon ;-->
      <view class="col">
        <navigator url="/pages/main/wave" hover-class="navigator-hover">
          <u-icon
            width="80"
            height="80"
            space="10"
            hover-class="hover-class"
            name="/static/images/scooter/btn-blueTooth.svg"
          ></u-icon>
        </navigator>
      </view>
      <view class="col title-wrapper">
        <view class="title">标题</view>
        <view class="title-sub">版本:V1.1</view>
      </view>
      <view class="col">
        <navigator url="/pages/settings/index" hover-class="navigator-hover">
          <u-icon
            width="80"
            height="80"
            size="60"
            space="10px"
            hover-class="hover-class"
            name="/static/images/scooter/btn-setting.svg"
          ></u-icon>
        </navigator>
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
          width="60rpx"
          height="28rpx"
          space="10"
          class="speed-tips"
          name="/static/images/scooter/icon-speedTips.png"
        ></u-icon>
        <view class="speed-data">
          <text class="speed-value">{{ pageState.speed }}</text>
          <text class="speed-unit">km/h</text>
        </view>
        <view class="power">
          <image class="power-battery" :src="batteryPath" mode="widthFix"></image>
        </view>
        <view class="baseInfo baseInfo__first">
          <view class="baseInfo-item">
            <u-icon
              width="45"
              height="45"
              margin-left="12rpx"
              margin-top="12rpx"
              hover-class="btn-hover-class"
              name="/static/images/scooter/icon-weather.svg"
            ></u-icon>
            <view class="label weather">
              <text>天气</text>
              <text class="value">{{ pageState.weather }} °</text>
            </view>
          </view>
          <view class="baseInfo-item">
            <u-icon
              width="45"
              height="45"
              margin-left="12rpx"
              margin-top="12rpx"
              hover-class="btn-hover-class"
              name="/static/images/scooter/icon-controller.svg"
            ></u-icon>
            <view class="label controller">
              <text>控制器</text>
              <text class="value">{{ pageState.temp }}°</text>
            </view>
          </view>
        </view>
        <view class="baseInfo baseInfo__secondary">
          <view class="baseInfo-item">
            <u-icon
              width="45"
              height="45"
              margin-left="12rpx"
              margin-top="12rpx"
              hover-class="btn-hover-class"
              name="/static/images/scooter/icon-altitude.svg"
            ></u-icon>
            <view class="label altitude">
              <text>海拔</text>
              <text class="value">{{ pageState.altitude }}m</text>
            </view>
          </view>
          <view class="baseInfo-item">
            <u-icon
              width="45"
              height="45"
              margin-left="12rpx"
              margin-top="12rpx"
              hover-class="btn-hover-class"
              name="/static/images/scooter/icon-voltage.svg"
            ></u-icon>
            <view class="label voltage">
              <text>电压</text>
              <text class="value">{{ pageState.busv }}</text>
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
                :label="pageState.light"
                label-size="36"
                label-color="#fff"
                margin-left="12rpx"
                hover-class="btn-hover-class"
                :name="icon('light')"
              ></u-icon>
            </view>
          </view>
          <view class="col col-action" hover-class="background-hover-class" @click="lockCar">
            <view class="col-action__inner">
              <u-icon
                width="50"
                height="50"
                space="10"
                :label="pageState.speedMode"
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
import { onLoad } from '@dcloudio/uni-app'

import { ref, reactive, Ref, onMounted, computed, watch } from 'vue'
import { useBlueToothStore } from '@/store'

// import useDashBoard, { option } from './useDashBoard.ts'

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

import useGaoDe from '../../hooks/useGaoDe.ts'
import useBlueTooth from '../../hooks/useBlueTooth.ts'
import { useBleData } from '../../hooks/useBleData.ts'
import { useSystemInfo } from '../../hooks/useSystemInfo.ts'

const { getInstance, getWeather } = useGaoDe()

const {
  getServicesByDeviceId,
  getCharacteristicsByDeviceIdAndServiceId,
  notify,

  deviceId,
  serviceId,
  characteristicId,

  ab2hex
} = useBlueTooth()

const { pageState, getBleData, requestParamsHandler } = useBleData(
  deviceId.value,
  serviceId.value,
  characteristicId.value
)

const { getLocation } = useSystemInfo()

// 获取自定义的store
const store = useBlueToothStore()

const batteryStatus = ref(0)
const device = computed(() => store.device)

// 根据速度设置角度
const degree = computed(() => {
  const maxSpeed = 200
  const maxDegree = 250
  const percentage = pageState.speed / maxSpeed

  // const rotateRange = [-70, 180] //
  let res = 0
  if (percentage === 0) {
    res = -70
  } else if (percentage > 1) {
    res = 180
  } else {
    res = maxDegree * percentage - 70
  }
  return res
})

const pointStyle = computed(() => {
  return {
    transition: 'all linear 1s',
    transform: `translate(-50%, -50%) rotate(${degree.value}deg)`
  }
})

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
    return `/static/images/scooter/actions/${pageState.light === 2 ? 'icon-light__high' : 'icon-light__low'}.png`
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

// const pageState = reactive({
//   lock: false,
//   assistance: false,
//   light: 0,

//   speed: 0, //
//   temp: 0,
//   busv: 0, // 电压
//   altitude: 0, //
//   weather: 0,
//   speedMode: 0
// })

// 发送消息指令

const sendCmd = (buffer: any) => {
  console.log(ab2hex(buffer))
  // console.log({
  //   deviceId: device.value.deviceId,
  //   serviceId: serviceId.value,
  //   characteristicId: characteristicId.value,
  //   buffer
  // })
  return new Promise((resolve, reject) => {
    uni.writeBLECharacteristicValue({
      deviceId: device.value.deviceId,
      serviceId: serviceId.value || '0000FFE0-0000-1000-8000-00805F9B34FB',
      characteristicId: characteristicId.value || '0000FFE1-0000-1000-8000-00805F9B34FB',
      //@ts-ignore
      value: buffer,
      success: (res) => {
        console.log('res', res)
        resolve(res)
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}
const setDegree = () => {
  // const deg = Math.floor(Math.random() * 100) + 1
  batteryStatus.value = Math.floor(Math.random() * 10) + 1
  // pointStyle.value = {
  //   transition: 'all linear 1s',
  //   transform: `translate(-50%, -50%) rotate(${184}deg)`
  // }
}
// 锁定
const lockHandler = () => {
  // setCmd
  //pageState.lock = !pageState.lock
}
// 助力
const assistanceHandler = () => {
  // setCmd
  //pageState.assistance = !pageState.assistance
}
// 灯光
const lightHandler = () => {
  // eslint-disable-next-line no-debugger
  const buf = []
  let cnt = 0

  if (pageState.light === 1) {
    console.log('开灯')
    buf[cnt++] = 2
  } else if (pageState.light === 2) {
    console.log('关灯')
    buf[cnt++] = 1
  } else {
    console.log('0')
    buf[cnt++] = 0
  }

  const buffer = new Uint8Array(requestParamsHandler(21, buf, cnt)).buffer
  sendCmd(buffer)
}
const lockCar = () => {
  // eslint-disable-next-line no-debugger
  const buf = []
  let cnt = 0

  if (pageState.speedmode == 0) {
    buf[cnt++] = 0
  } else if (pageState.speedmode == 1) {
    buf[cnt++] = 2
  } else if (pageState.speedmode == 2) {
    buf[cnt++] = 3
  } else if (pageState.speedmode == 3) {
    buf[cnt++] = 1
  }

  const buffer = new Uint8Array(requestParamsHandler(20, buf, cnt)).buffer
  sendCmd(buffer)
}
const setSpeedMode = () => {
  // eslint-disable-next-line no-debugger
  const buf = []
  let cnt = 0

  buf[cnt++] = 1
  const buffer = new Uint8Array(requestParamsHandler(20, buf, cnt)).buffer
  sendCmd(buffer)
}

// 监听消息变化
const listenValueChange = () => {
  uni.onBLECharacteristicValueChange((res) => {
    getBleData(res.value)
    // console.log('----pageState---', blueBoothData)
    // @ts-ignor
  })
}

const getDataFromBlueTooth = async (id: string) => {
  try {
    await getServicesByDeviceId(id)
    await getCharacteristicsByDeviceIdAndServiceId()
    const res = await notify()
    if (res.status === 200) {
      listenValueChange()
    }
  } catch (e) {
    console.log('错误提示', e)
    uni.showModal({
      title: '错误提示',
      content: '获取蓝牙数据失败',
      success: function (res) {
        if (res.confirm) {
          console.log('retry')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
}

// 连接蓝牙获取数据
watch(
  () => {
    return device.value.deviceId
  },
  (newValue) => {
    console.log('device---newValue', newValue)
    getDataFromBlueTooth(newValue)
  }
)
onLoad((options) => {
  console.log('options', options)
})
onMounted(() => {
  console.log('device---', device)
  getLocation().then((res: any) => {
    pageState.altitude = res.altitude
  })
  const instance = getInstance()
  getWeather(instance).then((res: any) => {
    pageState.weather = res.temperature.data
  })

  setInterval(() => {
    setDegree()
  }, 3000)
})
</script>

<style lang="scss" scoped>
$dashboard-height: 580rpx;
$dashboard-width: 580rpx;
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
    // background-color: rgb(47, 50, 73);

    .dashBoard {
      // width: 100vw;
      // height: 46vh;
      width: $dashboard-height;
      height: $dashboard-width;

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
      // top: 15%;
      top: 20%;
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
      position: absolute;
      left: 50%;
      top: 74%;
      transform: translate(-50%, -50%);
      margin: 0 auto;
      text-align: center;
    }

    .power-battery {
      // width: 206rpx;
      width: 288rpx;
    }

    .baseInfo {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: space-between;
      // width: 100%;
      padding: 20rpx 0rpx;
      left: -40rpx;
      right: -40rpx;
      &-item {
        display: flex;
        align-items: center;
        background: #34374e;
        width: 184rpx;
        height: 88rpx;
        border: 1rpx solid #383c53;
        border-radius: 50rpx;
        padding: 12rpx 20rpx;
      }
      .label {
        flex: 1;
        margin-left: 12rpx;
      }
      text {
        display: block;
        font-size: 22rpx;
      }
      .value {
        font-size: 28rpx;
      }
    }
    .baseInfo__first {
      top: 0px;
    }
    .baseInfo__secondary {
      bottom: 0px;
    }
  }

  .actions {
    position: relative;
    padding: 0rpx 24rpx;
    height: calc(100% - $dashboard-height);
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
