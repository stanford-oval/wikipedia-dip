// get ready for filename
const encodeTitle = function (title) {
  title = title || ''
  title = title.trim()
  // clobber any potential dot files, or relative paths
  title = title.replace(/^\./g, '\\./')
  // Allow non-ASCII characters, but replace /, null, and control characters
  title = title.replace(/[/\x00-\x1F\x7F]/g, '_')
  // console.log(title)
  // some operating systems complain with long filenames or path names
  if (title.length >= 200) {
    title = title.substr(0, 200) //truncate it
  }
  return title
}
export default encodeTitle
