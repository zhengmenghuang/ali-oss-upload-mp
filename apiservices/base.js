const app = getApp();

const baseService = {
  // get 方法
  get(url) {
    return this.request('GET', url);
  },

  // post 方法
  post(url, data) {
    return this.request('POST', url, data);
  },

  // put 方法
  put(url, data) {
    return this.request('PUT', url, data);
  },

  // 正常http请求的根方法
  async request(method, url, data) {
    return await new Promise((resolve, reject) => {
      wx.request({
        url: `${app.globalData.apiUrl}/${url}`,
        data: data || null,
        method: method || 'GET',
        header: {
          'Authorization': null
        },
        success: (res) => {
          // 后端返回格式为 Data: 数据. Status: 接口是否成功的状态, Message: 接口失败的错误信息 需要根据自己业务在这里重新拦截返回值
          if (res.statusCode < 400) {
            resolve(res.data);
          } else {
            wx.showToast({
              title: res.data.Message || JSON.stringify(res.data),
              icon: 'none',
              duration: 3000
            })
            reject(res.data)
          }
        },
        fail: (err) => {
          wx.showToast({
            title: '网络较差，请检查后操作',
            icon: 'none',
            duration: 3000
          })
          reject(err);
        },
        complete: res => {
          console.log('HTTP', url, data, res.statusCode, res.data);
        }
      })
    })
  }
}

module.exports = baseService
