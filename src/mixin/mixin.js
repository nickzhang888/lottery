export const mixin = {
    data() {
        return {
            isLogin: false,
            currentModal:'',
            shareOption: {
                title: "",
                desc: "",
                link: "",
                imgUrl: "",
            },
            isRight:true
        }
    },
    computed: {
    },
    created() {
        console.log(this.isRight,"混入");
        this.clientId = this.$route.query.product;
        this.actId = this.templateInfo.id;
        this.shareOption.title = this.templateInfo.wxShareTitle;
        this.shareOption.desc = this.templateInfo.wxShareText;
        this.shareOption.imgUrl = this.templateInfo.wxShareIcon;
        this.token = this.$utils.getCookie("atpAuthToken");
        if (this.token) {
            this.isLogin = true;
            this.$store.dispatch('getBuyTimes', this.actId)
            this.getAmount();
            this.getTask().then(res => {
                this.$utils.handleShare(this.shareOption);
            });
        } else {
            this.shareOption.link = location.href;
            this.$utils.handleShare(this.shareOption);
        }
        this.$bus.$on('newmodal', (modalname, receiptdata) => {
          console.log(modalname,receiptdata);
          this.currentModal = this.config.modal[modalname]
          this.$bus.$emit('showModal', receiptdata)
        })
    },
    methods: {
        goBuy() {
            const result = this.templateInfo.actActivitySettings.find(item => item.settingKey == "is_buy_draw_times");
            const url = `${result.actActivitySettingExtends[0].redirectUrl}`;
            const message = this.getMsg();
            if (!message) return;
            if (this.isLogin) {
                location.href = `${process.env.VUE_APP_PREURL}atpapi/cuuser/auth/autoLogin?redirectUrl=${encodeURIComponent(url)}&Authorization=${this.token}&clientId=${this.clientId}`;
            } else {
                this.$utils.goLogin();
            }
        },
        getAmount() {
            this.$store.dispatch({
                type: 'getAmount',
                actId: this.actId
            })
        },
        async getTask() {
            //获取助力任务
            const res = await this.$get(`/atpapi/lottery/powerTask/${this.actId}`);
            if (res.code === "0000") {
                this.powerTask = res.data.length;
                const sign = res.data.find(item => item.settingKey.includes("coutinue_days_prize"));
                const share = res.data.find(item => item.name.includes("微信分享"));
                this.isSign = sign && !sign.isTrue;
                if (share) {
                    const params = {
                        actId: share.actId,
                        actSetId: share.id,
                        imgUrl: share.bannerImg,
                        recordTime: this.$utils.getNowFormatDate(),
                        relType: 0,
                        type: 1
                    };
                    const result = await this.$post(`/atpapi/share/saveRecord`, params);
                    const sign = this.clientId ? "&" : "?";
                    if (result.code === "0000") {
                        this.shareOption.link = `${location.href}${sign}str=${result.data}`;
                    }
                } else {
                    this.shareOption.link = location.href;
                }
            }
        },
        showrule() {
            this.$refs.rule.isShow = true;
        },
        winRecord() {
            if (this.isLogin) {
                this.$router.push({
                    name: "winRecord",
                    query: {
                        id: this.actId,
                        product: this.clientId
                    }
                });
            } else {
                this.$utils.goLogin();
            }
        },
        getMsg() {
            const { starttime } = this.templateInfo;
            const { endtime } = this.templateInfo;
            let value = this.$utils.isDuringDate(starttime, endtime);
            if (this.isPreview) {
                this.$toast("当前为测试预览模式，该功能暂不可用。");
                return false;
            } else if (value == "notBegin") {
                this.$toast("当前活动未开始，该功能暂不可用。");
                return false;
            } else if (value == "hasEnd") {
                this.$toast("当前活动已结束，该功能暂不可用。");
                return false;
            } else {
                return true;
            }
        },
        helpDraw() {
            const message = this.getMsg();
            if (!message) return;
            if (this.isLogin) {
                this.goHelp();
            } else {
                this.$utils.goLogin();
            }
        },
        goHelp() {
            this.$router.push({
                name: "helpDraw",
                query: {
                    id: this.actId,
                    product: this.clientId
                }
            });
        },
    }
}