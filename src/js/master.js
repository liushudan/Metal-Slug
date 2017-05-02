import Role from './role'


class Master extends Role {
    constructor(bodies=[], legs=[]) {
        super()
        this.loadTextures(bodies, legs)

        this.up.texture = bodies[0]
        this.down.texture = legs[0]

        this._bodies = bodies
        this._legs = legs

        this.up.anchor.set(.5)
        this.down.anchor.set(.5)

        this.down.y += (this.up.height + this.down.height) * .5 - 18
        this.down.x -= 8

        this.body.addChild(this.down, this.up)

        // 呼吸
        this.breathe()

        // 移动
        this._walk()
    }

    loadTextures(bodies=[], legs=[]) {
        this.bodies = this._createGenerator(bodies)()
        this.legs = this._createGenerator(legs)()
    }

    _createGenerator(arr=[]) {
        return function* () {
            let i = 0
            while(1) {
                i === arr.length && (i = 0)
                yield arr[i++]
            }
        }
    }

    breathe() {
        setInterval(() => {
            this.up.texture = this.bodies.next().value
        }, 300)
    }

    _walk() {
        setInterval(() => {
            if (this.state === 'walk') {
                this.down.texture = this.legs.next().value
            } else if (this.state === 'stop') {
                this.down.texture = this._legs[0]
            }
        }, 120)
    }

    walk() {
        this.state = 'walk'
    }

    stop() {
        this.state = 'stop'
    }
}

export default Master