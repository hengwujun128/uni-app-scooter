<template>
  <view class="home">
    <uni-nav-bar dark title="自定义高度" height="120rpx">
      <template #left>
        <!-- todo: replace icon lately -->
        <view class="left"><uni-icons type="paperplane-filled" size="30" color="#fff"></uni-icons></view>
      </template>
      <template #right>
        <view class="right"><uni-icons type="gear-filled" size="30" color="#fff"></uni-icons></view>
      </template>
    </uni-nav-bar>

    <view class="body"></view>
  </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  uni.setNavigationBarTitle({
    title: '新的标题'
  })
})
</script>

<style lang="scss" scoped>
.home {
}
</style>
