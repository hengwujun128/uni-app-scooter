<template>
  <view class="container">
    <!-- 导航栏有坑 -->
    <!-- <u-navbar back-text="返回" title="剑未配妥，出门已是江湖"></u-navbar> -->
    <uni-nav-bar
      dark
      title="当前设备"
      :fixed="true"
      shadow
      left-icon="gear"
      left-text=""
      right-icon="settings"
      @clickLeft="goHome"
      @clickRight="bootstrap"
    ></uni-nav-bar>

    <uni-section title="第一步: 初始化蓝牙适配器" type="line" top="20">
      <view class="example-body box">
        <button class="button" type="primary" @click="bootstrap">
          <text class="button-text">初始化</text>
        </button>
      </view>
    </uni-section>

    <uni-section title="第二步:开始搜寻附近设备, 返回设备列表" type="line" top="20">
      <view class="example-body box">
        <button class="button" type="primary" @click="startDiscovery">
          <text class="button-text">开始搜寻</text>
        </button></view
      >
    </uni-section>
    <uni-section title="第三步:获取指定蓝牙设备服务" type="line" top="20">
      <view class="example-body box">
        <button class="button" type="primary" @click="getServices">
          <text class="button-text">获取蓝牙设备服务</text>
        </button>
      </view>
    </uni-section>
    <uni-section title="第四步:获取指定蓝牙设备服务的特征值" type="line" top="20">
      <view class="example-body box">
        <button class="button" type="primary" @click="getServices">
          <text class="button-text">获取特征值</text>
        </button>
      </view>
    </uni-section>
    <uni-section title="停止搜索:" type="line" top="20">
      <view class="example-body box">
        <button class="button button-error" type="danger" @click="stop">
          <text class="button-text button-text__error">停止搜索</text>
        </button>
      </view>
    </uni-section>
    <!-- 正文内容 -->
    <uni-list v-if="blueDeviceList">
      <uni-list-item title="" clickable v-for="item in blueDeviceList" :key="item.deviceId" @click="connect(item)">
        <template #body>
          <view>
            <text>id: {{ item.deviceId }}</text>
          </view>
          <view>
            <text>name: {{ item.name }}</text>
          </view>
        </template>
      </uni-list-item>
    </uni-list>
  </view>
</template>

<script setup lang="ts">
import { onBackPress } from '@dcloudio/uni-app'
import { ref, Ref, onMounted, onBeforeUnmount } from 'vue'

interface DEVICE {
  deviceId: string
  name: string
}

const blueDeviceList: Ref<DEVICE[]> = ref([])
const deviceId = ref('')
const serviceId = ref('')

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer: Iterable<number>) {
  const hexArr = Array.prototype.map.call(new Uint8Array(buffer), function (bit) {
    return ('00' + bit.toString(16)).slice(-2)
  })
  return hexArr.join('')
}

const goHome = () => {
  console.log('go home ---')
}
const bootstrap = () => {
  initBlueTooth()
}
const stop = () => {
  stopDiscovery()
  console.log('blueDeviceList---', blueDeviceList.value)
}

// 获取指定设备,指定服务的特征值: - 根据 设备ID 和 服务ID。
const getCharacteristics = () => {
  uni.getBLEDeviceCharacteristics({
    deviceId: deviceId.value, // 设备ID，在【4】里获取到
    serviceId: serviceId.value || '0000FFE0-0000-1000-8000-00805F9B34FB', // 服务UUID，在【6】里能获取到
    success(res) {
      console.log(res)
    },
    fail(err) {
      console.error(err)
    }
  })
}

// 获取指定设备的蓝牙服务 - 根据 deviceId
const getServices = () => {
  uni.getBLEDeviceServices({
    deviceId: deviceId.value,
    success(res) {
      // todo: 和硬件佬对接 指定服务还有特征值
      console.log({ deviceId: '当前设备 ID:' + deviceId.value, '设备服务:': res })
    },
    fail(err) {
      console.error(err)
    }
  })
}

// 连接到指定的蓝牙设备 - 连接成功之后停止搜索
const connect = (device: DEVICE) => {
  deviceId.value = device.deviceId
  uni.createBLEConnection({
    deviceId: deviceId.value,
    success(res) {
      console.log('连接成功')
      console.log(res)
      // 停止搜索
      stopDiscovery()
    },
    fail(err) {
      console.log('连接失败')
      console.error(err)
    }
  })
}

// uni.getBluetoothAdapterState(OBJECT) - 获取本机蓝牙适配器状态 : 两种状态

// uni.getBluetoothDevices(OBJECT) - 获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备。

// uni.getConnectedBluetoothDevices(OBJECT) - 根据 uuid 获取处于已连接状态的设备。

const closeBlueTooth = () => {
  uni.closeBluetoothAdapter({
    success: (res) => {
      console.log('关闭蓝牙适配器成功', res)
    },
    fail: (err) => {
      console.log('关闭蓝牙适配器失败', err)
    }
  })
}

// 停止蓝牙搜索
const stopDiscovery = () => {
  uni.stopBluetoothDevicesDiscovery({
    success: (res) => {
      console.log('停止蓝牙搜索成功')
      console.log({ stopBluetoothDevicesDiscovery: res })
    },
    fail: (err) => {
      console.log('停止蓝牙搜索失败')
      console.log({ err: err })
    }
  })
}

// 开始蓝牙搜索
const startDiscovery = () => {
  console.log('开始蓝牙搜索----')
  uni.startBluetoothDevicesDiscovery({
    // 以微信硬件平台的蓝牙智能灯为例，主服务的 UUID 是 FEE7。传入这个参数，只搜索主服务 UUID 为 FEE7 的设备
    // 建议主要通过该参数过滤掉周边不需要处理的其他蓝牙设备
    // services: [], //['FEE7'], 要搜索的蓝牙设备主 service 的 uuid 列表,建议主要通过该参数过滤掉周边不需要处理的其他蓝牙设备。
    // services: ['FEE7'],
    success: (res) => {
      console.log('开始蓝牙搜索成功')
      console.log({ startBluetoothDevicesDiscovery: res })
      // 监听寻找到新设备的事件
      uni.onBluetoothDeviceFound((data) => {
        const { devices = [] } = data
        // console.log('deviceId----name---:', devices[0].name)
        if (devices[0].name.indexOf('Unknown') < 0) {
          blueDeviceList.value.push(devices[0])
        }
      })
    },
    fail: (err) => {
      console.log({ err: err })
      closeBlueTooth()
    }
  })
}

//  初始化蓝牙适配器
const initBlueTooth = () => {
  uni.openBluetoothAdapter({
    success(res) {
      console.log('初始化蓝牙适配器成功')
      console.log({ openBluetoothAdapter: res })
      // startDiscovery()
    },
    fail: (err) => {
      console.log('初始化蓝牙适配器失败')
      console.log({ err: err })
    }
  })
}

onMounted(() => {
  // 监听蓝牙适配器状态变化事件
  uni.onBluetoothAdapterStateChange((res) => {
    console.log('adapterState changed, now is', res)
  })
})

onBeforeUnmount(() => {
  closeBlueTooth()
})
</script>

<style lang="scss" scoped>
.container {
  padding: 8px;

  @mixin flex {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: row;
  }

  @mixin height {
    /* #ifndef APP-NVUE */
    height: 100%;
    /* #endif */
    /* #ifdef APP-NVUE */
    flex: 1;
    /* #endif */
  }

  .box {
    @include flex;
  }
  .button {
    @include flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    height: 35px;
    margin: 0 5px;
    border-radius: 5px;
  }
  .button-error {
    color: #fff;
    background-color: #fde2e2;
  }

  .example-body {
    background-color: #fff;
    padding: 10px 0;
  }
  .button-text {
    color: #fff;
    font-size: 12px;
    &__error {
      color: #f56c6c;
    }
  }
}
</style>
