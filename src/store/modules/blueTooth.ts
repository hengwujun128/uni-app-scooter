import { defineStore } from 'pinia'

const useBlueToothStore = defineStore('blueTooth', {
  // arrow function recommended for full type inference
  state: () => ({
    // all these properties will have their type inferred automatically
    device: {
      deviceId: ''
    },
    blueToothState: {
      id: 0,
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
    }
  }),
  getters: {
    deviceId: (state) => state.device.deviceId
  },
  actions: {
    setDevice(data: any) {
      this.device = data
    },
    setBlueToothState(data: any) {
      this.blueToothState = data
    },

    async asyncIncrease() {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      this.device = { deviceId: '0000xxx' }
    }
  }
})

export default useBlueToothStore
