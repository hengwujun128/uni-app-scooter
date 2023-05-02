import { ref, Ref } from 'vue'

const useBlueTooth = () => {
  interface DEVICE {
    deviceId: string; name: string
  }

  interface SERVICE {
    uuid: string; isPrimary: boolean
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

  const blueDeviceList: Ref<DEVICE[]> = ref([])
  const serviceList: Ref<SERVICE[]> = ref([])
  const characteristics: Ref<CHARACTERISTIC[]> = ref([])

  const deviceId = ref('')
  const serviceId = ref('')
  const characteristicId = ref('')

  const setDeviceId = (id: string) => {
    deviceId.value = id
  }

  const bleDeviceId = "";
  const bleServiceId = '0000FFE0-0000-1000-8000-00805F9B34FB';
  const bleUUID = '0000FFE1-0000-1000-8000-00805F9B34FB';

  const list: any = ref([]);

  // ArrayBuffer转16进度字符串示例
  const ab2hex = (buffer: any) => {
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


  const bleInit = () => {
    openBluetoothAdapter(); //初始化蓝牙设备
  }


  // 蓝牙操作 
  /**
   * 初始化蓝牙设备
   */
  const openBluetoothAdapter = () => {
    uni.openBluetoothAdapter({
      success: e => {
        console.log('初始化蓝牙成功:' + e.errMsg);
        console.log(JSON.stringify(e));
        // 搜索蓝牙设备
        startBluetoothDevicesDiscovery();
      },
      fail: e => {
        console.log(e)
        console.log('初始化蓝牙失败，错误码：' + (e.errCode || e.errMsg));
      }
    });
  }
  /**
   * 开始搜索蓝牙设备
   */
  const startBluetoothDevicesDiscovery = () => {
    uni.startBluetoothDevicesDiscovery({
      success: e => {
        console.log('开始搜索蓝牙设备:' + e.errMsg);
        onBluetoothDeviceFound();
      },
      fail: e => {
        console.log('搜索蓝牙设备失败，错误码：' + e.errCode);
      }
    });
  }
  /**
   * 停止搜索蓝牙设备
   */
  const stopBluetoothDevicesDiscovery = () => {
    uni.stopBluetoothDevicesDiscovery({
      success: e => {
        console.log('停止搜索蓝牙设备:' + e.errMsg);
      },
      fail: e => {
        console.log('停止搜索蓝牙设备失败，错误码：' + e.errCode);
      }
    });
  }
  /**
   * 发现外围设备
   */
  const onBluetoothDeviceFound = () => {
    uni.onBluetoothDeviceFound(devices => {
      console.log('开始监听寻找到新设备的事件');
      getBluetoothDevices();
    });
  }
  /*
   * 获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备。
   */
  const getBluetoothDevices = () => {
    uni.getBluetoothDevices({
      success: res => {
        console.log('获取蓝牙设备成功:' + res.devices);
        // bleDeviceId  找到ID 
        // this.list = res.devices;
        list.value = res.devices;
        console.log('list:' + list.value);
        console.log('数量:' + list.value.length);

      },
      fail: e => {
        console.log('获取蓝牙设备错误，错误码：' + e.errCode);
      }
    });
  }
  /**
   * 获取本机蓝牙适配器状态
   */
  const getBluetoothAdapterState = () => {
    console.log('--->');
    uni.getBluetoothAdapterState({
      success: res => {
        console.log(JSON.stringify(res));
      },
      fail: e => {
        console.log('获取本机蓝牙适配器状态失败，错误码：' + e.errCode);
      }
    });
  }
  /**
   * 连接低功耗蓝牙
   */
  const createBLEConnection = () => {
    let deviceId = bleDeviceId;
    uni.showToast({
      title: '连接蓝牙...',
      icon: 'loading',
      duration: 99999
    });
    uni.createBLEConnection({
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
      deviceId,
      success: res => {
        console.log(res);
        console.log('连接蓝牙成功:' + res.errMsg);
        // 连接设备后断开搜索 并且不能搜索设备
        stopBluetoothDevicesDiscovery();
        uni.hideToast();
        uni.showToast({
          title: '连接成功',
          icon: 'success',
          duration: 2000
        });

        // 选择服务
        getBLEDeviceServices();

      },
      fail: e => {
        console.log('连接低功耗蓝牙失败，错误码：' + e.errCode);
      }
    });
  }
  /**
   * 断开与低功耗蓝牙设备的连接
   */
  const closeBLEConnection = () => {
    let deviceId = bleDeviceId;
    uni.closeBLEConnection({
      deviceId,
      success: res => {
        console.log(res);
        console.log('断开低功耗蓝牙成功:' + res.errMsg);
      },
      fail: e => {
        console.log('断开低功耗蓝牙成功，错误码：' + e.errCode);

      }
    });
  }
  /**
   * 获取所有服务
   */
  const getBLEDeviceServices = () => {
    let deviceId = bleDeviceId;
    console.log('获取所有服务的 uuid:' + deviceId);

    uni.getBLEDeviceServices({
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
      deviceId,
      success: res => {
        console.log(JSON.stringify(res.services));
        console.log('获取设备服务成功:' + res.errMsg);
      },
      fail: e => {
        console.log('获取设备服务失败，错误码：' + e.errCode);
      }
    });
  }
  /**
   * 获取某个服务下的所有特征值
   */
  const getBLEDeviceCharacteristics = () => {
    let deviceId = bleDeviceId;
    let serviceId = bleServiceId;
    console.log(deviceId, serviceId);
    uni.getBLEDeviceCharacteristics({
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
      deviceId,
      // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
      serviceId,
      success: res => {
        console.log(JSON.stringify(res));
        console.log('获取特征值成功:' + res.errMsg);
      },
      fail: e => {
        console.log('获取特征值失败，错误码：' + e.errCode);
      }
    });
  }
  /**
   * 监听低功耗蓝牙连接状态的改变事件。包括开发者主动连接或断开连接，设备丢失，连接异常断开等等
   */
  const onBLEConnectionStateChange = () => {
    uni.onBLEConnectionStateChange(res => {
      // 该方法回调中可以用于处理连接意外断开等异常情况
      console.log(`蓝牙连接状态 -------------------------->`);
      console.log(JSON.stringify(res));
      if (!res.connected) {
        console.log('断开低功耗蓝牙成功:');
      }
    });
  }
  /**
   * 读取低功耗蓝牙设备的特征值的二进制数据值。注意：必须设备的特征值支持 read 才可以成功调用
   */
  const readBLECharacteristicValue = () => {
    let deviceId = bleDeviceId;
    let serviceId = bleServiceId;
    let characteristicId = bleUUID;

    console.log(deviceId, serviceId, characteristicId);

    uni.readBLECharacteristicValue({
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
      deviceId,
      // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
      serviceId,
      // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
      characteristicId,
      success: res => {
        console.log('读取设备数据值成功');
        console.log(JSON.stringify(res));
        notifyBLECharacteristicValueChange();
      },
      fail(e) {
        console.log('读取设备数据值失败，错误码：' + e.errCode);
      }
    });
    onBLECharacteristicValueChange();
  }
  /**
   * 监听低功耗蓝牙设备的特征值变化事件。必须先启用 notifyBLECharacteristicValueChange 接口才能接收到设备推送的 notification。
   */
  const onBLECharacteristicValueChange = () => {
    // 必须在这里的回调才能获取
    uni.onBLECharacteristicValueChange(characteristic => {
      console.log('通知:' + ab2hex(characteristic.value))
    });
  }
  /**
   * 订阅操作成功后需要设备主动更新特征值的 value，才会触发 uni.onBLECharacteristicValueChange 回调。
   */
  const notifyBLECharacteristicValueChange = () => {

    let deviceId = bleDeviceId;
    let serviceId = bleServiceId;
    let characteristicId = bleUUID;

    uni.notifyBLECharacteristicValueChange({
      state: true, // 启用 notify 功能
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
      deviceId,
      // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
      serviceId,
      // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
      characteristicId,
      success(res) {
        console.log('notifyBLECharacteristicValueChange success:' + res.errMsg);
        console.log(JSON.stringify(res));
      }
    });
  }
  /**
   * 	断开蓝牙模块
   */
  const closeBluetoothAdapter = () => {
    uni.closeBluetoothAdapter({
      success: res => {
        console.log('断开蓝牙模块成功');
      }
    });
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
    sendMessageHandler,
    bleInit,
    /* ----------------------------------- 变量 ----------------------------------- */
    blueDeviceList,
    deviceId,
    serviceId,
    characteristicId,

    bleDeviceId,
    bleServiceId,
    bleUUID,
    list
  }
}

export default useBlueTooth
