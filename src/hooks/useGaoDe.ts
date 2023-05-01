import { ref, shallowRef, ShallowRef } from 'vue'
// @ts-ignore
import amap from '../utils/amap-wx.130.js'
import { promises } from 'dns'
const key = '0be5250b75cc379507cab733014b93b7'

type SomeType = {
  getWxLocation: () => {}
  getMEIdSearch: () => {}
}

export default function () {
  const instance: ShallowRef | null = shallowRef(null)
  const addressName = ref('')
  const getInstance = (): any => {
    if (!instance.value) {
      instance.value = new amap.AMapWX({ key: key })
    }
    return instance
  }

  const getLocation = (instance: ShallowRef) => {
    instance.value.getRegeo({
      success: (data: any) => {
        console.log(data)
        addressName.value = data[0].name
      },
      fail(e: any) {
        console.log(e)
      }
    })
  }

  const getWeather = (instance: ShallowRef) => {
    return new Promise((resolve, reject) => {
      instance.value.getWeather({
        success: (data: any) => {
          resolve(data)
        },
        fail(e: any) {
          reject(e)
          console.log(e)
        }
      })
    })
  }
  // onBeforeMount(() => {
  //   getInstance()
  // })
  return {
    getInstance,
    getLocation,
    getWeather
  }
}
