const fs = require('fs')
var path = require('path')
const operations = require('./.qiniu.js')
const config = operations.config
// 公共配置
const qiniu = require('qiniu')
const conf = new qiniu.conf.Config()
conf.zone = qiniu.zone[config.zoneType]
const mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey)
// 文件上传配置
const uptoken = new qiniu.rs.PutPolicy({ scope: config.bucket }).uploadToken(mac)
const formUploader = new qiniu.form_up.FormUploader(conf)
const extra = new qiniu.form_up.PutExtra()
// 文件批量操作配置
const bucketManager = new qiniu.rs.BucketManager(mac, conf)
// 文件刷新配置
const cdnManager = new qiniu.cdn.CdnManager(mac)

// 七牛云上传函数
function uploadFile(infoArr, uploadArr) {
    bucketManager.batch(infoArr, (err, respBody) => {
        if (err) throw err
        respBody.forEach((item, index) => {
            if (item.code === 200 || item.code === 612) {
                if (item.code === 200 && operations.upload.overwrite) {
                    let currentFile = uploadArr[index]
                    console.log(`[upload-exist]: ${currentFile.fileName} already exists.`)
                    console.log(`[delete-ready]: ${currentFile.fileName} ready to remove from qiniu space.`)
                    bucketManager.delete(config.bucket, currentFile.fileName, (err) => {
                        if (err) throw err
                        console.log(`[delete-success]: ${currentFile.fileName} removed from qiniu space success.`)
                        console.log(`[upload-ready]: ${currentFile.fileName} ready to upload.`)
                        formUploader.putFile(uptoken, currentFile.fileName, currentFile.localUrl, extra, (err, res) => {
                            if (err) throw err
                            console.log(`[upload-success]: ${res.key} upload to qiniu success.`)
                            console.log(`[refresh-ready]: ${res.key} ready to refresh.`)
                            refreshFile([`${config.url}/${res.key}`], [res.key])
                        })
                    })
                } else {
                    if (item.code === 200 && !operations.upload.overwrite) {
                        const newName = `${new Date().getTime()}-${uploadArr[index].fileName}`
                        console.log(`[upload-exist]: ${uploadArr[index].fileName} already exists.`)
                        console.log(`[upload-rename]: ${uploadArr[index].fileName} rename to ${newName}.`)
                        uploadArr[index].fileName = newName
                    }
                    console.log(`[upload-ready]: ${uploadArr[index].fileName} ready to upload.`)
                    formUploader.putFile(uptoken, uploadArr[index].fileName, uploadArr[index].localUrl, extra, (err, res) => {
                        if (err) throw err
                        console.log(`[upload-success]: ${res.key} upload to qiniu success.`)
                    })
                }
            } else {
                console.log(`[upload-error]: ${uploadArr[index].fileName}\t${item.code}\t${item.data.error}`)
            }
        })
    })
}

// 七牛云删除函数
function delFile(deleteArr, infoArr) {
    bucketManager.batch(deleteArr, (err, respBody) => {
        if (err) throw err
        respBody.forEach((item, index) => {
            let currentFile = infoArr[index]
            if (item.code === 200) {
                console.log(`[delete-success]: ${currentFile} removed from qiniu space success.`)
            } else if (item.code === 612) {
                console.log(`[delete-notfound]: In qiniu space not found ${currentFile}.`)
            } else {
                console.log(`[delete-error]: ${currentFile}\t${item.code}\t${item.data.error}`)
            }
        })
    })
}

// 七牛云刷新函数
function refreshFile(refreshArr, infoArr) {
    cdnManager.refreshUrls(refreshArr, (err, respBody) => {
        if (err) throw err
        const jsonBody = JSON.parse(respBody)
        if (jsonBody.code == 200) {
            infoArr.forEach(fileName => {
                console.log(`[refresh-success]: ${fileName} refresh success.`)
            })
        } else {
            console.log(`[refresh-error]: ${jsonBody.code}\t${jsonBody.error}`)
        }
    })
}

// 入口函数
function init() {
    if (operations.upload.url) {
        // 文件信息获取数组
        let infoArr = []
        // 文件上传数组
        let uploadArr = []
        const isFolder = fs.lstatSync(operations.upload.url).isDirectory()
        if (isFolder) {
            fs.readdirSync(operations.upload.url).forEach(fileName => {
                uploadArr.push({ fileName: fileName, localUrl: path.join(operations.upload.url, fileName) })
                infoArr.push(qiniu.rs.statOp(config.bucket, fileName))
            })
        } else {
            const currentNameArr = operations.upload.url.split('/')
            const currentName = currentNameArr[currentNameArr.length - 1]
            uploadArr.push({ fileName: currentName, localUrl: operations.upload.url })
            infoArr.push(qiniu.rs.statOp(config.bucket, currentName))
        }
        if (uploadArr.length) {
            uploadFile(infoArr, uploadArr)
        } else {
            if (isFolder) {
                console.log(`[upload-empty]: There is no file in the ${operations.upload.url} directory`)
            }
        }
    }
    if (operations.delete.length) {
        // 文件信息数组
        let infoArr = []
        // 文件删除数组
        let deleteArr = []
        operations.delete.forEach(fileName => {
            deleteArr.push(qiniu.rs.deleteOp(config.bucket, fileName))
            infoArr.push(fileName)
        })
        delFile(deleteArr, infoArr)
    }
    if (operations.refresh.length) {
        // 文件信息数组
        let infoArr = []
        // 文件刷新数组
        let refreshArr = []
        operations.refresh.forEach(fileName => {
            refreshArr.push(`${config.url}/${fileName}`)
            infoArr.push(fileName)
        })
        refreshFile(refreshArr, infoArr) 
    }
}

init()