// game.js
let app, view, stage, res, container

const children = {}

function init(main) {
    res = main.res
    app = main.app
    view = main.view
    stage = main.stage

    container = new PIXI.Container()
    container.visible = false
    stage.addChild(container)

    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff', '#00ff99'], // gradient
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440
    })

    children.slogan = new PIXI.Text('敬请期待！！！', style);
    children.slogan.anchor.set(.5)

    container.addChild(children.slogan)

    container.position.set(
        view.width >> 1,
        view.height >> 1
    )
}

function show() {
    container.visible = true
    let s = .5
    children.slogan.scale.set(.5)
    tween.get(children.slogan)
    .to({rotation: Math.PI * 2}, 1000)
    .update(function() {
        s += .5 / 60
        this.scale.set(s)
    })
    .complete(function() {
        tween.get(children.slogan)
        .to({}, 200)
        .update(function() {
            s += .5 / 12
            this.scale.set(s)
        })
        .complete(function() {
            tween.get(children.slogan)
            .to({}, 200)
            .update(function() {
                s -= .5 / 12
                this.scale.set(s)
            })
        })
    })
}

export default {
    init,
    show
}