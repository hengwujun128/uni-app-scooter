<template>
  <view class="settings">
    <uni-nav-bar dark :border="false" :fixed="true" background-color="#2d2f43" left-icon="left" left-text="返回"
      title="设置" height="200rpx" @click-left="back">
      <template #left>
        <view class="icon-left">
          <u-icon width="80" height="80" size="60" space="10px" hover-class="hover-class"
            name="/static/images/scooter/btn-back.svg"></u-icon>
        </view>
      </template>
    </uni-nav-bar>

    <view class="body">
      <view class="card">
        <view class="row">
          <view class="left">
            <text class="title">语言设置</text>
            <text class="desc">中文</text>
          </view>
          <view class="right action">
            <uni-icons type="right" size="24" class="setting-icon" color="#fff;opacity:0.4"
              @click="setLang"></uni-icons>
          </view>
        </view>
      </view>
      <!-- 方向灵敏度 -->
      <view class="card card-rowLayout">
        <view class="row">
          <text class="label">转向灵敏度</text>
          <text class="value">{{ settings.directionalSensitivityForHighAndLow }}</text>
        </view>
        <view class="row">
          <text class="label label-left">低</text>
          <slider class="slider" :min="0" :max="100" :value="settings.directionalSensitivityForHighAndLow"
            active-color="#FFCC33" background-color="linear-gradient(89.99deg, #2149C4 -1.79%, #06D7CA 104.63%);"
            block-color="#8A6DE9" :block-size="30" @change="changeSensitivity" />
          <text class="label label-right">高</text>
        </view>
      </view>
      <!-- 平衡点 -->
      <view class="card card-rowLayout">
        <view class="row">
          <text class="label">平衡点</text>
          <text class="value">{{ settings.directionalSensitivityForFrontAndBack }}</text>
        </view>
        <view class="row">
          <text class="label label-left">前</text>
          <slider class="slider" :value="settings.directionalSensitivityForFrontAndBack" active-color="#FFCC33"
            background-color="linear-gradient(89.99deg, #2149C4 -1.79%, #06D7CA 104.63%);" block-color="#8A6DE9"
            :block-size="30" @change="changeDirection" />
          <text class="label label-right">后</text>
        </view>
      </view>

      <!-- 方向矫正 -->
      <!-- <view class="card card-rowLayout">
        <view class="row">
          <text class="label">方向矫正</text>
          <switch checked color="rgba(15, 224, 136, 1)" @change="setDirection" />
        </view>
      </view> -->

      <!-- 自平衡模式 -->
      <view class="card card-rowLayout">
        <view class="row">
          <text class="label">自平衡模式</text>
          <switch checked color="rgba(15, 224, 136, 1)" @change="setBalanceMode" />
        </view>
        <view class="divider"></view>
        <view class="row">
          <text class="label">自平衡点校正</text>
          <text class="value">{{ settings.balanceValue }}</text>
        </view>

        <view class="row">
          <text class="label label-left">0</text>
          <slider class="slider" :value="settings.balanceValue" active-color="#FFCC33"
            background-color="linear-gradient(89.99deg, #2149C4 -1.79%, #06D7CA 104.63%);" block-color="#8A6DE9"
            :block-size="30" @change="setBalanceValue" />
          <text class="label label-right">100</text>
        </view>
      </view>

      <!-- 密码锁设置&& 一键恢复出厂设置 -->
      <view class="card">
        <!-- <view class="row">
          <view class="left">
            <text class="title">密码锁设置</text>
            <text class="desc">已锁定</text>
          </view>
          <view class="right">
            <uni-icons type="right" size="24" color="#fff;opacity:0.4" @click="setLang"></uni-icons>
          </view>
        </view>
        <view class="divider"></view> -->
        <view class="row">
          <view class="left">
            <text class="title">一键恢复出厂设置</text>
            <text class="desc">已锁定</text>
          </view>
          <view class="right">
            <uni-icons type="right" size="24" color="#fff;opacity:0.4" @click="setResettings"></uni-icons>
          </view>
        </view>
      </view>
      <!-- 管理员设置 -->
      <view class="card admin">
        <view class="row">
          <view class="left">
            <text class="title">管理员设置</text>
            <text class="desc">{{ isAdmin ? '已开启' : '已锁定' }}</text>
          </view>
          <view class="right">
            <uni-icons type="right" size="24" color="#fff;opacity:0.4" @click="setAdminSettings"></uni-icons>
          </view>
        </view>

        <template v-if="isAdmin">
          <view class="divider"></view>

          <view class="row">
            <view class="left">
              <text class="title">品牌</text>
              <text class="desc">{{ adminSettings.brandName }}</text>
            </view>
            <view class="right">
              <uni-icons type="right" size="24" color="#fff;opacity:0.4" @click="setBrand"></uni-icons>
            </view>
          </view>
          <view class="row">
            <text class="label">配件商城</text>
            <switch checked color="rgba(15, 224, 136, 1)" @change="setComponentShop" />
          </view>
          <!--  -->
          <view class="row">
            <view class="left">
              <text class="title">出厂日期</text>
              <text class="desc">{{ adminSettings.manufactureDate }}</text>
            </view>
            <view class="right">
              <uni-icons type="right" size="24" color="#fff;opacity:0.4" @click="setManufactureDate"></uni-icons>
            </view>
          </view>

          <view class="row">
            <view class="left">
              <text class="title">保修时长</text>
              <text class="desc">{{ adminSettings.warrantyPeriod }}</text>
            </view>
            <view class="right">
              <uni-icons type="right" size="24" color="#fff;opacity:0.4" @click="setWarrantyPeriod"></uni-icons>
            </view>
          </view>
          <view class="row">
            <view class="left">
              <text class="title">版本</text>
              <text class="desc">{{ adminSettings.version }}</text>
            </view>
            <view class="right">
              <uni-icons type="right" size="24" color="#fff;opacity:0.4" @click="setVersion"></uni-icons>
            </view>
          </view>
        </template>
      </view>
      /* ------------------------------
      <!-- end -->
      ------------------------------ */
    </view>

    <view>
      <!-- 出厂设置对话框 -->
      <uni-popup ref="resetRef" type="dialog">
        <uni-popup-dialog
          ref="inputClose"
          mode="input"
          :title="dialog.title"
          :value="dialog.value"
          :placeholder="dialog.value"
          @confirm="confirmResettings"
        ></uni-popup-dialog>
      </uni-popup>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { reactive, ref, Ref, computed } from 'vue'
import useBlueTooth from '../../hooks/useBlueTooth.ts'
import { useBlueToothStore, useAdminSettingsStore } from '@/store'

const { serviceId, characteristicId, ab2hex } = useBlueTooth()

// 获取自定义的store
const store = useBlueToothStore()
const adminStore = useAdminSettingsStore()

const settings = reactive({
  lang: '',
  directionalSensitivity: 0,
  directionalSensitivityForFrontAndBack: 0, // 方向灵敏度-前后
  directionalSensitivityForHighAndLow: 0, // 方向灵敏度-高低
  directionalStatus: false, // 方向矫正状态
  balanceModeStatus: false, //  平衡模式状态
  balanceValue: 0 // 平衡点矫正值
})

const dialog = reactive({
  title: '',
  value: '',
  action: ''
})
const resetRef: Ref = ref(null)

const isAdmin = ref(false)
const adminSettings = reactive({
  brandName: '',
  enableComponentShop: false,
  manufactureDate: '',
  warrantyPeriod: '',
  version: ''
})

const device = computed(() => store.device)

// 发送消息指令

const sendCmd = (buffer: any) => {
  console.log(ab2hex(buffer))
  return new Promise((resolve, reject) => {
    uni.writeBLECharacteristicValue({
      deviceId: device.value.deviceId,
      serviceId: serviceId.value || '0000FFE0-0000-1000-8000-00805F9B34FB',
      characteristicId: characteristicId.value || '0000FFE1-0000-1000-8000-00805F9B34FB',
      //@ts-ignore
      value: buffer,
      success: (res) => {
        console.log('res', res)
        resolve(res)
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

const back = () => {
  uni.navigateBack()
  // uni.navigateTo({
  //   url: '../main/main'
  // })
}

// 恢复出厂设置
const ResetFactory = () => {
  console.log('恢复出厂设置')
}

const setLang = () => {
  console.log('setLang--')
}

const sliderChange = (e: any) => {
  console.log('---')
  settings.directionalSensitivity = e.detail.value
}

// 方向高低灵敏度
const changeSensitivity = (e: any) => {
  console.log('changeSensitivity', e.detail.value)
  settings.directionalSensitivityForHighAndLow = e.detail.value
}
// 方向前后灵敏度
const changeDirection = (e: any) => {
  settings.directionalSensitivityForFrontAndBack = e.detail.value
}
// 方向矫正
const setDirection = (e: any) => {
  settings.directionalStatus = e.detail.value
  console.log('方向矫正', settings.directionalStatus)
  // sendCmd()
}
// 平衡模式
const setBalanceMode = (e: any) => {
  settings.balanceModeStatus = e.detail.value
  console.log('平衡模式', settings.balanceModeStatus)
}
// 平衡点矫正值
const setBalanceValue = (e: any) => {
  settings.balanceValue = e.detail.value
  console.log('平衡点校正值', settings.balanceValue)
}
// 恢复出厂设置
const setResettings = () => {
  console.log('出厂设置')
  dialog.action = 'setResettings'
  dialog.title = '恢复出厂设置'
  dialog.value = '请输入密码'
  resetRef.value.open()
}

// 管理员设置
const setAdminSettings = () => {
  console.log('管理员设置')
  dialog.action = 'setAdminSettings'
  dialog.title = '管理员设置'
  dialog.value = '请输入管理员密码'
  resetRef.value.open()
}

/* --------------------------------- 管理员设置项 --------------------------------- */
const setBrand = () => {
  console.log('设置品牌')
  dialog.action = 'setBrand'
  dialog.title = '设置品牌名称'
  dialog.value = '请输入品牌名称'
  resetRef.value.open()
}

const setComponentShop = (e: any) => {
  console.log(' 设置配件商城', e.detail.value)
  adminSettings.enableComponentShop = e.detail.value
}
const setManufactureDate = () => {
  console.log('设置出厂日期')
  dialog.action = 'setManufactureDate'
  dialog.title = '设置出厂日期'
  dialog.value = '请输入出厂日期'
  resetRef.value.open()
}

const setWarrantyPeriod = () => {
  console.log('设置保修时长')
  dialog.action = 'setWarrantyPeriod'
  dialog.title = '设置保修时长'
  dialog.value = '请输入保修时长'
  resetRef.value.open()
}

const setVersion = () => {
  console.log('设置版本')
  dialog.action = 'setVersion'
  dialog.title = '设置版本号'
  dialog.value = '请输入版本号'
  resetRef.value.open()
}

const confirmResettings = (val: any) => {
  console.log('dialog.value', dialog.value)
  console.log('val', val)
  if (!val) {
    return
  }
  uni.showLoading({
    title: '正在校验密码'
  })
  // 出厂设置
  if (dialog.action === 'setResettings' && Number(val) === 123456) {
    // setCmd()
    console.log('发送指令')
  }
  // 管理员设置
  if (dialog.action === 'setAdminSettings' && Number(val) === 88888888) {
    isAdmin.value = true
    console.log('发送指令')
  }
  // 品牌名称
  if (dialog.action === 'setBrand') {
    console.log('品牌名称', val)
    adminSettings.brandName = val
    adminStore.setAdminSettings({ brandName: val })
  }
  //出厂日期
  if (dialog.action === 'setManufactureDate') {
    console.log('出厂日期', val)
    adminSettings.manufactureDate = val
    adminStore.setAdminSettings({ manufactureDate: val })
  }
  //保修时长
  if (dialog.action === 'setWarrantyPeriod') {
    console.log('保修时长', val)
    adminSettings.warrantyPeriod = val
    adminStore.setAdminSettings({ warrantyPeriod: val })
  }

  // 版本
  if (dialog.action === 'setVersion') {
    console.log('版本', val)
    adminSettings.version = val
    adminStore.setAdminSettings({ version: val })
  }

  setTimeout(() => {
    uni.hideLoading()
    console.log(val)
    dialog.action = ''
    resetRef.value.close()
  }, 0)
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
.admin {
  .row {
    margin-bottom: 20rpx;
  }
}
</style>
