let app, view, stage, res, container, monitor

const children = {}

const 
    R1 = 100,
    R2 = 40,
    deltaR = R1 - R2

function init(main) {
    res = main.res
    app = main.app
    view = main.view
    stage = main.stage
    monitor = main.monitor

    container = new PIXI.Container()
    stage.addChild(container)

    // 轨迹球活动区域
    children.outerBall = new PIXI.Graphics()
    children.outerBall.beginFill(0xffffff, .3)
    children.outerBall.drawCircle(0, 0, R1)
    children.outerBall.endFill()
    container.addChild(children.outerBall)

    // 轨迹球
    children.innerBall = new PIXI.Graphics()
    children.innerBall.beginFill(0x2196F3)
    children.innerBall.drawCircle(0, 0, R2)
    children.innerBall.endFill()
    children.outerBall.addChild(children.innerBall)

    container.position.set(R1, view.height - R1)

    // 跳跃键

    children.jump = new PIXI.Graphics()
    children.jump.beginFill(0xe91e63)
    children.jump.drawCircle(0, 0, R2)
    children.jump.endFill()
    container.addChild(children.jump)

    children.jump.position.set(662, -8)

    // children.jump.enableDrag()

    // 后续操作
    listen()
}


function listen() {
    // 跳跃键
    children.jump.interactive = true
    children.jump.on('pointertap', function() {
        monitor.emit('jump')
    })


    // 轨迹球
    children.innerBall.interactive = true
    children.innerBall._delta = {}
    children.innerBall
        .on('pointerdown', function(event) {
            this._down = true
            this._delta.ox = this.x
            this._delta.oy = this.y
            this._delta.dx = event.data.global.x
            this._delta.dy = event.data.global.y
        })

        .on('pointermove', function(event) {
            if (!this._down) return

            this.x = this._delta.ox + event.data.global.x - this._delta.dx
            this.y = this._delta.oy + event.data.global.y - this._delta.dy
            
            if (Math.pow(this.x, 2) + Math.pow(this.y, 2) > deltaR * deltaR) {
                /*
                * 防止轨迹球溢出
                * 计算交点
                */
                
                if (this.x === 0) {
                    const sign = this.y < 0 ? -1 : 1
                    this.y = deltaR * sign
                } else {
                    const 
                        k = this.y / this.x,
                        sign = this.x < 0 ? -1 : 1
                    this.x = deltaR / Math.sqrt(k * k + 1) * sign
                    this.y = this.x * k
                }
            }

            // 发送移动事件
            monitor.emit('move', this.x, this.y)
        })

        .on('pointerup', innerBallUp)
        .on('pointerupoutside', innerBallUp)

    function innerBallUp() {
        this._down = false
        monitor.emit('move', 0)
        tween.get(this)
            .to({x: 0, y: 0}, 200)
    }
}

export default {
    init
}