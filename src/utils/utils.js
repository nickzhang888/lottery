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
      })
    } else {
      return "notSmallRoutine";
    }
  },
  getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },
  setCookie(name, value, time) {
    let Days = time || 30;
    let exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";path=/;expires=" + exp.toGMTString();
  },
  getCookie(name) {
    var strcookie = document.cookie;//获取cookie字符串
    var arrcookie = strcookie.split("; ");//分割
    //遍历匹配
    for (var i = 0; i < arrcookie.length; i++) {
      var arr = arrcookie[i].split("=");
      if (arr[0] == name) {
        return arr[1];
      }
    }
    return "";
  },
  delCookie(name) {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval = utils.getCookie(name);
    if (cval != null)
      document.cookie = name + "=" + cval + ";path=/;expires=" + exp.toGMTString();
  },
  goLogin() {
    window.location.href = `${process.env.VUE_APP_LOGIN}${encodeURIComponent(window.location.href)}`
  },
  isDuringDate(begin, end) {
    let curDate = new Date(),
      beginDate = new Date(begin),
      endDate = new Date(end);
    if (curDate < beginDate) {
      return "notBegin"
    } else if (curDate > endDate) {
      return "hasEnd"
    }
  },
  handleShare(shareOption) {
    console.log(shareOption);
    $.ajax({
      url: `${location.protocol}//wxwsd.wostore.cn/index.php?s=/Api/Data/getWeixinSignInfo&weixin_id=5&url=${encodeURIComponent(location.href)}`,
      data: "",
      type: "get",
      dataType: "jsonp",
      jsonp: "callback",
      success: function (d) {
        var wxAppid = d.data.appId;
        var wxNonceStr = d.data.nonceStr;
        var wxSign = encodeURIComponent(d.data.signature);
        var wxTimestamp = d.data.timestamp;
        wx.config({
          debug: false,
          appId: wxAppid,
          timestamp: wxTimestamp,
          nonceStr: wxNonceStr,
          signature: wxSign,
          jsApiList: ["updateAppMessageShareData", "updateTimelineShareData"]
        });
        wx.ready(function () {
          wx.updateAppMessageShareData({
            title: shareOption.title,
            desc: shareOption.desc,
            link: shareOption.link,
            imgUrl: shareOption.imgUrl,
            success: function () { },
            cancel: function () { }
          });
          wx.updateTimelineShareData({
            title: shareOption.title,
            link: shareOption.link,
            imgUrl: shareOption.imgUrl,
            success: function () { },
            cancel: function () { }
          });
        });
        wx.error(function (res) {
          console.log(res);
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        });
      }
    });
  },
  handleCopy(id, that) {
    const clipboard = new that.Clipboard(id);
    // 成功回调
    clipboard.on("success", res => {
      that.$toast("复制成功", 2000);
      clipboard.destroy();
    });
    // 失败回调
    clipboard.on("error", res => {
      that.$toast("该浏览器不支持自动复制，请您手动复制", 2000);
      clipboard.destroy();
    });
  },
  //打开模态框前调用
  fixedBody() {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    document.body.style.cssText += 'position:fixed;top:-' + scrollTop + 'px;';
  },
  //关闭模态框后调用
  looseBody() {
    const body = document.body;
    body.style.position = '';
    body.style.top = '';
    const top = body.style.top;
    document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top);
  }
}
export default utils
