import { defineStore } from 'pinia'

interface Settings {
  brandName?: string
  version?: string
  manufactureDate?: string
  warrantyPeriod?: string
}
const useAdminSettingsStore = defineStore('adminSettings', {
  state: () => ({
    adminSettings: {
      brandName: '标题',
      version: '1.0.0'
    }
  }),
  getters: {},
  actions: {
    // don't use arrow functions here because there is no this in it
    setAdminSettings(data: Settings) {
      // this.adminSettings = data
      Object.assign(this.adminSettings, data)
    }
  }
})

export default useAdminSettingsStore
