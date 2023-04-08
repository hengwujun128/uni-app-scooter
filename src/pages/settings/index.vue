<template>
  <view class="settings">
    <uni-nav-bar
      dark
      :border="false"
      :fixed="true"
      background-color="#2d2f43"
      left-icon="left"
      left-text="返回"
      title="设置"
      height="200rpx"
      @click-left="back"
    >
      <template #left>
        <view class="icon-left">
          <!-- <u-icon
            width="20"
            height="40"
            space="10px"
            hover-class="hover-class"
            name="/static/images/scooter/icon-left.svg"
          ></u-icon> -->
          <uni-icons type="back" size="30" color="#fff"></uni-icons>
        </view>
      </template>
    </uni-nav-bar>

    <view class="body">
      <view class="card card-columnLayout">
        <view class="left">
          <text class="title">语言设置</text>
          <text class="desc">中文</text>
        </view>
        <view class="right">
          <uni-icons type="right" size="24" color="#fff;opacity:0.4" @click="setLang"></uni-icons>
        </view>
      </view>
      <!-- 方向灵敏度 -->
      <view class="card card-rowLayout">
        <view class="row">
          <text class="label">方向灵敏度</text>
          <text class="value">{{ settings.directionalSensitivity }}</text>
        </view>
        <view class="row">
          <text class="label label-left">低</text>
          <slider
            class="slider"
            :value="settings.directionalSensitivity"
            active-color="#FFCC33"
            background-color="linear-gradient(89.99deg, #2149C4 -1.79%, #06D7CA 104.63%);"
            block-color="#8A6DE9"
            :block-size="50"
            @change="sliderChange"
          />
          <text class="label label-right">高</text>
        </view>
      </view>
      <!-- 方向灵敏度 -->
      <view class="card card-rowLayout">
        <view class="row">
          <text class="label">方向灵敏度</text>
          <text class="value">{{ settings.directionalSensitivity }}</text>
        </view>
        <view class="row">
          <text class="label label-left">前</text>
          <slider
            class="slider"
            :value="settings.directionalSensitivity"
            active-color="#FFCC33"
            background-color="linear-gradient(89.99deg, #2149C4 -1.79%, #06D7CA 104.63%);"
            block-color="#8A6DE9"
            :block-size="50"
            @change="sliderChange"
          />
          <text class="label label-right">后</text>
        </view>
      </view>
      <!-- 方向校正与自平衡  -->
      <!-- <view class="card card-columnLayout">
        <view class="left">
          <text class="title">方向校正与自平衡</text>
          <text class="desc">已锁定</text>
        </view>
        <view class="right">
          <uni-icons type="right" size="24" color="#fff;opacity:0.4" @click="setLang"></uni-icons>
        </view>
      </view> -->

      <!-- 方向矫正 -->
      <view class="card card-rowLayout">
        <view class="row">
          <text class="label">方向矫正</text>
          <switch checked color="rgba(15, 224, 136, 1)" @change="setDirection" />
        </view>
      </view>
      <!-- 自平衡模式 -->

      <view class="card card-rowLayout">
        <view class="row">
          <text class="label">自平衡模式</text>
          <switch checked color="rgba(15, 224, 136, 1)" @change="setDirection" />
        </view>
        <view class="divider"></view>
        <view class="row">
          <text class="label">自平衡点校正</text>
          <text class="value">{{ settings.directionalSensitivity }}</text>
        </view>

        <view class="row">
          <text class="label label-left">0</text>
          <slider
            class="slider"
            :value="settings.directionalSensitivity"
            active-color="#FFCC33"
            background-color="linear-gradient(89.99deg, #2149C4 -1.79%, #06D7CA 104.63%);"
            block-color="#8A6DE9"
            :block-size="50"
            @change="sliderChange"
          />
          <text class="label label-right">100</text>
        </view>
      </view>

      <!-- 密码锁设置&& 一键恢复出厂设置 -->
      <view class="card">
        <view class="row">
          <view class="left">
            <text class="title">密码锁设置</text>
            <text class="desc">已锁定</text>
          </view>
          <view class="right">
            <uni-icons type="right" size="24" color="#fff;opacity:0.4" @click="setLang"></uni-icons>
          </view>
        </view>
        <view class="divider"></view>
        <view class="row">
          <view class="left">
            <text class="title">一键恢复出厂设置</text>
            <text class="desc">已锁定</text>
          </view>
          <view class="right">
            <uni-icons type="right" size="24" color="#fff;opacity:0.4" @click="setLang"></uni-icons>
          </view>
        </view>
      </view>
      <!-- 管理员设置 -->
      <view class="card card-columnLayout">
        <view class="left">
          <text class="title">管理员设置</text>
          <text class="desc">已锁定</text>
        </view>
        <view class="right">
          <uni-icons type="right" size="24" color="#fff;opacity:0.4" @click="setLang"></uni-icons>
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
const back = () => {
  uni.navigateBack()
  // uni.navigateTo({
  //   url: '../main/main'
  // })
}
const setLang = () => {
  console.log('setLang--')
}
const sliderChange = (e: any) => {
  console.log('---')
  settings.directionalSensitivity = e.detail.value
}
const setDirection = (e: any) => {
  console.log('方向矫正', e.detail.value)
}
</script>

<style lang="scss" scoped>
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
.card-columnLayout {
  display: flex;
  align-items: center;
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

.card-rowLayout {
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
}
</style>
