import { initSimpleBar, ProgressBar, Tokens } from '@nathanpb/progress';

class CustomProgressBar {
    constructor(inputSize) {
        this.inputSize = inputSize
        this.lastProgress = 0

        const eta = Tokens.eta({ interval: 1000 }) // returns in seconds
        const elapsedTime = Tokens.elapsedTime({ interval: 1000 }) // returns in seconds

        this.bar = new ProgressBar({ title: "Processing Articles", total: this.inputSize })

        initSimpleBar({
            bar: this.bar,
            template: '$title$ [$bar$] $progress$% | Elapsed $elapsed$ | ETA $eta$',
            stream: process.stdout,
            tokens: {
                title: Tokens.title(),
                bar: Tokens.bar({ length: 15 }),
                eta: (t) => { return this.formatTime(eta(t)); },
                elapsed: (t) => { return this.formatTime(elapsedTime(t)); },
                progress: Tokens.progress({ decimalDigits: 2 })
            }
        });
    }

    formatTime(seconds) {
        seconds = parseInt(seconds, 10)
        if (isNaN(seconds)) {
            return "0:00:00"
        }
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const remainingSeconds = seconds % 60
        return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    tick(totalProgress) {
        this.bar.tick(totalProgress - this.lastProgress)
        this.lastProgress = totalProgress
    }
}

export default CustomProgressBar