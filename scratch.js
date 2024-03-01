import dip from 'wikipedia-dip'

const afwiki = `~/afwiki-latest-pages-meta-current.xml`

const opts = {
  input: afwiki,
  namespace: 1,
  outputDir: '/Users/spencer/Desktop/dip',
  outputMode: 'encyclopedia',
  parse: function (doc) {
    return doc.title()
  }
}

await dip(opts).then(() => {
  console.log('done')
})

// import getPath from 'wikipedia-dip/nested-path'
// let file = getPath('Dennis Rodman')
// console.log(file)
// ./BE/EF/Dennis_Rodman.json
