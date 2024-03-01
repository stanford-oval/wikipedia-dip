import encodeTitle from './output/encodeTitle.js'
import toNested from './output/nested-path.js'
import { fileExtension } from './output/index.js'

// a helper function for export as 'wikipedia-dip/make-path'
const makePath = function (str) {
  let title = encodeTitle(str)
  title = toNested(title)
  return title + fileExtension
}
export default makePath