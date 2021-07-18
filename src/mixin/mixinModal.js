export const mixinModal = {
    data() {
        return {
            isShowModal: false,
            isShowBtn: true,
            receiptInfo: {
                realname: "",
                phone: "",
                address: "",
                seq: "",
                clickable: true,
            },
        };
    },
    methods: {
        handleCopy() {
            this.$utils.handleCopy(".copy", this);
        },
        // 收货信息提交
        address() {
            this.$post("/atpapi/act/lottery/address", this.receiptInfo).then(
                (res) => {
                    if (res.code === "0000") {
                        this.$toast("收货信息已提交，请等待收货", 2000);
                        this.isShowModal = false;
                    } else {
                        this.$message({
                            type: "error",
                            message: res.message,
                            duration: 1500,
                        });
                    }
                }
            );
        },
        handleClick() {
            console.log("点击了", this.config.name, this.receiptInfo);
            if (["noPrize", "againPrize"].includes(this.config.name)) {
                this.closeModal();
            }
            // 收件信息填写提交按钮
            if (this.config.name === "receipt") {
                if (!this.receiptInfo.seq) {
                    this.$toast("当前为预览模式，所中奖品仅为展示效果所用", 2000);
                    return;
                }
                if (!this.receiptInfo.realname) {
                    this.$toast("请输入收件人姓名", 2000);
                    return;
                }
                if (!this.receiptInfo.phone) {
                    this.$toast("请输入收件人手机号", 2000);
                    return;
                }
                if (!this.receiptInfo.address) {
                    this.$toast("请输入收件人地址", 2000);
                    return;
                }
                if (!this.receiptInfo.clickable) {
                    this.$toast("您的收件信息已提交，如需更改请联系相关客服人员", 2000);
                    return;
                }
                this.address();
            }
            // 实物中奖弹窗按钮跳转填写收件信息
            if (this.config.name === "realPrize") {
                this.showReceipt(this.config.content.seq);
            }
            let value = ["codePrize", "virtualPrize", "hfgoPrize"];
            const url = this.config.btn.url;
            const hfgo = `${process.env.VUE_APP_PREURL}atpapi/cuuser/auth/autoLogin?redirectUrl=${url}&Authorization=${this.token}&clientId=${this.clientId}`;
            if (value.includes(this.config.name)) {
                if (url) {
                    window.location.href = url.includes("hfgo") || url.includes("changXiang") ? hfgo : url;
                }
                if (this.config.name === "hfgoPrize" && !url) {
                    this.$parent.winRecord();
                }
            }
        },
        showReceipt(receiptdata) {
            this.$bus.$emit("newmodal", "receipt", receiptdata);
        },
        closeModal() {
            this.isShowModal = false;
            this.$utils.looseBody()
        },
    },
    created() {
        this.token = this.$utils.getCookie("atpAuthToken");
        this.clientId = this.$route.query.product;

        this.$bus.$on("showModal", (receiptdata) => {
            // console.log("弹框内容:", this.config);
            this.$utils.fixedBody()
            this.isShowModal = true;
            let name = ["codePrize", "virtualPrize"];
            if (name.includes(this.config.name) && !this.config.btn.url) {
                this.isShowBtn = false;
            } else {
                this.isShowBtn = true;
            }
            this.receiptInfo.realname = "";
            this.receiptInfo.phone = "";
            this.receiptInfo.address = "";
            this.receiptInfo.seq = "";
            setTimeout(() => {
                // 获取用户已填写的收件信息
                if (this.config.name === "receipt" && receiptdata) {
                    if (typeof receiptdata === "string") {
                        this.receiptInfo.seq = receiptdata;
                    } else {
                        this.receiptInfo.realname = receiptdata.realname;
                        this.receiptInfo.phone = receiptdata.phone;
                        this.receiptInfo.address = receiptdata.address;
                        this.receiptInfo.seq = receiptdata.seq;
                        this.receiptInfo.clickable = receiptdata.clickable;
                    }
                }
            }, 500);
        });
    },
}