export default {
    flag: true,
    delayTime: 800,
    getQueryString(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    setCookie(name, value, time) {
        let Days = time || 30;
        let exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";path=/;expires=" + exp.toGMTString();
    },
    getCookie(name) {
        let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    },
    delCookie(name) {
        let exp = new Date();
        exp.setTime(exp.getTime() - 1);
        let cval = this.getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";path=/;expires=" + exp.toGMTString();
    },
    goUrl(url) {
        if (!url) return;
        window.location.href = url
    },
    isOutUrl(url) {
        if (!url) return;
        let urlSplit = url.split("/"); //以“/”进行分割
        if (urlSplit[2] != "h5test.wostore.cn" && urlSplit[2] != "hfgo.wo.cn") {
            return true
        } else {
            window.location.href = url
        }
    },
    install(Vue) {
        // 防止重复点击
        Vue.directive('preventClick', {
            inserted(el, binding) {
                el.addEventListener('click', () => {
                    if (!el.disabled) {
                        el.disabled = true
                        setTimeout(() => {
                            el.disabled = false
                        }, 3000)
                    }
                })
            }
        })
    },
    //上滑加载，fn参数：滑动后加载数据所执行的方法
    loadmore(fn) {
        var _this = this;
        let scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);;
        let clientHeight = window.innerHeight || Math.min(document.documentElement.clientHeight, document.body.clientHeight);
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        // if(this.beforeScrollTop < afterScrollTop){
        if (clientHeight + scrollTop >= scrollHeight) {

            if (_this.flag) {
                fn();
                _this.flag = false;
                //防抖  
                setTimeout(() => {
                    _this.flag = true
                }, _this.delayTime)
            }
        }
        // }
        this.beforeScrollTop = scrollTop
    },
}