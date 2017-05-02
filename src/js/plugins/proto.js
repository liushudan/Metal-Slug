PIXI.Container.prototype.enableDrag = function() {
    const delta = {}
    this.interactive = true
    this
        .on('pointerdown', function(event) {
            event.stopPropagation()
            delta.down = true
            delta.dx = event.data.global.x
            delta.dy = event.data.global.y
            delta.ox = this.x
            delta.oy = this.y
        })
        .on('pointermove', function(event) {
            if (delta.down) {
                this.x = delta.ox + event.data.global.x - delta.dx
                this.y = delta.oy + event.data.global.y - delta.dy
            }
        })
        .on('pointerup', function(event) {
            delta.down = false
            console.log(this.position)
        })
        .on('pointerupoutside', function(event) {
            delta.down = false
        })
}

PIXI.interaction.InteractionManager.prototype
.mapPositionToPoint = function(point, x, y) {
    let rect;

    // IE 11 fix
    if (!this.interactionDOMElement.parentElement) {
        rect = { x: 0, y: 0, width: 0, height: 0 };
    }
    else {
        rect = this.interactionDOMElement.getBoundingClientRect();
    }

    const resolutionMultiplier = navigator.isCocoonJS ? this.resolution : (1.0 / this.resolution);

    point.x = ((x - rect.left) * (this.interactionDOMElement.width / rect.width)) * resolutionMultiplier;
    point.y = ((y - rect.top) * (this.interactionDOMElement.height / rect.height)) * resolutionMultiplier;

    /*
    * 特殊处理
    * 视情况而定
    */
    if (window.GAME_ROTATE === 90) {
        point.y = (1 - (x - rect.left) / rect.width) * this.interactionDOMElement.height * resolutionMultiplier;
        point.x = (y - rect.top) * (this.interactionDOMElement.width / rect.height) * resolutionMultiplier;
    }
}