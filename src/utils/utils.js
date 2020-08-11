// 需要添加px并转换为vw的属性字段
const px2remTagArray = [
  'width',
  'height',
  'fontSize',
  'lineHeight',
  'top',
  'left',
  'borderRadius',
  'lineHeight'
]
// 只需要添加px的属性字段
const pxArray = ['borderWidth']

const utils = {
  // 模板style JSON为DOM style str
  JSON2Style(styleJSON) {
    /* eslint-disable */
    let result = styleJSON
    result.position = 'absolute'
    Object.keys(styleJSON).map((k) => {
      if (px2remTagArray.includes(k)) {
        result[k] = `${this.px2rem(styleJSON[k])}rem`
      } else if (pxArray.includes(k)) {
        result[k] = `${styleJSON[k]}px`
      } else {
        result[k] = styleJSON[k]
      }
    })
    return result
  },
  // rem页面适配处理 375px(编辑器) = 3.75rem(H5) => 100px = 1rem
  px2rem(num) {
    return (num / 100).toFixed(2)
  },
  judgeEv() {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      // ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
      wx.miniProgram.getEnv(res => {
        if (res.miniprogram) {
         return "smallRoutine";
        } else {
          return "notSmallRoutine";
        }
      });
    } else {
      return "notSmallRoutine";
    }
  },
}
export default utils
