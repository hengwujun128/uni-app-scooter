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
          <text class="button-text">开始搜寻,获取设备</text>
        </button>
      </view>
      <!-- 蓝牙设备 list -->
      <uni-list v-if="step === 1 && blueDeviceList">
        <uni-list-item
          v-for="item in blueDeviceList"
          :key="item.deviceId"
          title=""
          clickable
          @click="selectDevice(item)"
        >
          <template #body>
            <view :class="[item.deviceId === deviceId ? 'device__active' : '']">
              <view>
                <text>id: {{ item.deviceId }}</text>
              </view>
              <view>
                <text>name: {{ item.name }}</text>
              </view>
            </view>
          </template>
        </uni-list-item>
      </uni-list>
    </uni-section>
    <uni-section title="第三步:获取指定蓝牙设备服务" type="line" top="20">
      <view class="example-body box">
        <button class="button" type="primary" @click="getServices">
          <text class="button-text">获取蓝牙设备服务</text>
        </button>
      </view>
      <uni-list v-if="step === 2 && serviceList">
        <uni-list-item v-for="item in serviceList" :key="item.uuid" title="" clickable @click="selectService(item)">
          <template #body>
            <view :class="[item.uuid === serviceId ? 'service__active' : '']">
              <view>
                <text>uuid: {{ item.uuid }}</text>
              </view>
              <view>
                <text>isPrimary: {{ item.isPrimary }}</text>
              </view>
            </view>
          </template>
        </uni-list-item>
      </uni-list>
    </uni-section>
    <uni-section title="第四步:获取指定蓝牙设备服务的特征值" type="line" top="20">
      <view class="example-body box">
        <button class="button" type="primary" @click="getCharacteristics">
          <text class="button-text">获取特征值</text>
        </button>
      </view>
      <uni-list v-if="step === 3 && characteristics">
        <uni-list-item v-for="item in characteristics" :key="item.uuid" title="" clickable>
          <template #body>
            <view>
              <text>uuid: {{ item.uuid }}</text>
            </view>
            <view>
              <text>read: {{ item.properties.read }}</text>
            </view>
            <view>
              <text>write: {{ item.properties.write }}</text>
            </view>
            <view>
              <text>notify: {{ item.properties.write }}</text>
            </view>
            <view>
              <text>indicate: {{ item.properties.indicate }}</text>
            </view>
          </template>
        </uni-list-item>
      </uni-list>
    </uni-section>
    <uni-section title="第五步: 订阅消息并监听,通过监听接收传来的数据:" type="line" top="20">
      <view class="example-body box">
        <button type="info" plain="true" size="mini" @click="notify">订阅消息,开启消息监听</button>
      </view>
    </uni-section>
    <uni-section title="第六步:发送指令:" type="line" top="20">
      <view class="example-body box">
        <button type="primary" plain="true" size="mini" @click="sendMessage">订阅消息,开启消息监听</button>
      </view>
    </uni-section>
    <uni-section title="停止搜索:" type="line" top="20">
      <view class="example-body box">
        <button class="button button-error" type="danger" @click="stop">
          <text class="button-text button-text__error">停止搜索</text>
        </button>
      </view>
    </uni-section>

    <!-- 当前设备服务列表 -->
  </view>
</template>

<script setup lang="ts">
import { onBackPress } from '@dcloudio/uni-app'
import { ref, Ref, onMounted, onBeforeUnmount } from 'vue'

import useBlueTooth from './useBlueTooth.ts'

const { hexCharCodeToStr, ab2hex } = useBlueTooth()
interface DEVICE {
  deviceId: string
  name: string
}

interface SERVICE {
  uuid: string
  isPrimary: boolean
}

interface CHARACTERISTIC {
  uuid: string
  properties: {
    read: boolean
    write: boolean
    notify: boolean
    indicate: boolean
  }
}

const step = ref(0)

const blueDeviceList: Ref<DEVICE[]> = ref([])
const serviceList: Ref<SERVICE[]> = ref([])
const characteristics: Ref<CHARACTERISTIC[]> = ref([])

const deviceId = ref('')
const serviceId = ref('')
const characteristicId = ref('')

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
// 发送消息
const sendMessage = () => {
  // 向蓝牙设备发送一个0x00的16进制数据

  let msg = 'hello'

  const buffer = new ArrayBuffer(msg.length)
  const dataView = new DataView(buffer)
  // dataView.setUint8(0, 0)

  for (var i = 0; i < msg.length; i++) {
    // @ts-ignore
    dataView.setUint8(i, msg.charAt(i).charCodeAt())
  }
  // todo:
  uni.writeBLECharacteristicValue({
    deviceId: deviceId.value, // 设备ID，在【4】里获取到
    serviceId: serviceId.value, // 服务UUID，在【6】里能获取到
    characteristicId: characteristicId.value, // 特征值，在【7】里能获取到
    // @ts-ignore
    value: buffer,
    success(res) {
      //TODO: uni.writeBLECharacteristicValue 走 success ，证明你已经把数据向外成功发送了，但不代表设备一定就收到了。
      // 通常设备收到你发送过去的信息，会返回一条消息给你，而这个回调消息会在 uni.onBLECharacteristicValueChange 触发
      // 但这是蓝牙设备那边控制的，你作为前端佬，人家“已读不回” 也是有的,你也拿人家没办法。
      console.log(res)
    },
    fail(err) {
      console.error(err)
    }
  })
}
// 监听消息变化
const listenValueChange = () => {
  uni.onBLECharacteristicValueChange((res) => {
    // 结果
    console.log({ 有消息进入: res }) // 结果里有个value值，该值为 ArrayBuffer 类型，所以在控制台无法用肉眼观察到，必须将该值转换为16进制
    let resHex = ab2hex(res.value)
    console.log(resHex) // 最后将16进制转换为ascii码，就能看到对应的结果
    let result = hexCharCodeToStr(resHex)
    console.log(result)
  })
}

// 订阅消息并开启消息监听 - 根据设备 id,服务 id,特征值 去订阅消息
const notify = () => {
  uni.notifyBLECharacteristicValueChange({
    deviceId: deviceId.value, // 蓝牙设备 id
    serviceId: serviceId.value, // 服务UUID
    characteristicId: characteristicId.value, // 特征值
    state: true, // true: 启用 notify; false: 停用 notify
    success(res) {
      console.log({ 订阅消息成功: res }) // 接受消息的方法
      listenValueChange()
    },
    fail(err) {
      console.error(err)
    }
  })
}

// 获取指定设备,指定服务的特征值: - 根据 设备ID 和 服务ID。
const getCharacteristics = () => {
  step.value = 3
  uni.getBLEDeviceCharacteristics({
    deviceId: deviceId.value, // 设备ID，在【4】里获取到
    serviceId: serviceId.value,
    success: (res) => {
      console.log(res)
      characteristics.value = res.characteristics
    },
    fail(err) {
      console.error(err)
    }
  })
}

// 获取指定设备的蓝牙服务列表 - 根据 deviceId
const getServices = () => {
  step.value = 2
  uni.getBLEDeviceServices({
    deviceId: deviceId.value,
    success(res) {
      if (res.services) {
        // todo: 和硬件佬对接 指定服务还有特征值
        console.log({ deviceId: '当前设备 ID:' + deviceId.value, '设备服务:': res })
        serviceList.value = res.services
      }
    },
    fail(err) {
      console.error(err)
    }
  })
}

// 选择当前的蓝牙服务
const selectService = (service: SERVICE) => {
  serviceId.value = service.uuid
}

// 连接到指定的蓝牙设备 - 连接成功之后停止搜索
const selectDevice = (device: DEVICE) => {
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
  step.value = 1
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
        console.log('deviceId----name---:', devices[0].name)
        if (devices[0].name && devices[0].name.indexOf('Unknown') < 0) {
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
  .device__active,
  .service__active {
    width: 100%;
    background-color: $uni-color-success;
    color: $uni-color-success;
    // border-color: $uni-color-success;
  }
}
</style>
