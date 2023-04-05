<template>
  <view>
    <!-- <button @click="startBlueTooth">blueTooth</button> -->
    <view v-if="visible">
      <!-- 提示: 连接目标设备 -->
    </view>
    <view v-else>
      <!-- 搜索动画 -->
      <wave></wave>
    </view>
    <!-- bug -->
    <!-- <u-button text="月落"></u-button> -->
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import wave from './wave.vue'

const visible = ref(false)

const startBlueTooth = () => {
  visible.value = !visible.value
}
</script>

<style lang="scss" scoped></style>
