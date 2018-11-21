#!/usr/bin/env node

const log = console.log
const fs = require('fs')
const rootDir = process.argv[2] || './'

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
function checkDirectory(path) {
  let stat = fs.statSync(path)
  if (stat.isDirectory()) {
    return true
  }
  return false
}

// remove file & directory
function removeFile(path) {
  if (!checkDirectory(path)) {
    fs.unlinkSync(path)
    return
  } else {
    let pathList = fs.readdirSync(path)
    for (let pathItem of pathList) {
      removeFile(`${path}/${pathItem}`)
    }
    fs.rmdirSync(path)
  }
}

// Recursively get all file 
function getSubfile(path) {
  let pathList = []
  if (!path.endsWith('/')) {
    path += '/'
  }
  let subFile = fs.readdirSync(path)
  pathList = pathList.concat(subFile)
  for (let dirItem of pathList) {
    if (dirItem === 'node_modules') {
      npmCount++
      removeFile(`${path}${dirItem}`)
      log('\x1b[34m', `🔥  Remove ==> ${path}${dirItem}`)
    }
    if (checkIgnore(dirItem) || !checkDirectory(path + dirItem)) {
      continue
    }
    let recDirList = getSubfile(path + dirItem)
    pathList = pathList.concat(recDirList)
  }
}

// main function
function init(rootDir) {
  getSubfile(rootDir)
  log('\x1b[32m', `Successfully remove ${npmCount} node_modules`)
}

init(rootDir)