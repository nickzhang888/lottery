/*
 * @Date: 2020-03-02 11:35:34
 * @LastEditors: Pengyr
 * @LastEditTime: 2020-04-23 11:38:03
 */
module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  publicPath: process.env.VUE_APP_URL, // 路由基本路径
  outputDir: process.env.outputDir, // 打包输出文件基本路径
  indexPath: 'index.html',
  devServer: {
    disableHostCheck: true,
    proxy: {
      // 配置跨域
      '/atpapi': {
        // 代理接口前缀为/api的请求
        target: 'http://h5test.wostore.cn/atpapi/', // 需要代理到的目标地址
        ws: true,
        changOrigin: true, // 是否跨域
        pathRewrite: {
          '^/atpapi': '' // 重写路径
        }
      }
    }
  }
}