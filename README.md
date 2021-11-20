# uni-vue3-ts-template
uni-app vue3-ts 模板项目

本项目主要用于小程序开发使用，不支持H5

Vue3的Web应用模板请使用[vite-vue3-template](https://github.com/ATQQ/vite-vue3-template)工程
## feature
### prod
* [x] Vue3
* [x] Vuex4
* [x] Axios-mini[axios-miniprogram](https://github.com/fluffff/axios-miniprogram#readme)
* [x] [Vant Weapp](https://vant-contrib.gitee.io/vant-weapp/#/home)


### dev
* [x] eslint
* [x] sass
* [x] typescript
* [x] tailwindcss
* [x] less
## 使用
### 安装依赖
```
yarn install
```

### 开发热重载
#### 微信小程序
```
yarn dev:mp-weixin
```

### 生产环境打包构建
#### 微信小程序
```
yarn build:mp-weixin
```

然后将编译结果`dist/dev/mp-weixin`导入微信开发者工具即可运行

其它更多脚本 查看 [package.json](./package.json)中的scripts
