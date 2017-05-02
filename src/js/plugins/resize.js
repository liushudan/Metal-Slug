
function resize(view) {
    let
        w = window.innerWidth,
        h = window.innerHeight,
        l, t
    const GAME_RATIO = view.width / view.height
    // 横屏
    if (window.innerWidth / window.innerHeight >= 1) {
        view.style.transform = 'rotate(0)'
        window.GAME_ROTATE = 0
        if (window.innerWidth / window.innerHeight >= GAME_RATIO) {
            w = h * GAME_RATIO
        } else {
            h = w / GAME_RATIO
        }
        h < window.innerHeight ? t = (window.innerHeight - h) * .5 : t = 0
        w < window.innerWidth ? l = (window.innerWidth - w) * .5 : l = 0
    } else {
        view.style.transform = 'rotate(90deg)'
        window.GAME_ROTATE = 90

        w = window.innerHeight
        h = window.innerWidth
        if (window.innerHeight / window.innerWidth >= GAME_RATIO) {
            w = h * GAME_RATIO
        } else {
            h = w / GAME_RATIO
        }
        h < window.innerWidth ? l = h + ((window.innerWidth - h) * .5) : l = h
        w < window.innerHeight ? t = (window.innerHeight - w) * .5 : t = 0
    }
    view.style.top = `${t}px`
    view.style.left = `${l}px`
    view.style.width = `${w}px`
    view.style.height = `${h}px`
}

if (!PIXI.extras.resize) PIXI.extras.resize = resize