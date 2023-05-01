import { defineStore } from 'pinia'

const useBlueToothStore = defineStore('blueTooth', {
  // arrow function recommended for full type inference
  state: () => ({
    // all these properties will have their type inferred automatically
    device: {
      deviceId: ''
    }
  }),
  getters: {
    deviceId: (state) => state.device.deviceId
  },
  actions: {
    setDevice(data: any) {
      this.device = data
    },
    async asyncIncrease() {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      this.device = { deviceId: '0000xxx' }
    }
  }
})

export default useBlueToothStore
