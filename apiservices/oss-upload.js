const app = getApp();
import { getFormDataParams } from '../utils/sts';

const ossUploadService = {
  // 这个通用函数 只需要传 上传路径（桶名+文件名） 文件的本地路径就可以了
  async upload(key, filePath) {
    return new Promise(async (resolve, reject) => {
      const stsInfo = await getFormDataParams()
      // 需要上传到阿里云oss的地方
      const host = app.globalData.ossUrl;
      const signature = stsInfo.signature;
      const ossAccessKeyId = stsInfo.OSSAccessKeyId;
      const policy = stsInfo.policy;
      const securityToken = stsInfo['x-oss-security-token'];
      wx.uploadFile({
        url: host, // 阿里 oss URL。
        filePath: filePath, // 上传文件的本地路径
        name: 'file', // 必须填file。
        formData: {
          key, // 文件名
          policy,
          OSSAccessKeyId: ossAccessKeyId,
          signature,
          'x-oss-security-token': securityToken // 使用STS签名时必传。
        },
        success: (res) => {
          if (res.statusCode === 204) {
            // 返回oss文件的路径
            resolve(`${app.globalData.ossUrl}/${key}`);
          }
        },
        fail: err => {
          reject(err)
        },
        complete: res => {
          console.log('UPLOAD', key, filePath, res.statusCode, res.data);
        }
      })
    })
  }
}

module.exports = ossUploadService
