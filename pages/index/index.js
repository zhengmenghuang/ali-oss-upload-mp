import ossUploadService from '../../apiservices/oss-upload';
import util from '../../utils/util';


Page({
  data: {

  },

  onLoad(options) {

  },

  async upload() {
    const guid = util.getGuid();

    // file 包含 大小 路径 封面路径 时长等
    const file = await wx.chooseMedia({
      sourceType: ['album'],
      count: 1,
      mediaType: ['video']
    })
    // 上传视频
    const videoKey = `video/${guid}`;
    const videoFilePath = file.tempFiles[0].tempFilePath;
    const ossVideoUrl = await ossUploadService.upload(videoKey, videoFilePath);

    // 上传封面
    const imageKey = `image/${guid}`;
    const imageFilePath = file.tempFiles[0].thumbTempFilePath;
    const ossImageUrl = await ossUploadService.upload(imageKey, imageFilePath);

    console.log(ossVideoUrl, ossImageUrl);
  },

})
