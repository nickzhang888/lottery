# 活动模板平台-用户H5-转盘

# 代码运行
```
npm install // 安装依赖
npm run serve // 开发模式
npm run build // 线上模式
```

# 业务流程
1. 从url上获取活动code，通过接口查询对应模板字符串
2. 通过utils/utils.js中的JSON2Style方法实现样式转换，移动端适配采用rem（1rem=100px）
3. 此工程（h5-lottery)只渲染转盘模板。后台生成活动页对应h5地址时，需要根据 转盘/展示页 两种类型区分不同url

# TODO
1. 活动未开始、已结束等各种状态对应页面，判断与跳转
2. 转盘抽奖逻辑，旋转，弹窗显示等接口联调