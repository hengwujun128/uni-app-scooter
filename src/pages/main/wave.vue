<template>
  <view v-if="searchStatus" class="wave">
    <view class="header">
      <view class="title">正在搜索...</view>
      <view class="title-sub">请尽可能将手机贴近平衡车</view>
    </view>

    <view class="circle-wrapper">
      <view class="circle circle-outer"></view>
      <view class="circle circle-inner"></view>

      <view class="mobile">
        <!-- todo: use svg to replace lately -->
        <image style="width: 23rpx; height: 43rpx" src="/static/images/scooter/icon-blueTooth__search.png"></image>
      </view>
    </view>

    <uni-popup ref="popupRef" type="bottom" :mask-click="false" round>
      <view class="wrapper">
        <view class="title">{{ deviceName || '设备名称' }}</view>
        <view class="desc">是否连接该平衡车？</view>
        <view class="action">
          <button type="default" class="mini-btn" size="mini" @click="close">取消</button>
          <view class="divide"></view>
          <button type="default" class="mini-btn" size="mini" @click="confirm">连接</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, Ref, computed, onMounted } from 'vue'
import useBlueTooth from '../..//hooks/useBlueTooth.ts'
const { initAdapter, startDiscoveryAndFound, startCollect, blueDeviceList } = useBlueTooth()

const popupRef: Ref<any | Ref> = ref(null)

const searchStatus = ref(0) // 0 |1 start | 2 end

const animationName = computed(() => {
  return blueDeviceList.value.length <= 0 ? 'wave' : ''
})

const deviceName = computed(() => {
  return blueDeviceList.value[0]?.name
})

// 取消,则继续搜索
const close = () => {
  blueDeviceList.value = []
  popupRef.value.close()
}

// 蓝牙连接成功之后要跳转到首页
const confirm = () => {
  startCollect(blueDeviceList.value[0]).then((res) => {
    if (res.status === 200) {
      uni.showToast({
        title: '连接设备成功',
        icon: 'success'
      })
    }
  })
  popupRef.value.close()
}

const init = async () => {
  try {
    const initResult: any = await initAdapter()
    searchStatus.value = 1
    const discoverResult: any = initResult.status === 200 && (await startDiscoveryAndFound())
    if (discoverResult.status === 200 && blueDeviceList.value.length) {
      popupRef.value?.open()
    }
  } catch (e) {
    // @ts-ignore
    const errMsg = e.errMsg
    uni.showModal({
      title: '提示',
      content: errMsg,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          uni.navigateBack({ delta: 1 })
        } else if (res.cancel) {
          console.log('用户点击取消')
          uni.navigateBack({ delta: 1 })
        }
      }
    })
  }
}

onMounted(() => {
  init()
})
</script>

<style lang="scss">
.wave {
  background-color: rgba(49, 53, 76);

  width: 100vw;
  // height: calc(100vh - 46px);
  height: calc(100vh - 0px);
  overflow: hidden;
  margin: 0 auto;
  position: relative;
  .header {
    color: #ffffff;
    margin: 0 auto;
    padding-top: 100rpx;
  }
  .title {
    font-size: 36rpx;
    text-align: center;
  }
  .title-sub {
    text-align: center;
    font-size: 28rpx;
    margin-top: 8rpx;
  }
  .circle-wrapper {
    position: relative;
    position: relative;
    width: 100vw;
    margin-top: 420rpx;
  }

  .circle {
    border-radius: 50%;
    border: 1px solid #ffffff;
  }
  .circle-outer {
    position: relative;
    width: 750rpx;
    height: 750rpx;
    opacity: 0;
    top: 30%;
    left: 50%;
    margin-left: -375rpx;
    margin-top: -375rpx;
    animation-name: v-bind(animationName);
    animation-delay: 1s;
    animation-duration: 2s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
  .circle-inner {
    left: 50%;
    top: 50%;
    margin-left: -255rpx;
    margin-top: -255rpx;
    width: 510rpx;
    height: 510rpx;
    position: absolute;
    // border: 1px solid #ffffff;

    animation-name: v-bind(animationName);
    animation-delay: 0s;
    animation-duration: 2s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
  .mobile {
    position: absolute;
    width: 88rpx;
    height: 160rpx;
    left: 50%;
    top: 50%;
    margin-left: -44rpx;
    margin-top: -80rpx;
    border: 4rpx solid #ffffff;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .wrapper {
    position: absolute;
    width: 680rpx;
    height: 320rpx;
    left: 50%;
    bottom: 108rpx;
    margin-left: -340rpx;
    background: #34374d;
    color: #ffffff;
    border-radius: 40rpx;
    text-align: center;
    .title {
      height: 72rpx;
      line-height: 72rpx;
      font-size: 36rpx;
      margin-top: 32rpx;
    }
    .desc {
      font-size: 28rpx;
      margin-bottom: 60rpx;
    }
    .action {
      display: flex;
      align-items: center;
      .divide {
        width: 1rpx;
        height: 48rpx;
        background: #d9d9d9;
        opacity: 0.3;
      }
    }
    .mini-btn {
      background: #34374d;
      color: #ffffff;
      font-size: 32rpx;
    }
  }
}
@keyframes wave {
  0% {
    opacity: 0;
    transform: scale(0.2);
  }
  50% {
    opacity: 1;
    transform: scale(0.6);
  }
  100% {
    opacity: 0;
    transform: scale(1);
  }
}
</style>
