// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist/'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
    qiniu: {
      url: 'http://ot12u0ynq.bkt.clouddn.com', // 七牛云空间外链域名
      accessKey: 'Vp3gaIvLOJem5_fwP30pUurbrpYa2yRUuB2Fq8m3', // 七牛云用户的accessKey
      secretKey: 'bxG78WKMgtRk7q7yCMPMKw8ja-B3RwRUySKiV6fm', // 七牛云用户的secretKey
      bucket: 'test001', // 七牛云用户的存储空间名称
      zoneType: 'Zone_z2', // 七牛云机房，Zone_z0: 华东, Zone_z1: 华北, Zone_z2: 华南, Zone_na0: 北美.
      recordCount: 2 // 保存的静态资源记录次数
    },
    version: {
      host: 'sca.hnagroup.com',
      port: '80',
      put: '/hnaData/api/v3/h5version',
      get: '/hnaData/api/v3/h5version/getLatestVersion'
    }
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      // '/hnaData': 'http://sca.hnagroup.com' // 正式
      '/hnaData': 'http://219.143.207.146:8088' // 测试
      // '/hnaData': 'http://10.70.79.26:8080' // 测试g
      // '/api': 'http://172.16.0.240:8080' // 帅
      // '/api': 'http://172.16.6.104:8080' // 磊
      // '/api': 'http://172.16.7.53:8080' //  冯
      // '/api': 'http://10.167.3.46:8080' // 帅g
      // '/api': 'http://10.167.3.74:8080' // 龙g
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
