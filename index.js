const fs = require('fs')
const log = console.log
const rootDir = process.argv[2] || './'
let npmCount = 0

const checkIgnore = (dir) => {
  const ignoreList = ['node_modules', '.git']
  if(ignoreList.indexOf(dir) !== -1) {
    return true
  }
  return false
}

const checkDirectory = (dir) => {
  let stat = fs.statSync(dir)
  if(stat.isDirectory()) {
    return true
  }
  return false
}

const removeFile = (path) => {
  if(!checkDirectory(path)) {
    fs.unlinkSync(path)
    return
  } else {
    let pathList = fs.readdirSync(path)
    log(`${path}`)
    for(let pathItem of pathList) {
      removeFile(`${path}/${pathItem}`)
    }
    fs.rmdirSync(path)
  }
}

const getDir = (dir, arr, num) => {
  let count = num || 0
  let dirList = []
  dir += '/'
  let newDir = fs.readdirSync(dir)
  dirList = dirList.concat(newDir)
  for(let dirItem of dirList) {
    if(dirItem === 'node_modules') {
      npmCount ++
      removeFile(`${dir}${dirItem}`)
      log(`🔥 Delete -> ${dir}${dirItem}`)
    }
    if(checkIgnore(dirItem) || !checkDirectory(dir + dirItem)) {
      continue
    }
    let recDirList = getDir(dir + dirItem, dirList, count)
    dirList =dirList.concat(recDirList)
  }
  return dirList
}

const init = (rootDir) => {
  let dirList = getDir(rootDir)
  log(`共删除 ${npmCount} 个 node_modules 模块`)
}

init(rootDir)

