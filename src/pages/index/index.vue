<template>
  <view class="index-page">
    <!--  -->
    <Hello />
    <UnoCss />
    <text class="h2">查看其它页面示例↓</text>
    <view>
      <navigator v-for="(v, idx) in pages" :key="idx" :url="v.url">
        <span class="title">{{ v.title }}</span>
      </navigator>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import Hello from '@/components/hello/index.vue'
import UnoCss from '@/components/unocss/index.vue'
import { onLoad } from '@dcloudio/uni-app'

const pages = reactive([
  {
    title: 'Pinia Demo',
    url: '/pages/pinia/index'
  },
  {
    title: 'Axios Demo',
    url: '/pages/axios/index'
  },
  {
    title: 'uView Demo',
    url: '/pages/uview/index'
  },
  {
    title: 'UnoCSS Demo',
    url: '/pages/unocss/index'
  }
])

uni.navigateTo({
  url: '../home/home'
  // url: '../more/more'
})
</script>

<style scoped>
.index-page {
  font-style: normal;
  text-align: center;
}
.h2 {
  color: green;
  /* 750 视觉设计稿 */
  font-size: 32rpx;
}
.title {
  font-size: 40rpx;
}
navigator {
  color: #1e80ff;
}
</style>
