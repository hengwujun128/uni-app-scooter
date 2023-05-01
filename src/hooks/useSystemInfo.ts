// import { ref, shallowReactive } from 'vue'

export const useSystemInfo = () => {
  // const locationInfo = shallowReactive({})
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      uni.getLocation({
        type: 'wgs84',
        altitude: true,
        geocode: true, //设置该参数为true可直接获取经纬度及城市信息
        success: function (res) {
          resolve(res)
        },
        fail: function (e) {
          uni.showToast({
            title: '获取地址失败，将导致部分功能不可用',
            icon: 'none'
          })
          // eslint-disable-next-line no-debugger
          debugger
          reject(e)
        }
      })
    })
  }

  const getTemperature = () => {
    // 高德:0be5250b75cc379507cab733014b93b7
    return new Promise((resolve, reject) => {
      uni.request({
        url: 'http://wthrcdn.etouch.cn/weather_mini?city=' + '惠州',
        data: {},
        success: (res) => {
          console.log(res.data)
          // eslint-disable-next-line no-debugger
          debugger
          resolve(res.data)
          //当前温度
          // this.curWenDu = res.data.data.wendu
        },
        fail: function (e) {
          uni.showToast({
            title: '获取天气失败，将导致部分功能不可用',
            icon: 'none'
          })
          // eslint-disable-next-line no-debugger
          debugger
          reject(e)
        }
      })
    })
  }
  return {
    getLocation,
    getTemperature
  }
}
