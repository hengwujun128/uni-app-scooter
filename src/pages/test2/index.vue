<template>
  <view class="container">
    <!-- 导航栏有坑 -->
    <!-- <u-navbar back-text="返回" title="剑未配妥，出门已是江湖"></u-navbar> -->
    <uni-nav-bar
      dark
      title="导航栏组件"
      :fixed="true"
      shadow
      background-color="#007AFF"
      status-bar
      left-icon="left"
      left-text="返回"
    ></uni-nav-bar>

    <!-- 正文内容 -->
    <!-- <uni-list class="list">
      <uni-list-item class="item">
        <u-cell-item icon="" title="初始化蓝牙适配器">
          <u-button type="primary" class="btn" size="medium" @click="bootstrap">初始化蓝牙适配器</u-button>
        </u-cell-item>
      </uni-list-item>
      <uni-list-item class="item">
        <u-cell-item icon="" title="开始搜寻附近设备">
          <u-button type="primary" class="btn" size="medium" @click="startDiscovery">开始搜寻附近设备</u-button>
        </u-cell-item>
      </uni-list-item>
    </uni-list> -->
    <!-- <u-button type="primary" class="btn" size="medium" @click="bootstrap">初始化蓝牙适配器</u-button>
    <u-button type="primary" class="btn" size="medium" @click="startDiscovery">开始搜寻附近设备</u-button>
    <u-button type="primary" class="btn" size="medium" @click="getServices">获取蓝牙设备服务</u-button>
    <u-button type="primary" class="btn" size="medium" @click="getCharacteristics">获取特征值</u-button>
    <u-button type="danger" class="btn" size="medium" @click="stop">停止</u-button> -->

    <scroll-view scroll-y class="box">
      <view class="item" v-for="item in blueDeviceList" :key="item.deviceId" @click="connect(item)">
        <view>
          <text>id: {{ item.deviceId }}</text>
        </view>
        <view>
          <text>name: {{ item.name }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
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

const bootstrap = () => {
  initBlueTooth()
}
const stop = () => {
  stopDiscovery()
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
    // services: [], //['FEE7'], 要搜索的蓝牙设备主 service 的 uuid 列表,建议主要通过该参数过滤掉周边不需要处理的其他蓝牙设备。
    services: ['FEE7'],
    success: (res) => {
      console.log('开始蓝牙搜索成功')
      console.log({ startBluetoothDevicesDiscovery: res })
      // 监听寻找到新设备的事件
      uni.onBluetoothDeviceFound((devices) => {
        // @ts-ignore
        console.log('new device list has founded', devices[0].name)
        console.dir(devices)
        // @ts-ignore
        blueDeviceList.value.push(devices[0])
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

<style lang="less" scoped>
.container {
  padding: 8px;

  .header {
    display: flex;
    align-items: center;
    .btn {
      flex: 1;
    }
  }
}
</style>
