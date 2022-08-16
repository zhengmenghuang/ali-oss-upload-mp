import baseService from './base';

const apiService = {
  // 获取微信登录 code
  async wxLogin() {
    return await new Promise((resolve, reject) => {
      wx.login({
        success(res) {
          resolve(res.code);
        },
        fail(err) {
          reject(err);
        }
      })
    })
  },

  // 获取oss sts 信息
  GetStsAccessKey() {
    return baseService.get(`sts`)
  }
}

module.exports = apiService
