import crypto from './crypto.js';
import { Base64 } from './js-base64';
import apiService from '../apiservices/api';

// 保存计算好得 sts 密钥 （因为这个密钥可以用一段时间，所以需要协议一个过期自动获取的机制）
let formDataParams = null;

// 计算签名。
function computeSignature(accessKeySecret, canonicalString) {
  return crypto.enc.Base64.stringify(crypto.HmacSHA1(canonicalString, accessKeySecret));
}

// 生成的签名能力 读、写
const policyText = (expiration) => ({
  expiration: expiration, // 设置policy过期时间。
  conditions: [
    // 限制上传大小。
    ["content-length-range", 0, 1024 * 1024 * 1024],
  ],
})

async function getFormDataParams() {
  // 提前5s 获取最新的密钥
  if (!formDataParams || (formDataParams.expiration - 5) < (Date.now() / 1000)) {
    // sts鉴权所需的重要参数 需要从搭建好的sts后端服务获取 包含以下参数 AccessKeyId AccessKeySecret SecurityToken Expiration
    const credentials = await apiService.GetStsAccessKey();
    // policy必须为base64的string。
    const policy = Base64.encode(JSON.stringify(policyText(credentials.Expiration)))
    const signature = computeSignature(credentials.AccessKeySecret, policy)
    formDataParams = {
      OSSAccessKeyId: credentials.AccessKeyId,
      signature,
      policy,
      'x-oss-security-token': credentials.SecurityToken,
      expiration: credentials.Expiration
    }
    return formDataParams
  }

  return formDataParams
}

module.exports = {
  getFormDataParams: getFormDataParams
}
