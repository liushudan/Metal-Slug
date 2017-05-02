let app, view, stage, res, container, monitor

const children = {}

function Master() {
    this.body = new PIXI.Container()
    this.up = new PIXI.Sprite(res.figureMasterUpNormal_1.texture)
    this.down = new PIXI.Sprite(res.figureMasterDown_1.texture)
    
    this.up.anchor.set(.5)
    this.down.anchor.set(.5)
    this.down.y += (this.up.height + this.down.height) * .5 - 18
    this.down.x -= 8
    
    this.body.addChild(this.down, this.up)
    container.addChild(this.body)

    const bounds = this.body.getBounds()
    this.body.pivot.set(
        (bounds.width + bounds.x * 2) >> 1,
        (bounds.height + bounds.y * 2) >> 1
    )
    
    this.breathe = function() {
        let i = 1
        setInterval(() => {
            this.up.texture = res[`figureMasterUpNormal_${i++}`].texture
            i === 4 ? i = 1 : null
        }, 300)
    }
    this.breathe()

    let tid 
    this.walk = function() {
        let i = 1
        tid = setInterval(() => {
            this.down.texture = res[`figureMasterDown_${i++}`].texture
            i === 11 ? i = 1 : null
        }, 120)
    }

    this.stop = function() {
        window.clearInterval(tid)
        this.down.texture = res.figureMasterDown_1.texture
    }
}

function Progress() {
    this.outer = new PIXI.Graphics()
    this.inner = new PIXI.Graphics()

    this.outer.beginFill(0x2196F3)
    this.outer.drawRoundedRect(0, 0, 300, 20, 10)
    this.outer.endFill()

    this.outer.pivot.set(this.outer.width >> 1, this.outer.height >> 1)
    
    
    this.outer.addChild(this.inner)
    container.addChild(this.outer)
}

function init(main) {
    res = main.res
    app = main.app
    view = main.view
    stage = main.stage
    monitor = main.monitor

    container = new PIXI.Container()
    stage.addChild(container)

    children.master = new Master()
    children.progress = new Progress()

    children.progress.outer.y += 60
    children.master.body.x = -(container.width >> 1)

    children.master.walk()

    const bounds = container.getBounds()

    container.pivot.set(
        (bounds.width + bounds.x * 2) >> 1,
        (bounds.height + bounds.y * 2) >> 1
    )

    container.position.set(
        view.width >> 1,
        view.height >> 1
    )

    let percent = 0, w
    const _w = container.width >> 1
    function loop() {
        w = 300 * percent - 8
        if (w > 7) {
            children.progress.inner.clear()
            children.progress.inner.beginFill(0x90CAF9)
            children.progress.inner.drawRoundedRect(0, 0, w, 14, 7)
            children.progress.inner.endFill()
            children.progress.inner.position.set(4, 3)
            children.master.body.x = children.progress.inner.x + w - _w
        }
        percent += .003
        percent = Number(percent.toFixed(4))
        if (percent > 1) {
            app.ticker.remove(loop)
            children.master.stop()
            container.destroy()
            monitor.emit('game show')
        }
    }
    app.ticker.add(loop)
}



export default {
    init
}