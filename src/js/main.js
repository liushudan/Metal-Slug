import './plugins'
import assets from './assets'
import progress from './progress'
import game from './game'
import controller from './controller'
import physics from './physics'

const main = {}

const bgm = new Howl({
    src: ['res/audio/bgm.mp3'],
    loop: true
})



window.addEventListener('load', event => {
    const app = new PIXI.Application({
        width: 852,
        height: 480,
        transparent: true
    })

    main.app = app
    main.view = app.view
    main.stage = app.stage
    main.monitor = new PIXI.utils.EventEmitter()
    main.physics = physics

    document.body.appendChild(app.view)

    // 始终横屏
    PIXI.extras.resize(app.view)
    window.addEventListener('resize', event => {
        PIXI.extras.resize(app.view)
    })

    PIXI.loader.add(assets).load((loader, res) => {
        main.res = res
        // progress.init(main)
        game.init(main)
        game.show()
        controller.init(main)
    })

    main.monitor
        .on('game show', function() {
            game.show()
            // if (typeof WeixinJSBridge !== 'undefined') {
            //     WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
            //         bgm.play()
            //     })
            // } else bgm.play()
        })

    app.ticker.add(function() {
        TWEEN.update()
    })
})