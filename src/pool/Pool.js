import path from 'path'
import fs from 'fs'
import EventEmitter from 'events'
import { Worker } from 'worker_threads'
import { fileURLToPath } from 'url'
import { JSONfn } from 'jsonfn'
import { checkFile, makeDir } from './prep.js'
import getSummary from './summary.js'
import { blue, yellow } from '../_lib.js'
import CustomProgressBar from './progressbar.js'


const dir = path.dirname(fileURLToPath(import.meta.url))

class Pool extends EventEmitter {
  constructor(opts) {
    super(opts)
    checkFile(opts.input)
    this.opts = opts
    this.workers = []
    this.methods = JSONfn.stringify(opts)
    // create the results directory
    makeDir(opts.outputDir)
    // start the logger
    this.heartbeat = setInterval(() => this.beat(), this.opts.heartbeat)
    this.status = [{}]
    this.progressBar = new CustomProgressBar(opts.totalSize)
  }
  // kick off each worker, on a part of the file
  start() {
    let bytes = fs.statSync(this.opts.input)['size']
    const gb = parseFloat((bytes / (1024 * 1024 * 1024)).toFixed(1)) + 'GB'
    console.log(`\n\nStarting ${blue(this.opts.workers)} workers on the ${yellow(gb)} file`)

    for (let i = 0; i < this.opts.workers; i += 1) {
      // Create each worker.
      let info = {
        workerData: {
          index: i,
          input: this.opts.input,
          outputDir: this.opts.outputDir,
          libPath: this.opts.libPath,
          outputMode: this.opts.outputMode,
          namespace: this.opts.namespace,
          redirects: this.opts.redirects,
          disambiguation: this.opts.disambiguation,
          wtfPath: this.opts.wtfPath,
          workers: this.opts.workers,
          methods: this.methods
        }
      }
      const file = path.join(dir, '../worker/index.js')
      const worker = new Worker(file, info)
      // receive status of each worker, when requested
      worker.on('message', (msg) => {
        this.status[msg.status.index] = msg.status
      })
      worker.on('error', (err) => console.error(err))
      worker.on('exit', (code) => {
        console.log('Worker done', code)
      })
      this.workers.push(worker)
    }
  }
  stop() {
    console.log('Cleaning up...')
    clearInterval(this.heartbeat)
    // this.workers.forEach(w => w.emit('exit'))
    // this.emit('exit');
    this.emit('end')
    this.removeAllListeners()
    // log some stats
    getSummary(this.status)
    // todo: figure out how to exit naturally
    setTimeout(() => {
      process.exit()
    }, 500)
  }
  // heartbeat status logger
  beat() {
    this.workers.forEach((w) => w.postMessage('thump'))
    setTimeout(() => {
      // console.log(this.status)
      let totalProgress = this.status.reduce((sum, o) => o.processed !== undefined ? sum + o.processed : sum, 0)
      this.progressBar.tick(totalProgress)

      // are they all done?
      let allDone = this.status.every((obj) => obj.finished === true)
      if (allDone === true) {
        this.stop()
      }
    }, 500)
  }
}

export default Pool
