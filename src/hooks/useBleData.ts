import { ref, shallowReactive } from 'vue'

//ADD8求和校验
function Add8(buffer: number[], cnt: number) {
  let buf = 0
  for (let index = 0; index < cnt; index++) {
    buf = buf + buffer[index]
  }
  buf = buf & 0xff
  return buf
}
// ArrayBuffer转16进度字符串
function ab2hex(buffer: ArrayBuffer) {
  const hexArr = Array.prototype.map.call(new Uint8Array(buffer), function (bit) {
    return ('00' + bit.toString(16)).slice(-2)
  })
  return hexArr.join('')
}

// 解析和发送蓝牙数据
export const useBleData = (deviceId: string, serviceId: string, characteristicId: string) => {
  //数据存储
  const pageState = shallowReactive({
    speed: null,
    maxspeed: null,
    busv: null, // 电压
    busi: null,
    temp: null, // 温度
    sysodo: null,
    sysdis: null,
    sysmode: null,
    speedmode: null,
    syserr: null,
    turn: null,
    angle: null,
    gyro: null,
    // 提取11
    brandName: null,
    mcuid: null,
    sysbanben: null,
    pdy: null,
    pdm: null,
    pdd: null,
    validDate: null,
    // 灯光数据
    WSDH: null,
    WSH: null,
    WSS: null,
    WSV: null,
    // 配置数据
    angleKp: null,
    angleKi: null,
    gyroKp: null,
    gyroKi: null,
    turnMax: null,
    turnKp: null,
    turnSpeedKp: null,
    batErr: null,
    batWar: null,
    batV: [],

    split1: null,
    split2: null,
    split3: null,
    ibuslit: null,
    iphalit: null,
    runangle: null,
    tuoxinangle: null
  })

  //   //发送蓝牙数据
  // const bleSendData=(buffer:Buffer)=> {
  //   uni.writeBLECharacteristicValue({
  //       deviceId: BledeviceId, // 蓝牙设备 id
  //       serviceId: BleserviceId, // 蓝牙服务的 uuid
  //       characteristicId: BlecharacteristicId, // 蓝牙特征值的 uuid
  //       value: buffer, // 蓝牙设备特征值对应的二进制值
  //       // writeType: '' // 蓝牙特征值的写模式设置，有两种模式，iOS 优先 write，安卓优先 writeNoResponse 。微信小程序支持
  //   })
  // }

  //构建发送帧
  const requestParamsHandler = (cmd: number, data: any[], cnt: number) => {
    const databuf = []
    let len = 0
    databuf[len++] = 0x5a
    databuf[len++] = cmd //功能码
    databuf[len++] = cnt //数据长度
    //填充数据
    for (let index = 0; index < cnt; index++) {
      databuf[len++] = data[index]
    }
    //计算校验
    databuf[len++] = Add8(databuf, databuf.length)
    return databuf
  }

  // 发送指令
  const sendCmd = (cmd: number, data: any[], len: number) => {
    const buffer = new Uint8Array(requestParamsHandler(cmd, data, len)).buffer

    uni.writeBLECharacteristicValue({
      deviceId: deviceId,
      serviceId: serviceId,
      characteristicId: characteristicId,
      //@ts-ignore
      value: buffer
    })

    console.log('发送', ab2hex(buffer))
  }

  const setLED = () => {
    console.log('开灯')

    const buf = []
    let cnt = 0
    buf[cnt++] = 2
    sendCmd(21, buf, cnt)
  }

  const offLED = () => {
    console.log('关灯')

    const buf = []
    let cnt = 0
    buf[cnt++] = 1
    sendCmd(21, buf, cnt)
  }

  //解析 提取数据
  const step = ref(0)
  const databuf: number[] = []

  const IotUartReceive = (dataArr: any[]) => {
    for (let i = 0; i < dataArr.length; i++) {
      const data = dataArr[i]
      //提取帧头H
      if (step.value == 0) {
        if (data == 0x5a) {
          databuf[step.value] = data
          step.value++
        }
      }
      //功能码
      else if (step.value == 1) {
        databuf[step.value] = data
        step.value++
      }
      //长度
      else if (step.value == 2) {
        if (data < 120) {
          databuf[step.value] = data
          step.value++
        } else {
          step.value = 0
        }
      }
      //储存数据 数据个数 + 帧头 + 功能 + 数据长度
      else if (step.value < databuf[2] + 3 && step.value < 120) {
        databuf[step.value] = data
        step.value++
      }
      //校验数据
      else {
        if (data == Add8(databuf, step.value)) {
          return 1
        } else {
          step.value = 0
          console.log('校验错误', data, Add8(databuf, step.value))
        }
      }
    }
    return 0
  }

  const getBleData = (arrayBuffer: any) => {
    const dataArr = Array.prototype.slice.call(new Uint8Array(arrayBuffer))
    if (IotUartReceive(dataArr)) {
      //@ts-ignore
      console.log('提取数据包', ab2hex(databuf))
      //提取心跳包
      if (databuf[1] == 10) {
        let cnt = 3
        //填充到页面数据

        Object.assign(pageState, {
          speed: (databuf[cnt++] << 8) | databuf[cnt++],
          maxspeed: (databuf[cnt++] << 8) | databuf[cnt++],
          busv: (databuf[cnt++] << 8) | databuf[cnt++],
          busi: (databuf[cnt++] << 8) | databuf[cnt++],
          temp: databuf[cnt++],
          sysodo: (databuf[cnt++] << 8) | databuf[cnt++],
          sysdis: databuf[cnt++],
          sysmode: databuf[cnt++],
          speedmode: databuf[cnt++],
          syserr: (databuf[cnt++] << 8) | databuf[cnt++],
          turn: databuf[cnt++],
          angle: databuf[cnt++] - 128,
          gyro: databuf[cnt++] - 128
        })
      }
      //提取11
      else if (databuf[1] == 11) {
        let cnt = 3
        //填充到页面数据
        Object.assign(pageState, {
          brandName: databuf[cnt++],
          mcuid: (databuf[cnt++] << 8) | databuf[cnt++],
          sysbanben: (databuf[cnt++] << 8) | databuf[cnt++],
          pdy: (databuf[cnt++] << 8) | databuf[cnt++],
          pdm: databuf[cnt++],
          pdd: databuf[cnt++],
          validDate: databuf[cnt++]
        })
      }
      //灯光效果
      else if (databuf[1] == 28) {
        let cnt = 3
        Object.assign(pageState, {
          WSDH: databuf[cnt++],
          WSH: (databuf[cnt++] << 8) | databuf[cnt++],
          WSS: databuf[cnt++],
          WSV: databuf[cnt++]
        })
      }
      //提取配置包
      else if (databuf[1] == 0x30) {
        let cnt = 3
        Object.assign(pageState, {
          angleKp: (databuf[cnt++] << 8) | databuf[cnt++],
          angleKi: (databuf[cnt++] << 8) | databuf[cnt++],
          gyroKp: (databuf[cnt++] << 8) | databuf[cnt++],
          gyroKi: (databuf[cnt++] << 8) | databuf[cnt++],
          turnMax: (databuf[cnt++] << 8) | databuf[cnt++],
          turnKp: (databuf[cnt++] << 8) | databuf[cnt++],
          turnSpeedKp: (databuf[cnt++] << 8) | databuf[cnt++],
          batErr: (databuf[cnt++] << 8) | databuf[cnt++],
          batWar: (databuf[cnt++] << 8) | databuf[cnt++],
          batV: [
            0,
            (databuf[cnt++] << 8) | databuf[cnt++],
            (databuf[cnt++] << 8) | databuf[cnt++],
            (databuf[cnt++] << 8) | databuf[cnt++],
            (databuf[cnt++] << 8) | databuf[cnt++],
            (databuf[cnt++] << 8) | databuf[cnt++]
          ],

          split1: databuf[cnt++],
          split2: databuf[cnt++],
          split3: databuf[cnt++],
          ibuslit: (databuf[cnt++] << 8) | databuf[cnt++],
          iphalit: (databuf[cnt++] << 8) | databuf[cnt++],
          runangle: databuf[cnt++] - 128,
          tuoxinangle: databuf[cnt++] - 128
        })
      }
      //处理完之后重置
      databuf.length = 0
      step.value = 0
    }
    return 0
  }

  return {
    blueBoothData: pageState,
    getBleData,
    setLED,
    offLED
  }
}
