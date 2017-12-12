require('./check-versions')()

process.env.NODE_ENV = 'production'

var fs = require('fs')
var http = require('http')
var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var package = require('../package.json')
var webpackConfig = require('./webpack.prod.conf')
var versionConfig = config.build.version
var qiniu = require('qiniu')
var qiniuConfig = config.build.qiniu
var qiniuLoaded = 0
var qiniuDeleted = 0
var qiniuArr = []

// build完成log
function finshLog() {
  console.log(chalk.cyan('  Build complete.\n'))
  console.log(chalk.yellow(
    '  Tip: built files are meant to be served over an HTTP server.\n' +
    '  Opening index.html over file:// won\'t work.\n'
  ))
}

// 读取并更新版本号
function updateVersion() {
  let result = ''
  let options = {
    host: versionConfig.host,
    port: versionConfig.port,
    path: versionConfig.get,
    agent: false
  }
  http.get(options, (res) => {
    res.on('data', data => {
      result += data
    }).on('end', () => {
      result = JSON.parse(result)
      if (result.code === '0' && result.versionNumber) {
        var currentVersion = result.versionNumber.split('.')
        currentVersion = currentVersion.map((num, index) => {
          if (index === currentVersion.length - 1) {
            return Number(num) + 1
          } else {
            return num
          }
        }).join('.')
        saveVersion(currentVersion)
      } else {
        console.log(chalk.red(`  Get version failed.\n`))
      }
    })
  }).on('error', () => {
    console.log(chalk.red(`  Get version failed.\n`))
  })
}

// 把版本号保存到数据库和本地
function saveVersion(newVersion) {
  const versionData = JSON.stringify({ 'versionNumber': newVersion, 'id': 1 })
  let result = ''
  let options = {
    host: versionConfig.host,
    port: versionConfig.port,
    method: 'PUT',
    path: versionConfig.put,
    agent: new http.Agent({ keepAlive: true }),
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': versionData.length
    }
  }
  const req = http.request(options, (res) => {
    res.on('data', data => {
      result += data
    }).on('end', () => {
      if (JSON.parse(result).code === '0') {
        fs.readFile('package.json', 'utf8', (err, jsonData) => {
          if (err) throw err
          jsonData = jsonData.replace(`"version": "${package.version}"`, `"version": "${newVersion.replace('v', '')}"`)
          fs.writeFile('package.json', jsonData, (err) => {
            if (err) {
              console.log(chalk.red(err))
            } else {
              console.log(chalk.green(`  ${newVersion} update success.\n`))
              finshLog();
            }
          })
        })
      } else {
        console.log(chalk.red(`  ${newVersion} update failed.\n`))
      }
    })
  }).on('error', () => {
    console.log(chalk.red(`  ${newVersion} update failed.\n`))
  })
  req.write(versionData)
  req.end()
}

// 七牛云上传函数
function uploadFile(key, localFile) {
  // 设置要上传的空间
  var putPolicy = new qiniu.rs.PutPolicy({ scope: qiniuConfig.bucket })
  // 使用用户的Access Key 和 Secret Key生成上传Token
  var mac = new qiniu.auth.digest.Mac(qiniuConfig.accessKey, qiniuConfig.secretKey)
  var uptoken = putPolicy.uploadToken(mac)
  // 构建配置
  var qiniuConf = new qiniu.conf.Config()
  qiniuConf.zone = qiniu.zone[qiniuConfig.zoneType]
  // 文件上传配置
  var formUploader = new qiniu.form_up.FormUploader(qiniuConf)
  var extra = new qiniu.form_up.PutExtra()
  // 开始上传
  formUploader.putFile(uptoken, key, localFile, extra, function (err, ret) {
    if (err) {
      console.log(chalk.red(`  ${ret.key} upload to qiniu failed.`))
    } else {
      console.log(chalk.green(`  ${ret.key} upload to qiniu success.`))
    }
    if (!qiniuLoaded) {
      qiniuArr[qiniuArr.length] = []
    }
    qiniuArr[qiniuArr.length - 1].push(key)
    qiniuLoaded += 1
    if (qiniuLoaded === 4) {
      fs.writeFile('build/qiniu.json', JSON.stringify(qiniuArr), (err) => {
        if (err) throw err
        console.log(chalk.green('  Four files were recorded in the qiniu.json file.'))
      })
      // 使用fs修改html文件
      fs.readFile(config.build.index, 'utf8', (err, htmlData) => {
        if (err) throw err
        htmlData = htmlData.replace(new RegExp('./static/css', 'g'), qiniuConfig.url)
        htmlData = htmlData.replace(new RegExp('./static/js', 'g'), qiniuConfig.url)
        fs.writeFile(config.build.index, htmlData, (err) => {
          if (err) {
            console.log(chalk.red(err))
          } else {
            console.log(chalk.green('  Qiniu accelerated success.\n'))
            updateVersion()
          }
        })
      })
    }
  })
}

// 本地文件读取
function readLocalFile() {
  // 使用七牛云上传css文件
  fs.readdir(path.join(config.build.assetsRoot, `${config.build.assetsSubDirectory}/css`), (err, files) => {
    if (err) throw err
    files.forEach(fileName => {
      if (fileName.endsWith('.css') && fileName.startsWith('app.')) {
        uploadFile(fileName, path.join(config.build.assetsRoot, `${config.build.assetsSubDirectory}/css/${fileName}`))
      }
    })
  })
  // 使用七牛云上传js文件
  fs.readdir(path.join(config.build.assetsRoot, `${config.build.assetsSubDirectory}/js`), (err, files) => {
    if (err) throw err
    files.forEach(fileName => {
      if (fileName.endsWith('.js') && (fileName.startsWith('manifest.') || fileName.startsWith('vendor.') || fileName.startsWith('app.'))) {
        uploadFile(fileName, path.join(config.build.assetsRoot, `${config.build.assetsSubDirectory}/js/${fileName}`))
      }
    })
  })
}

// 七牛云删除函数
function delFile(item, index) {
  var mac = new qiniu.auth.digest.Mac(qiniuConfig.accessKey, qiniuConfig.secretKey)
  var qiniuConf = new qiniu.conf.Config()
  qiniuConf.zone = qiniu.zone[qiniuConfig.zoneType]
  var bucketManager = new qiniu.rs.BucketManager(mac, qiniuConf)
  bucketManager.delete(qiniuConfig.bucket, item, function (err) {
    qiniuDeleted += 1
    if (err) {
      console.log(chalk.red(`  ${item} file deletion failed.`))
    } else {
      console.log(chalk.green(`  The ${item} file has been deleted from qiniu.`))
    }
    if (qiniuDeleted && qiniuDeleted % 4 === 0) {
      qiniuArr.shift()
      console.log(chalk.green(`  Four file records were deleted in the qiniu.json file.\n`))
      if (!qiniuConfig.recordCount && !qiniuArr.length || qiniuConfig.recordCount) {
        readLocalFile()
      }
    }
  })
}

// 七牛云入口函数
function qiniuMain() {
  try {
    qiniuArr = JSON.parse(fs.readFileSync('build/qiniu.json', 'utf8'))
  } catch (error) {
    console.log(chalk.green('  No qiniu.json waiting to be created.'))
  }
  if (qiniuArr.length) {
    if (!qiniuConfig.recordCount) {
      qiniuArr.forEach(item => {
        item.forEach((child, index) => {
          delFile(child, index)
        })
      })
    } else {
      if (qiniuArr.length >= qiniuConfig.recordCount) {
        qiniuArr[0].forEach((first, index) => {
          delFile(first, index)
        })
      } else {
        readLocalFile()
      }
    }
  } else {
    readLocalFile()
  }
}

// build主代码
function buildMain(state) {
  var spinner = ora('building for production...')
  spinner.start()

  rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
    if (err) throw err
    webpack(webpackConfig, function (err, stats) {
      spinner.stop()
      if (err) throw err
      process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + '\n\n')
      if(state) {
        qiniuMain()
      } else {
        recoverFile()
      }
    })
  })
}

// 验证CDN服务是否可用
// function authCDN() {
//   console.log(chalk.green('  Verifying whether CDN and qiniu are available...'))
//   let result = ''
//   let options = {
//     host: 'cdn.staticfile.org',
//     port: 80,
//     agent: false
//   }
//   http.get(options, (res) => {
//     res.on('data', data => {
//       result += data
//     }).on('end', () => {
//       try {
//         result = JSON.parse(result)
//       } catch (error) {
//         console.log(chalk.red('  CDN is not available.'))
//       } finally {
//         if (result.error) {
//           console.log(chalk.green('  CDN is available.'))
//           authQiniu()
//         } else {
//           changeMode()
//         }
//       }
//     })
//   }).on('error', err => {
//     console.log(chalk.red('  CDN is not available.'))
//     changeMode()
//   })
// }

// 验证七牛云服务是否可用
function authQiniu() {
  console.log(chalk.green('  Verifying whether qiniu are available...'))
  let result = ''
  let options = {
    host: 'ot12u0ynq.bkt.clouddn.com',
    port: 80,
    agent: false
  }
  http.get(options, (res) => {
    res.on('data', data => {
      result += data
    }).on('end', () => {
      try {
        result = JSON.parse(result)
      } catch (error) {
        console.log(chalk.red('  Qiniu is not available.'))
      } finally {
        if (result.error) {
          console.log(chalk.green('  Qiniu is available.\n'))
          buildMain(true)
        } else {
          changeMode()
        }
      }
    })
  }).on('error', err => {
    console.log(chalk.red('  Qiniu is not available.'))
    changeMode()
  })
}

// 验证七牛云或CDN失败更改文件
function changeMode() {
  fs.readFile('src/assets/common.scss', 'utf8', (err, htmlData) => {
    if (err) throw err
    htmlData = htmlData.replace(new RegExp('http://ot12u0ynq.bkt.clouddn.com', 'g'), `http://${versionConfig.host}:${versionConfig.port}/hnaData/static/image`)
    fs.writeFile('src/assets/common.scss', htmlData, (err) => {
      if (err) {
        console.log(chalk.red(err))
      } else {
        console.log(chalk.green('  scss change success.'))
        fs.readFile('src/constants/content.js', 'utf8', (err, htmlData) => {
          if (err) throw err
          htmlData = htmlData.replace(new RegExp('http://ot12u0ynq.bkt.clouddn.com', 'g'), `http://${versionConfig.host}:${versionConfig.port}/hnaData/static/image`)
          fs.writeFile('src/constants/content.js', htmlData, (err) => {
            if (err) {
              console.log(chalk.red(err))
            } else {
              console.log(chalk.green('  constant change success.'))
              fs.readFile('index.html', 'utf8', (err, htmlData) => {
                if (err) throw err
                htmlData = htmlData.replace(new RegExp('http://ot12u0ynq.bkt.clouddn.com', 'g'), `http://${versionConfig.host}:${versionConfig.port}/hnaData/static/lib`)
                fs.writeFile('index.html', htmlData, (err) => {
                  if (err) {
                    console.log(chalk.red(err))
                  } else {
                    console.log(chalk.green('  html change success.\n'))
                    buildMain()
                  }
                })
              })
            }
          })
        })
      }
    })
  })
}

// build完成后还原文件
function recoverFile() {
  fs.readFile('src/assets/common.scss', 'utf8', (err, htmlData) => {
    if (err) throw err
    htmlData = htmlData.replace(new RegExp(`http://${versionConfig.host}:${versionConfig.port}/hnaData/static/image`, 'g'), 'http://ot12u0ynq.bkt.clouddn.com')
    fs.writeFile('src/assets/common.scss', htmlData, (err) => {
      if (err) {
        console.log(chalk.red(err))
      } else {
        console.log(chalk.green('  scss recover success.'))
        fs.readFile('src/constants/content.js', 'utf8', (err, htmlData) => {
          if (err) throw err
          htmlData = htmlData.replace(new RegExp(`http://${versionConfig.host}:${versionConfig.port}/hnaData/static/image`, 'g'), 'http://ot12u0ynq.bkt.clouddn.com')
          fs.writeFile('src/constants/content.js', htmlData, (err) => {
            if (err) {
              console.log(chalk.red(err))
            } else {
              console.log(chalk.green('  constant recover success.'))
              fs.readFile('index.html', 'utf8', (err, htmlData) => {
                if (err) throw err
                htmlData = htmlData.replace(new RegExp(`http://${versionConfig.host}:${versionConfig.port}/hnaData/static/lib`, 'g'), 'http://ot12u0ynq.bkt.clouddn.com')
                fs.writeFile('index.html', htmlData, (err) => {
                  if (err) {
                    console.log(chalk.red(err))
                  } else {
                    console.log(chalk.green('  html recover success.\n'))
                    updateVersion()
                  }
                })
              })
            }
          })
        })
      }
    })
  })
}

authQiniu()