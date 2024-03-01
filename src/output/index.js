import toNestedPath from './nested-path.js'
import fs from 'fs'
import encodeTitle from './encodeTitle.js'

import path from 'path'

// recursively create any nested directories
const writeFile = function (file, json) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(json, null))
}

const append = function (file, txt) {
  fs.writeFileSync(file, txt, { flag: 'a' })
}

const fileExtension = '.json'

// modes:  nested | flat | ndjson
const output = function (res, title, opts) {
  const { outputDir, outputMode } = opts
  let dir = outputDir
  if (outputMode === 'flat') {
    title = encodeTitle(title)
    dir = path.join(dir, title + fileExtension)
    writeFile(dir, res.body)
  } else if (outputMode === 'encyclopedia' || outputMode === 'encyclopedia-one') {
    title = encodeTitle(res.title)
    let c = title.substring(0, 1).toLowerCase() || '-'
    dir = path.join(dir, c, title + fileExtension)
    writeFile(dir, res.body)
  } else if (outputMode === 'encyclopedia-two' || outputMode === 'encyclopedia-2') {
    title = encodeTitle(res.title)
    let c = title.substring(0, 2).toLowerCase() || '--'
    dir = path.join(dir, c, title + fileExtension)
    writeFile(dir, res.body)
  } else if (outputMode === 'ndjson') {
    dir = path.join(dir, './index.ndjson')
    append(dir, JSON.stringify(res.body) + '\n')
  } else {
    // (nested hash)
    title = encodeTitle(title)
    dir = path.join(dir, toNestedPath(title) + fileExtension)
    writeFile(dir, res.body)
  }
}
export default output
