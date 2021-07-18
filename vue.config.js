/*
 * @Date: 2020-02-02 11:35:34
 * @LastEditors: nick888
 * @LastEditTime: 2020-10-23 11:38:03
 */
const path = require('path')
module.exports = {
  lintOnSave: false, //是否开启eslint保存检测
  runtimeCompiler: true,
  publicPath: process.env.VUE_APP_URL, // 路由基本路径
  outputDir: process.env.outputDir, // 打包输出文件基本路径
  indexPath: 'index.html',
  productionSourceMap:false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', path.join(__dirname, 'src'))
      .set('assets', path.join(__dirname,'src/assets'))
      .set('components', path.join(__dirname,'src/components'))
      .set('views', path.join(__dirname,'src/views'))
    // 去除生产环境console
    config.optimization.minimizer('terser').tap((args) => {
      args[0].terserOptions.compress.drop_console = true
      return args
    })
  },
  //启用 gzip 压缩可大幅缩减传输资源大小，从而缩短资源下载时间，减少首次白屏时间，提升用户体验。
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new CompressionPlugin({
          // gzip压缩配置
          test: /\.js$|\.html$|\.css/, // 匹配文件名
          threshold: 10240, // 对超过10kb的数据进行压缩
          deleteOriginalAssets: false, // 是否删除原文件
        })
      )
    }
  },
  devServer: {
    // open:true,
    disableHostCheck: true,
    proxy: {
      // 配置跨域
      '/atpapi': {
        // 代理接口前缀为/api的请求
        target: 'http://h5test.wostore.cn/atpapi/', // 需要代理到的目标地址
        ws: true,  // 代理的WebSockets
        changOrigin: true, // 是否跨域
        pathRewrite: {
          '^/atpapi': '' // 重写路径
        },
      }
    }
  },
}