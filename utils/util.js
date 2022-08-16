const app = getApp();

// 格式化时间
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 得到唯一的guid
const getGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// 写一个发布订阅
const event = {
  on: function (event, fn, ctx) {
    if (typeof fn !== 'function') {
      console.error('listener must be a function')
      return
    }

    this._stores = this._stores || {};
    (this._stores[event] = this._stores[event] || []).push({ cb: fn, ctx: ctx })
  },

  emit: function (event) {
    this._stores = this._stores || {}
    let store = this._stores[event]
    let args

    if (store) {
      store = store.slice(0)
      args = [].slice.call(arguments, 1)
      for (let i = 0, len = store.length; i < len; i++) {
        store[i].cb.apply(store[i].ctx, args)
      }
    }
  },

  off: function (event, fn) {
    this._stores = this._stores || {};

    if (!arguments.length) {
      this._stores = {};
      return;
    }

    const store = this._stores[event];
    if (!store) return;

    if (arguments.length === 1) {
      delete this._stores[event];
      return;
    }

    let cb;
    for (let i = 0, len = store.length; i < len; i++) {
      cb = store[i].cb;
      if (cb === fn) {
        store.splice(i, 1);
        break;
      }
    }
    return;
  }
}

// 下载图片到本地
const saveImageToPhotosAlbum = url => {
  if (!url) {
    wx.showToast({
      title: '文件地址有误',
      icon: 'none'
    })
    return;
  }

  wx.showToast({
    title: '文件保存中，请耐心等待',
    icon: 'none'
  })
  wx.downloadFile({
    url: url,
    success (file) {
      if (file.statusCode === 200) {
        wx.getSetting({
          success(set) {
            if (!set['scope.writePhotosAlbum']) {
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success() {
                  wx.saveImageToPhotosAlbum({filePath: file.tempFilePath, success: () => {
                    if (wx.getSystemInfoSync().platform === 'ios') {
                      wx.showToast({
                        title: '保存成功',
                        icon: 'none'
                      })
                    }
                  }})
                },
                fail() {
                  wx.showModal({
                    title: '提示',
                    content: '您尚未授权相册权限，是否打开设置授权？',
                    success(res) {
                      if (res.confirm) {
                        wx.openSetting()
                      }
                    }
                  })
                }
              })
            } else {
              wx.saveImageToPhotosAlbum({filePath: file.tempFilePath, success: () => {
                if (wx.getSystemInfoSync().platform === 'ios') {
                  wx.showToast({
                    title: '保存成功',
                    icon: 'none'
                  })
                }
              }})
            }
          }
        })
      } else {
        wx.showToast({
          title: '保存失败，请稍后重试',
          icon: 'none'
        })
      }
    },
    fail(e) {
      wx.showToast({
        title: e.errMsg,
        icon: 'none',
        time: 3000
      })
    }
  })
}

module.exports = {
  formatTime: formatTime, // 格式化时间
  getGuid: getGuid, // 获取Guid
  event: event, // 发布订阅工具
  saveImageToPhotosAlbum: saveImageToPhotosAlbum, // 下载图片到本地
}
