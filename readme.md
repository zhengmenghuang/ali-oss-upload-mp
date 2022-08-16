# weui 组件引用
## 第一种引入方式
- cd 项目
- npm init
- npm i weui-miniprogram -s
- 开发者工具 工具 构建npm
- app.wxss 中 引用 @import './miniprogram_npm/weui-miniprogram/weui-wxss/dist/style/weui.wxss';
- 具体页面json中引用 例："mp-dialog": "/miniprogram_npm/weui-miniprogram/dialog/dialog"
## 第二种引入方式 推荐 不占用包体积
- app.json 添加"useExtendedLib": { "weui": true }
- 具体页面json中引用 例："mp-dialog": "weui-miniprogram/dialog/dialog"

# 启动
需要在app.js 里面配置
- ossUrl: '', // 上传文件的阿里云地址
- apiUrl: '', // api 接口地址
