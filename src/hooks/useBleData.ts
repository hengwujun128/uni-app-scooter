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
export const useBleData = () => {
  //数据存储
  const pageState = shallowReactive({
    weather: 0, // 天气
    altitude: 0, // 海拔
    speed: 0, // 速度
    maxspeed: 0, //最大速度
    busv: 0, // 电压
    busi: 0, //电流
    temp: 0, // 温度
    sysodo: 0, //总里程
    sysdis: 0, //单次里程
    sysmode: 0, //系统模式
    speedmode: 1, //速度模式
    syserr: 0, //故障
    sysCheck: 0, //自检
    batSoc: 0,
    // 提取11
    brandName: 0,
    mcuid: 0,
    sysbanben: 0,
    pdy: 0,
    pdm: 0,
    pdd: 0,
    validDate: 0,
    // 灯光数据
    WSDH: 0,
    WSH: 0,
    WSS: 0,
    WSV: 0,
    // 配置数据
    angleKp: 0,
    angleKi: 0,
    gyroKp: 0,
    gyroKi: 0,
    turnMax: 0,
    turnKp: 0,
    turnSpeedKp: 0,
    batErr: 0,
    batWar: 0,
    batV: [],

    // 数据回复
    lock: 1, //锁车
    assistance: 1, //助力

    light: 1, //灯光

    split1: 0,
    split2: 0,
    split3: 0
  })

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
      // console.log('提取数据包', ab2hex(databuf))
      //提取心跳包
      if (databuf[1] == 10) {
        let cnt = 3
        //填充到页面数据

        Object.assign(pageState, {
          speed: ((databuf[cnt++] << 8) | databuf[cnt++]) / 10, //12
          busv: (databuf[cnt++] << 8) | databuf[cnt++], //56
          busi: (databuf[cnt++] << 8) | databuf[cnt++], //78
          temp: databuf[cnt++], //9
          sysodo: (databuf[cnt++] << 8) | databuf[cnt++], //10 11
          sysdis: databuf[cnt++], //12
          sysmode: databuf[cnt++], //13
          speedmode: databuf[cnt++], //14
          lock: databuf[cnt++], //14
          assistance: databuf[cnt++], //14
          light: databuf[cnt++], //14
          batSoc: databuf[cnt++],

          syserr: databuf[cnt++], //15
          // 自检故障 16-17
          sysCheck: (databuf[cnt++] << 8) | databuf[cnt++]
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
      //上锁 1 解锁2 拖行3
      else if (databuf[1] == 20) {
        const cnt = 3
        // @ts-ignore
        console.log('解锁', ab2hex(databuf))
        pageState.sysmode = databuf[cnt]
      }
      //灯光
      else if (databuf[1] == 21) {
        const cnt = 3
        // @ts-ignore
        console.log('灯光', ab2hex(databuf))
        pageState.light = databuf[cnt]
      }
      // 速度模式
      else if (databuf[1] == 22) {
        const cnt = 3
        console.log('速度', databuf[cnt])
        pageState.speedmode = databuf[cnt]
      }
      // 校准命令
      else if (databuf[1] == 23) {
        const cnt = 3
        console.log('校准', databuf[cnt])
      }
      // 限速设置
      else if (databuf[1] == 24) {
        const cnt = 3
        console.log('限速', databuf[cnt])
      }

      // 解锁1 上锁2
      else if (databuf[1] == 33) {
        const cnt = 3
        console.log('解锁', databuf[cnt])
        pageState.lock = databuf[cnt]
      }
      // 拖行
      else if (databuf[1] == 34) {
        const cnt = 3
        console.log('拖行', databuf[cnt])
        pageState.assistance = databuf[cnt]
      }

      //处理完之后重置
      databuf.length = 0
      step.value = 0
    }
    return 0
  }

  // 暴露接口
  return {
    pageState,
    getBleData,
    requestParamsHandler
  }
}
