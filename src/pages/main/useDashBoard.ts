import { Ref } from 'vue'
export const option = {
  series: [
    {
      type: 'gauge',
      min: 0,
      max: 100,
      // 不适合分阶段的仪表盘,axisLine.color 为数组的时候就不适合
      progress: {
        show: true,
        width: 30,
        clip: false,
        // roundCap: true,
        itemStyle: {
          // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
          borderCap: 'square'

          // color: '#7CFFB2'
          // borderColor: 'rgba(35,38,57)',
          // borderWidth: 20
        }
      },
      pointer: {
        show: false,
        showAbove: false
        // itemStyle: {
        //   color: 'rgba(255, 0, 0, 0.97)',
        //   borderColor: 'rgba(20, 234, 155, 1)'
        // }
      },
      axisLine: {
        lineStyle: {
          width: 30,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          shadowBlur: 10
          //
          // color: [
          //   [0.5, '#7CFFB2'],
          //   [0.75, '#FDDD60'],
          //   [1, '#FF6E76']
          // ]
        }
      },
      // 刻度线
      axisTick: {
        show: true,
        lineStyle: {}
      },
      // splitLine
      splitLine: {
        length: 15,
        lineStyle: {
          width: 4,
          color: '#999'
        }
      },
      axisLabel: {
        distance: 25,
        color: '#999',
        fontSize: 30
      },

      anchor: {
        show: false,
        showAbove: true,
        size: 25,
        itemStyle: {
          borderWidth: 10
        }
      },

      title: {
        show: true,
        offsetCenter: [0, '20%'],
        fontSize: 40,
        fontWeight: 'lighter',
        color: '#fff'
      },
      // todo: 可以放入其他文本
      detail: {
        valueAnimation: true,
        width: '60%',
        lineHeight: 40,
        borderRadius: 8,
        formatter: '{value}',
        fontSize: 80,
        fontWeight: 'bolder',
        // offsetCenter: [0, '70%'],
        offsetCenter: [0, '-15%'],
        color: '#fff'
      },
      data: [
        {
          value: 70,
          name: 'km/h' // 注意: title.show 属性不能为 false
        }
      ]
    }
  ]
}

export default (chartRef: Ref) => {
  const inited = (chart: unknown) => {
    chartRef.value = chart
    setInterval(() => {
      // @ts-ignore
      chart.setOption({
        series: [
          {
            data: [
              {
                value: +(Math.random() * 100).toFixed(2),
                name: 'km/h'
              }
            ]
          }
        ]
      })
      // 获取电量信息
      // uni.getBatteryInfo({
      //   success(res) {
      //     console.log(res)
      //     uni.showToast({
      //       title: '当前电量：' + res.level + '%',
      //       icon: 'none'
      //     })
      //   }
      // })
    }, 1000 * 2)
  }
  return {
    inited
  }
}
