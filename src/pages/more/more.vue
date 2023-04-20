<template>
  <view class="settings">
    <uni-nav-bar
      dark
      :border="false"
      :fixed="true"
      background-color="#2d2f43"
      left-icon="left"
      left-text="返回"
      title="更多"
      height="200rpx"
      @click-left="blueToothHandler"
      @click-right="settingHandler"
    >
      <template #left>
        <view class="icon-left">
          <u-icon
            width="80"
            height="80"
            size="60"
            hover-class="hover-class"
            name="/static/images/scooter/btn-blueTooth.svg"
          ></u-icon>
        </view>
      </template>

      <template #right>
        <u-icon
          width="80"
          height="80"
          size="60"
          space="10px"
          hover-class="hover-class"
          name="/static/images/scooter/btn-setting.svg"
        ></u-icon>
      </template>
    </uni-nav-bar>

    <view class="body">
      <view class="card">
        <view class="row">
          <view class="left">
            <text class="title">产品使用说明书</text>
          </view>
          <view class="right action">
            <uni-icons
              type="right"
              size="24"
              class="setting-icon"
              color="#fff;opacity:0.4"
              @click="setLang"
            ></uni-icons>
          </view>
        </view>
      </view>
      <!-- 新手教程 -->
      <view class="card">
        <view class="row">
          <view class="left">
            <text class="title">新手教程</text>
          </view>
          <view class="right action">
            <uni-icons
              type="right"
              size="24"
              class="setting-icon"
              color="#fff;opacity:0.4"
              @click="setLang"
            ></uni-icons>
          </view>
        </view>
      </view>
      <!-- 注意事项及安全警告 -->
      <view class="card">
        <view class="row">
          <view class="left">
            <text class="title">注意事项及安全警告</text>
          </view>
          <view class="right action">
            <uni-icons
              type="right"
              size="24"
              class="setting-icon"
              color="#fff;opacity:0.4"
              @click="setLang"
            ></uni-icons>
          </view>
        </view>
      </view>

      <!-- 问题答疑 -->
      <view class="card">
        <view class="row">
          <view class="left">
            <text class="title">问题答疑</text>
          </view>
          <view class="right action">
            <uni-icons
              type="right"
              size="24"
              class="setting-icon"
              color="#fff;opacity:0.4"
              @click="setLang"
            ></uni-icons>
          </view>
        </view>
      </view>
      <!-- 关于本机 -->
      <view class="card">
        <view class="row">
          <view class="left">
            <text class="title">关于本机</text>
          </view>
          <view class="right action">
            <uni-icons
              type="right"
              size="24"
              class="setting-icon"
              color="#fff;opacity:0.4"
              @click="setLang"
            ></uni-icons>
          </view>
        </view>
      </view>
      <!-- end -->
    </view>
  </view>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

const settings = reactive({
  lang: '',
  directionalSensitivity: 0
})
const blueToothHandler = () => {
  console.log('Bluetooth')
}
const settingHandler = () => {
  uni.navigateTo({
    url: '../settings/index'
  })
  console.log('settting')
}
const setLang = () => {
  console.log('setLang--')
}
</script>

<style lang="scss" scoped>
@import '../../styles/mixins/__animation.scss';

.icon-left {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(360deg, #4d5068 -4.38%, #31354a 100%);
}
.settings {
  background: #2d2f43;
  .body {
    height: calc(100vh - 200rpx);
    padding-bottom: 200rpx;
    overflow: scroll;
  }
}

.card {
  margin: 24rpx 32rpx;
  padding: 24rpx 32rpx;
  box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.08);
  background: #34374d;
  border-radius: 24rpx;
  color: #ffffff;
  .left {
    flex: 1;
    .title,
    .desc {
      display: block;
    }
    .title {
      font-size: 32rpx;
      line-height: 45rpx;
      height: 45rpx;
      margin-bottom: 6rpx;
    }
    .desc {
      font-size: 24rpx;
      height: 34rpx;
      line-height: 34rpx;
      opacity: 0.6;
    }
  }
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.divider {
  height: 1px;
  width: 100%;
  background: #515572;
  margin: 16rpx 0rpx;
}

.label {
  font-size: 32rpx;
}
.label-left,
.label-right {
  font-size: 24rpx;
  opacity: 0.6;
}

.slider {
  flex: 1;
}
</style>
