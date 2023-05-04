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

  interface RES {
    status: number
    message?: string
  }

  const DEVICE_ID = '' // 指定设备 ID
  const SERVICE_ID = '0000FFE0-0000-1000-8000-00805F9B34FB' // 指定设备下的指定服务ID
  const CHARACTERISTIC_ID = '0000FFE1-0000-1000-8000-00805F9B34FB' //  指定设备下的指定服务下的指定特征值ID

  const DEVICE_NAME = 'Scooter-41360'

  const filterServiceUUIDs = ref([]) // 用于过滤无关的蓝牙设备,需要参考蓝牙设备厂商提供的蓝牙协议；

  const allDeviceList: Ref<DEVICE[]> = ref([]) // 所有蓝牙设备
  const targetDeviceList: Ref<DEVICE[]> = ref([]) // 指定的蓝牙设备
  const serviceList: Ref<SERVICE[]> = ref([])
  const characteristics: Ref<CHARACTERISTIC[]> = ref([])

  const deviceId = ref('')
  const serviceId = ref('')
  const characteristicId = ref('')

  const setDeviceId = (id: string) => {
    deviceId.value = id
  }

  // ArrayBuffer转16进度字符串示例
  const ab2hex = (buffer: ArrayBuffer) => {
    const hexArr = Array.prototype.map.call(new Uint8Array(buffer), function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    })
    return hexArr.join('')
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
    return new Promise((resolve) => {
      uni.onBLECharacteristicValueChange((res) => {
        // 结果
        // console.log({ 有消息进入: res }) // 结果里有个value值，该值为 ArrayBuffer 类型，所以在控制台无法用肉眼观察到，必须将该值转换为16进制
        // resolve(res)
        // 每隔 5 秒接受一次数据
        setInterval(() => {
          resolve(res)
        }, 1000 * 5)
      })
    })
  }

  // 1. 初始化蓝牙适配器
  const initAdapter = () => {
    uni.closeBluetoothAdapter({})

    return new Promise((resolve, reject) => {
      uni.openBluetoothAdapter({
        success(res) {
          console.log('初始化蓝牙适配器成功')
          console.log({ openBluetoothAdapter: res })
          resolve({ ...res, status: 200 })
        },
        fail: (err) => {
          console.log('初始化蓝牙适配器失败')
          console.log({ err: err })
          reject({ ...err, status: 0 })
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
        // services: filterServiceUUIDs.value,
        success: (res) => {
          console.log('启动蓝牙搜索成功')
          console.log({ startBluetoothDevicesDiscovery: res })
          // 监听寻找到新设备的事件
          uni.onBluetoothDeviceFound((data) => {
            const { devices = [] } = data

            // devices 只有一条数据
            console.log('deviceId----name---:', devices[0].name)
            allDeviceList.value.push(devices[0])
            resolve({ message: '启动蓝牙搜索成功', status: 200 })
            // 只连接指定设备
            // if (targetDeviceList.value.length === 0 && devices[0].name && devices[0].name === DEVICE_NAME) {
            //   targetDeviceList.value.push(devices[0])
            //   resolve({ message: '启动蓝牙搜索成功', status: 200 })
            // }
          })
        },
        fail: (err) => {
          console.log({ err: err })
          reject(err)
        }
      })
    })
  }

  // 3. 连接目标设备- 同时停止搜索
  const startCollect = (device: DEVICE): Promise<RES> => {
    return new Promise((resolve, reject) => {
      deviceId.value = device.deviceId
      console.log('----device---', device)

      uni.createBLEConnection({
        deviceId: device.deviceId,
        timeout: 2000,
        success(res) {
          console.log('连接目标设备成功')
          stopDiscovery()
          resolve({ ...res, status: 200 })
        },
        fail(err) {
          console.log('连接失败: deviceId: deviceId.value', deviceId.value)
          console.error(err)
          reject({ ...err, status: 0 })
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
  const getServicesByDeviceId = (id: string): Promise<any> => {
    deviceId.value = id
    console.log('-----查找service列表的deviceId---', deviceId.value)

    return new Promise((resolve, reject) => {
      uni.getBLEDeviceServices({
        deviceId: deviceId.value,
        success(res) {
          if (res.services) {
            serviceList.value = res.services
            const service = serviceList.value.find((item) => item.uuid === SERVICE_ID)

            console.log('-----查找service列表---', serviceList.value)
            console.log('-----查找service---', service)
            if (service) {
              serviceId.value = service.uuid
            } else {
              // serviceId.value 必须通过蓝牙调用,直接赋值不行
              reject()
            }
            resolve(serviceId.value)
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
      console.log({
        method: 'getCharacteristicsByDeviceIdAndServiceId',
        deviceId: deviceId.value,
        serviceId: serviceId.value
      })
      uni.getBLEDeviceCharacteristics({
        deviceId: deviceId.value,
        serviceId: serviceId.value, // todo: 和硬件佬对接 指定是哪条服务: '0000FFE0-0000-1000-8000-00805F9B34FB'
        success: (res) => {
          console.log(res)
          characteristics.value = res.characteristics
          const characteristic = characteristics.value.find((item) => item.uuid === CHARACTERISTIC_ID)
          if (characteristic) {
            characteristicId.value = characteristic.uuid
          }
          resolve(res.characteristics)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  }

  // 4-3 订阅消息并开启消息监听 - 根据设备 id,服务 id,特征值 去订阅消息
  const notify = (): Promise<RES> => {
    console.log({
      method: 'notify',
      deviceId: deviceId.value, // 蓝牙设备 id
      serviceId: serviceId.value, // 服务UUID
      characteristicId: characteristicId.value
    })
    return new Promise((resolve, reject) => {
      uni.notifyBLECharacteristicValueChange({
        deviceId: deviceId.value, // 蓝牙设备 id
        serviceId: serviceId.value, // 服务UUID
        characteristicId: characteristicId.value, // todo: 和硬件佬对接 指定是哪条特征值需要被监听
        state: true, // true: 启用 notify; false: 停用 notify
        success(res) {
          console.log({ 订阅消息成功: res }) // 接受消息的方法
          resolve({ ...res, message: '订阅消息成功', status: 200 })
          // listenValueChange()
        },
        fail(err) {
          reject(err)
        }
      })
    })
  }

  // 重试机制
  const retry = (api: Function, times = 0, delay = 0) => {
    return new Promise((resolve, reject) => {
      console.log('---retry---')
      const inner = async () => {
        try {
          const result = await api()
          console.log('retry:result---', result)
          return resolve(result)
        } catch (e) {
          if (times-- <= 0) {
            reject(e) //访问次数为0彻底失败
          } else {
            console.log('重试，剩余', times)
            //延迟执行
            setTimeout(() => {
              inner() //再次尝试
            }, delay)
          }
        }
      }
      return inner()
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
    retry,
    /* ----------------------------------- 方法 ----------------------------------- */
    initAdapter,
    startDiscoveryAndFound,
    startCollect,
    getServicesByDeviceId,
    getCharacteristicsByDeviceIdAndServiceId,

    notify,
    listenValueChange,
    sendMessageHandler,

    setDeviceId,
    /* ----------------------------------- 变量 ----------------------------------- */
    targetDeviceList,
    allDeviceList,
    deviceId,
    serviceId,
    characteristicId
  }
}

export default useBlueTooth
