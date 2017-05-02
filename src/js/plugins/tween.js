function Tween(target, loop) {
    let 
        first = null,
        last = null
    this.to = function(...args) {
        if (first) {
            const tmp = new TWEEN.Tween(target)
            .to(...args)
            last.chain(tmp)
            last = tmp
            if (loop) last.chain(first)
        } else {
            first = new TWEEN.Tween(target)
            .to(...args)
            first.start()
            last = first
        }
        return this
    }

    this.stop = function() {
        first.stop()
    }

    this.start = function() {
        first.start()
    }

    this.easing = function(...args) {
        last.easing(...args)
        return this
    }

    this.update = function(...args) {
        last.onUpdate(...args)
        return this
    }

    this.complete = function(...args) {
        last.onComplete(...args)
        return this
    }
}


window.tween = {
    get(target, loop=false) {
        return new Tween(target, loop)
    }
}