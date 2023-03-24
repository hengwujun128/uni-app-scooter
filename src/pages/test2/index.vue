<template>
  <div class="blueTooth">
    <!-- 导航栏有坑 -->
    <!-- <u-navbar back-text="返回" title="剑未配妥，出门已是江湖"></u-navbar> -->
    <!-- 正文内容 -->
    <u-button type="primary" class="btn" size="medium" @click="bootstrap">启动</u-button>
    <u-button type="danger" class="btn" size="medium" @click="stop">停止</u-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

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
  stopBlueTooth()
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
const stopBlueTooth = () => {
  uni.stopBluetoothDevicesDiscovery({
    success: (res) => {
      console.log({ stopBluetoothDevicesDiscovery: res })
    },
    fail: (err) => {
      console.log({ err: err })
    }
  })
}

// 开始蓝牙搜索
const startBlueTooth = () => {
  console.log('开始蓝牙搜索----')
  uni.startBluetoothDevicesDiscovery({
    // 以微信硬件平台的蓝牙智能灯为例，主服务的 UUID 是 FEE7。传入这个参数，只搜索主服务 UUID 为 FEE7 的设备
    // services: [], //['FEE7'], 要搜索的蓝牙设备主 service 的 uuid 列表,建议主要通过该参数过滤掉周边不需要处理的其他蓝牙设备。
    services: ['FEE7'],
    success: (res) => {
      console.log('开始蓝牙搜索成功')
      console.log({ startBluetoothDevicesDiscovery: res })
      // setTimeout(() => {
      //   stopBlueTooth()
      // }, 1000 * 60 * 2)
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
      startBlueTooth()
    },
    fail: (err) => {
      console.log({ err: err })
    }
  })
}

onMounted(() => {
  // 监听蓝牙适配器状态变化事件
  uni.onBluetoothAdapterStateChange((res) => {
    console.log('adapterState changed, now is', res)
  })
  // 监听寻找到新设备的事件

  uni.onBluetoothDeviceFound((devices) => {
    // @ts-ignore
    console.log('new device list has founded', devices[0].name)
    console.dir(devices)
    // console.log(ab2hex(devices[0].advertisData))
  })
})

onBeforeUnmount(() => {
  closeBlueTooth()
})
</script>

<style lang="less" scoped>
.blueTooth {
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
