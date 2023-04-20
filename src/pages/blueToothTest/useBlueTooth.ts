import { ref, Ref } from 'vue'

const useBlueTooth = () => {
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

  interface ErrorObject {
    errMsg?: string
  }
  const errorHandler = (e: ErrorObject) => {
    uni.showToast({
      title: e.errMsg,
      icon: 'error'
    })
  }

  const DEVICE_ID = '' // 指定设备 ID
  const SERVER_ID = '' // 指定设备下的指定服务
  const CHARACTERISTIC_ID = '' //  指定设备下的指定服务下的指定特征值

  const filterServiceUUIDs = ref([]) // 用于过滤无关的蓝牙设备,需要参考蓝牙设备厂商提供的蓝牙协议；

  const blueDeviceList: Ref<DEVICE[]> = ref([])
  const serviceList: Ref<SERVICE[]> = ref([])
  const characteristics: Ref<CHARACTERISTIC[]> = ref([])

  const deviceId = ref('')
  const serviceId = ref('')
  const characteristicId = ref('')

  // ArrayBuffer转16进度字符串示例
  const ab2hex = (buffer: ArrayBuffer) => {
    const hexArr = Array.prototype.map.call(new Uint8Array(buffer), function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    })
    return hexArr.join('')
  }

  // 将16进制的内容转成我们看得懂的字符串内容
  const hexCharCodeToStr = (hexCharCodeStr: String) => {
    const trimedStr = hexCharCodeStr.trim()
    const rawStr = trimedStr.substr(0, 2).toLowerCase() === '0x' ? trimedStr.substr(2) : trimedStr
    const len = rawStr.length
    if (len % 2 !== 0) {
      alert('存在非法字符!')
      return ''
    }
    let curCharCode
    const resultStr = []
    for (let i = 0; i < len; i = i + 2) {
      curCharCode = parseInt(rawStr.substr(i, 2), 16)
      resultStr.push(String.fromCharCode(curCharCode))
    }
    return resultStr.join('')
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
  // 监听消息变化
  const listenValueChange = () => {
    uni.onBLECharacteristicValueChange((res) => {
      // 结果
      console.log({ 有消息进入: res }) // 结果里有个value值，该值为 ArrayBuffer 类型，所以在控制台无法用肉眼观察到，必须将该值转换为16进制
      const resHex = ab2hex(res.value)
      console.log(resHex) // 最后将16进制转换为ascii码，就能看到对应的结果
      const result = hexCharCodeToStr(resHex)
      console.log(result)
    })
  }

  // 1. 初始化蓝牙适配器
  const initAdapter = () => {
    return new Promise((resolve, reject) => {
      uni.openBluetoothAdapter({
        success(res) {
          console.log('初始化蓝牙适配器成功')
          console.log({ openBluetoothAdapter: res })
          resolve(res)
        },
        fail: (err) => {
          console.log('初始化蓝牙适配器失败')
          console.log({ err: err })
          reject(err)
        }
      })
    })
  }

  // 2 启动蓝牙搜索并监听
  const startDiscoveryAndFound = () => {
    return new Promise((resolve, reject) => {
      console.log('启动蓝牙搜索----')
      uni.startBluetoothDevicesDiscovery({
        // 以微信硬件平台的蓝牙智能灯为例，主服务的 UUID 是 FEE7。传入这个参数，只搜索主服务 UUID 为 FEE7 的设备
        // 建议主要通过该参数过滤掉周边不需要处理的其他蓝牙设备
        // services: [], //['FEE7'], 要搜索的蓝牙设备主 service 的 uuid 列表,建议主要通过该参数过滤掉周边不需要处理的其他蓝牙设备。
        services: filterServiceUUIDs.value,
        success: (res) => {
          console.log('启动蓝牙搜索成功')
          console.log({ startBluetoothDevicesDiscovery: res })
          // 监听寻找到新设备的事件
          uni.onBluetoothDeviceFound((data) => {
            const { devices = [] } = data
            console.log('deviceId----name---:', devices[0].name)
            //  @ts-ignore
            // if (devices[0].advertisServiceUUIDs === startBluetoothDevicesDiscovery.value && devices[0].localName) {
            //   blueDeviceList.value.push(devices[0])
            // }

            if (devices[0].name && devices[0].name.indexOf('Unknown') < 0) {
              blueDeviceList.value.push(devices[0])
            }
          })
          resolve({ message: '启动蓝牙搜索成功' })
        },
        fail: (err) => {
          console.log({ err: err })
          reject(err)
        }
      })
    })
  }

  // 3. 连接目标设备- 同时停止搜索
  const startCollect = (device: DEVICE) => {
    return new Promise((resolve, reject) => {
      deviceId.value = device.deviceId
      uni.createBLEConnection({
        deviceId: deviceId.value,
        success(res) {
          console.log('连接目标设备成功')
          stopDiscovery()
          resolve(res)
        },
        fail(err) {
          console.log('连接失败')
          console.error(err)
          reject(err)
        }
      })
    })
  }

  /* -------------- 4. 监听 - 连接设备后就要开启监听功能(才能收到发送读写指令后,设备给你的回调信息) -------------- */
  /**
   * 4-1 获取设备服务: getServicesByDeviceId
   * 4-2 获取设备服务特征值:getCharacteristicsByDeviceIdAndServiceId
   * 4-3 开启订阅
   * 4-4 监听消息
   */

  // 4-1 获取指定设备的服务列表 - 根据 deviceId
  const getServicesByDeviceId = (deviceId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      uni.getBLEDeviceServices({
        deviceId: deviceId,
        success(res) {
          if (res.services) {
            // todo: 和硬件佬对接 指定服务还有特征值
            console.log({ deviceId: '当前设备 ID:' + deviceId, '设备服务:': res })
            serviceList.value = res.services
            resolve(res.services)
          }
        },
        fail(err) {
          reject(err)
        }
      })
    })
  }

  // 4-2 获取指定设备指定服务的特征值: - 根据 设备ID 和 服务ID。
  const getCharacteristicsByDeviceIdAndServiceId = () => {
    return new Promise((resolve, reject) => {
      uni.getBLEDeviceCharacteristics({
        deviceId: deviceId.value,
        serviceId: serviceId.value, // todo: 和硬件佬对接 指定是哪条服务: '0000FFE0-0000-1000-8000-00805F9B34FB'
        success: (res) => {
          console.log(res)
          characteristics.value = res.characteristics
          resolve(res.characteristics)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  }

  // 4-3 订阅消息并开启消息监听 - 根据设备 id,服务 id,特征值 去订阅消息
  const notify = () => {
    return new Promise((resolve, reject) => {
      uni.notifyBLECharacteristicValueChange({
        deviceId: deviceId.value, // 蓝牙设备 id
        serviceId: serviceId.value, // 服务UUID
        characteristicId: characteristicId.value, // todo: 和硬件佬对接 指定是哪条特征值需要被监听
        state: true, // true: 启用 notify; false: 停用 notify
        success(res) {
          console.log({ 订阅消息成功: res }) // 接受消息的方法
          resolve(res)
          listenValueChange()
        },
        fail(err) {
          reject(err)
        }
      })
    })
  }

  /* -------------------------------------------------------------------------- */
  /*                                    发送指令                                 */
  /* -------------------------------------------------------------------------- */

  const sendMessageHandler = (msg: string) => {
    console.log('开始发送指令', msg)
    const buffer = new ArrayBuffer(msg.length)
    const dataView = new DataView(buffer)
    // dataView.setUint8(0, 0)

    for (let i = 0; i < msg.length; i++) {
      // @ts-ignore
      dataView.setUint8(i, msg.charAt(i).charCodeAt())
    }

    return new Promise((resolve, reject) => {
      uni.writeBLECharacteristicValue({
        deviceId: deviceId.value, // 设备ID
        serviceId: serviceId.value, // 服务UUID
        characteristicId: characteristicId.value,
        // @ts-ignore
        value: buffer,
        success(res) {
          //TODO: uni.writeBLECharacteristicValue 走 success ，证明你已经把数据向外成功发送了，但不代表设备一定就收到了。
          // 通常设备收到你发送过去的信息，会返回一条消息给你，而这个回调消息会在 uni.onBLECharacteristicValueChange 触发
          // 但这是蓝牙设备那边控制的，你作为前端佬，人家“已读不回” 也是有的,你也拿人家没办法。
          console.log({ 发送指令成功: res })
          resolve(res)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  }
  return {
    ab2hex,
    hexCharCodeToStr,
    /* ----------------------------------- 方法 ----------------------------------- */
    initAdapter,
    startDiscoveryAndFound,
    startCollect,
    sendMessageHandler,
    /* ----------------------------------- 变量 ----------------------------------- */
    blueDeviceList
  }
}

export default useBlueTooth
