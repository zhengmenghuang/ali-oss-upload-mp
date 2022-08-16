//app.js
App({
  onLaunch() {
    this.updateManager();
  },

  updateManager() {
    const updateManager = wx.getUpdateManager()
    if (updateManager) {
      updateManager.onCheckForUpdate(res => {
        // 请求完新版本信息的回调
        console.log(res.hasUpdate)
      })
      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否马上重启小程序？',
          success(res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })
      updateManager.onUpdateFailed(() => {
        console.log('新版本更新失败');
      })
    }
  },

  globalData: {
    ossUrl: 'https://hzm-test.oss-cn-hangzhou.aliyuncs.com', // 上传文件的阿里云地址 你要换成自己的
    apiUrl: 'http://llxhzm.top:8000', // api 接口地址 已停服 你要换成自己的
  }
})
