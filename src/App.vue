<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
// 只能在App.vue里监听应用的生命周期: https://uniapp.dcloud.net.cn/collocation/App.html
/* --------------------- 应用生命周期仅可在App.vue中监听，在其它页面监听无效。 --------------------- */

onLaunch(() => {
  console.log('App Launch')
})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>
<style lang="scss">
// uni-ui 辅助样式 https://uniapp.dcloud.net.cn/component/uniui/uni-sass.html
// @import '@/uni_modules/uni-scss/index.scss';

// 全局的样式
@import 'vk-uview-ui/index.scss';
</style>
