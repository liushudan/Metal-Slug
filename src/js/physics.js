const
    Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Render = Matter.Render

const 
    engine = Engine.create()

// const render = Render.create({
//         element: document.body,
//         engine: engine
//     })

// engine.world.gravity.y = 0

Engine.run(engine)
// Render.run(render)

const pivot = {}

function getPivot(item) {
    if (item.pivot.x === 0 && item.pivot.y === 0 && item.anchor) {
        pivot.x = item.anchor.x * item.width
        pivot.y = item.anchor.y * item.height
    } else {
        const bounds = item.getBounds()
        pivot.x = item.position.x - bounds.x
        pivot.y = item.position.y - bounds.y
    }

    if (item._realPivot) {
        item._realPivot.x = pivot.x
        item._realPivot.y = pivot.y
    } else {
        item._realPivot = {
            x: pivot.x,
            y: pivot.y
        }
    }
}


function enable(...args) {
    for (const item of args) {
        if (item instanceof PIXI.Container) getPivot(item)
        
        const bounds = item.getBounds()
        
        const body = Bodies.rectangle(
            bounds.x + bounds.width * .5 - pivot.x,
            bounds.y + bounds.height * .5 - pivot.y,
            bounds.width,
            bounds.height
        )
        console.log(body.position)
        item._physics = body
        World.add(engine.world, body)
    }
}

function add(item, options) {
    if (item instanceof PIXI.Container) getPivot(item)
        
    const bounds = item.getBounds()
    
    const body = Bodies.rectangle(
        bounds.x + bounds.width * .5 - pivot.x,
        bounds.y + bounds.height * .5 - pivot.y,
        bounds.width,
        bounds.height,
        options || {}
    )
    item._physics = body
    World.add(engine.world, body)
}

/*Matter.Events.on(engine, 'afterUpdate', function() {
    engine.world.bodies.forEach(body => {
        const 
            pivot = {},
            item = body._link

        if (item.pivot.x === 0 && item.pivot.y === 0 && item.anchor) {
            pivot.x = item.anchor.x * item.width
            pivot.y = item.anchor.y * item.height
        } else {
            pivot.x = item.pivot.x
            pivot.y = item.pivot.y
        }

        const bounds = {
            width: body.bounds.max.x - body.bounds.min.x,
            height: body.bounds.max.y - body.bounds.min.y
        }
        item.x = body.position.x + pivot.x - bounds.width * .5
        item.y = body.position.y + pivot.y - bounds.height * .5

        // console.log(body)
    })
})*/

export default {
    engine,
    enable,
    add,
    World,
    Bodies,
    Body
}