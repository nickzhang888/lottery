/* eslint-disable */
import Vue from "vue";
import toast from "./Toast.vue";
let toastTem = Vue.extend(toast);
let instance;
let timer = null;
let toastMessage = options => {
    if (!instance) {
        instance = new toastTem();
        instance.vm = instance.$mount();
        document.body.appendChild(instance.vm.$el);
    }
    if (timer) {
        clearTimeout(timer);
        timer = null;
        instance.show = false;
        instance.message = "";
    }
    let ctime;
    if (typeof options === "string") {
        instance.message = options;
        ctime = 2000;
    } else if (typeof options === "object") {
        let { message, time } = options;
        instance.message = message;
        ctime = time || 2000;
    } else {
        return;
    }
    instance.show = true;
    timer = setTimeout(() => {
        instance.show = false;
        clearTimeout(timer);
        timer = null;
        instance.message = "";
    }, ctime);
};
toastMessage.close = () => {
    if (timer) {
        clearTimeout(timer);
        timer = null;
        instance.show = false;
        instance.message = "";
    }
};
toastMessage.install = Vue => {
    Vue.prototype.$toast = toastMessage;
};
export default toastMessage;
