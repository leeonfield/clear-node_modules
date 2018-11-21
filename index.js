#!/usr/bin/env node

const log = console.log
const fs = require('fs')
const rootDir = process.argv[2] || process.cwd()

let npmCount = 0

// check ignore directory
function checkIgnore(path) {
  const ignoreList = ['node_modules', '.git']
  if (ignoreList.indexOf(path) !== -1) {
    return true
  }
  return false
}

// check is a directory or not
function checkFile(path) {
  let stat = fs.lstatSync(path)
  if (stat.isFile() || stat.isSymbolicLink()) {
    return true
  }
  return false
}

// remove file & directory
function removeFile(path) {
  if (checkFile(path)) {
    fs.unlinkSync(path)
    return
  } else {
    let pathList = fs.readdirSync(path)
    for (let pathItem of pathList) {
      removeFile(`${path}/${pathItem}`)
    }
    fs.rmdirSync(path)
    return
  }
}

// Recursively get all file 
function getSubfile(path, cb) {
  let pathList = []
  let subFile = []
  if (!path.endsWith('/')) {
    path += '/'
  }
  try {
    subFile = fs.readdirSync(path)
  } catch (e) {
    log('\x1b[31m', `⚠️   Please check directory`)
    return
  }
  pathList = pathList.concat(subFile)
  for (let dirItem of pathList) {
    if (dirItem === 'node_modules') {
      npmCount++
      removeFile(`${path}${dirItem}`)
      log('\x1b[34m', `🔥  Remove ==> ${path}${dirItem}`)
    }
    if (checkIgnore(dirItem) || checkFile(path + dirItem)) {
      continue
    }
    let recDirList = getSubfile(path + dirItem)
    pathList = pathList.concat(recDirList)
  }
  cb && cb()
}

// main function
function init(rootDir) {
  getSubfile(rootDir, function () {
    log('\x1b[32m', `🎉  Successfully remove ${npmCount} node_modules`)
  })
}

init(rootDir)