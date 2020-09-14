function thirtyseven(rng) {
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const CANVAS_WIDTH = 1200;
    const CANVAS_HEIGHT = 800;

    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT

    const RESOLUTION = 1000
    const X_RATE = RESOLUTION
    const Y_RATE = RESOLUTION
    const Y_MAGNITUDE = 1.5
    
    const COLUMN_WIDTH = 200
    const COLUMN_SPACING = 350

    const SPACING = .5
    ctx.strokeStyle = "#0003"

    const NUM_RIBBONS = 3

    for (let column of range(NUM_RIBBONS)) {
        const generators = {
            leftX: new SimplexNoise(rng.nextFloat.bind(rng)),
            rightX: new SimplexNoise(rng.nextFloat.bind(rng)),
            leftY: new SimplexNoise(rng.nextFloat.bind(rng)),
            rightY: new SimplexNoise(rng.nextFloat.bind(rng)),
        }
        const center = (CANVAS_WIDTH - ((NUM_RIBBONS - 1) * COLUMN_SPACING)) / 2 + COLUMN_SPACING * column
        let leftY = rightY = 0
        let row = 0
        while (leftY < CANVAS_HEIGHT || rightY < CANVAS_HEIGHT) {
            let leftX = center - (generators.leftX.noise2D(0, row / X_RATE) + SPACING) * COLUMN_WIDTH
            let rightX = center + (generators.rightX.noise2D(0, row / X_RATE) + SPACING) * COLUMN_WIDTH
            
            leftY += generators.leftY.noise2D(0, row / Y_RATE) * Y_MAGNITUDE / 2 + .5
            rightY += generators.rightY.noise2D(0, row / Y_RATE) * Y_MAGNITUDE / 2 + .5

            //if (row % 5 === 0) {
                ctx.beginPath()
                ctx.moveTo(leftX, leftY)
                ctx.lineTo(rightX, rightY)
                ctx.stroke()
            //}

            row++
        }
    }
    

}
