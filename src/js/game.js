import Master from './master'


let app, view, stage, res, container,
    physics, monitor, master

const children = {}

/*function Master() {
    this.body = new PIXI.Container()
    this.up = new PIXI.Sprite(res.figureMasterUpNormal_1.texture)
    this.down = new PIXI.Sprite(res.figureMasterDown_1.texture)
    
    this.up.anchor.set(.5)
    this.down.anchor.set(.5)
    this.down.y += (this.up.height + this.down.height) * .5 - 18
    this.down.x -= 8
    
    this.body.addChild(this.down, this.up)

    const box = new PIXI.Graphics()
    box.lineStyle(1, 0xffffff)
    box.drawRect(0, 0, this.body.width, this.body.height)
    box.pivot.set(box.width * .5, box.height * .5 - 7)

    
    
    // this.body.addChild(box)
    const bounds = this.body.getBounds()
    this.body.pivot.set(
        (bounds.width + bounds.x * 2) * .5,
        (bounds.height + bounds.y * 2) * .5
        // bounds.width * .5,
        // bounds.height * .5
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
}*/


function init(main) {
    res = main.res
    app = main.app
    view = main.view
    stage = main.stage
    monitor = main.monitor
    physics = main.physics

    container = new PIXI.Container()
    container.visible = false
    stage.addChild(container)


    master = new Master(
        [
            res.figureMasterUpNormal_1.texture,
            res.figureMasterUpNormal_2.texture,
            res.figureMasterUpNormal_3.texture,
        ], 
        [    
            res.figureMasterDown_1.texture,
            res.figureMasterDown_2.texture,
            res.figureMasterDown_3.texture,
            res.figureMasterDown_4.texture,
            res.figureMasterDown_5.texture,
            res.figureMasterDown_6.texture,
            res.figureMasterDown_7.texture,
            res.figureMasterDown_8.texture,
            res.figureMasterDown_9.texture,
            res.figureMasterDown_10.texture,
        ]
    )
    children.master = master.body
    master.body.position.set(300, 100)
    container.addChild(master.body)

    children.ground = new PIXI.Graphics()
    children.ground.beginFill(0xe91e63)
    children.ground.drawRect(0, 0, view.width, 30)
    children.ground.endFill()
    children.ground.y = view.height - 30
    container.addChild(children.ground)

    physics.add(children.ground, {
        isStatic: true,
        friction: 1
    })

    children.ground2 = new PIXI.Graphics()
    children.ground2.beginFill(0xe91e63)
    children.ground2.drawRect(0, 0, view.width, 30)
    children.ground2.endFill()
    children.ground2.y = 0
    container.addChild(children.ground2)

    physics.add(children.ground2, {
        isStatic: true,
        friction: 1
    })

    children.cube = new PIXI.Graphics()
    children.cube.beginFill(0x2196f3)
    children.cube.drawRect(0, 0, 100, 100)
    children.cube.endFill()
    children.cube.x = view.width * .5 - 50
    children.cube.y = view.height - 30 - 100
    container.addChild(children.cube)

    physics.add(children.cube, {
        isStatic: true,
        friction: 0,
        frictionStatic: 0
    })

    children.wall = new PIXI.Graphics()
    children.wall.beginFill(0x2196f3)
    children.wall.drawRect(0, 0, 10, view.height)
    children.wall.endFill()
    children.wall.x = view.width - 10
    container.addChild(children.wall)
    physics.add(children.wall, {isStatic: true})

    children.wall2 = new PIXI.Graphics()
    children.wall2.beginFill(0x2196f3)
    children.wall2.drawRect(0, 0, 10, view.height)
    children.wall2.endFill()
    children.wall2.x = 0
    container.addChild(children.wall2)

    physics.add(children.wall2, {isStatic: true})

    app.ticker.add(function() {
        container.children.forEach(item => {
            if (!item._physics) return
            const 
                body = item._physics,
                bounds = {
                    width: body.bounds.max.x - body.bounds.min.x,
                    height: body.bounds.max.y - body.bounds.min.y
                }
            item.x = body.position.x + item._realPivot.x - bounds.width * .5
            item.y = body.position.y + item._realPivot.y - bounds.height * .5
        })

        children.master._velocity.y = 
            children.master._physics.velocity.y
        physics.Body.setVelocity(
            children.master._physics,
            children.master._velocity
        )
    })

    // setInterval(function() {
    //     console.log(
    //         children.master._physics.velocity.y,
    //         children.master._physics.force.y
    //     )
    // }, 1000)

    // 后续操作
    listen()

    // physics.Events.on(physics.engine, 'collisionActive', function(event) {
        // console.log(event)
    // })
}



function listen() {
    const masterBody = children.master._physics

    children.master._velocity = {x: 0, y: 0}
    monitor
        .on('move', function(x) {
            if (x === 0) {
                children.master._velocity.x = 0
                master.stop()
                return
            }

            master.walk()

            if (x > 0) {
                children.master._velocity.x = 3              
            }

            if (x < 0) {
                children.master._velocity.x = -3
            }

        })
        .on('jump', function() {
            children.master._physics.force.y = -.2
            master.stop()
        })
}

function show() {
    container.visible = true
    physics.add(children.master, {
        inertia: Infinity,
        isStatic: false,
        friction: .01,
        frictionStatic: 0
    })
}



export default {
    init,
    show
}