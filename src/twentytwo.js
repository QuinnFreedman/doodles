function twentytwo(rng) {
    const GRID_SIZE = 50
    const GRID_WIDTH = 20
    const GRID_HEIGHT = 9
    const MARGIN = GRID_SIZE * 2

    const COLOR_BG = "#5f49b8"
    const COLOR_FG1 = "#f54c73" //"#bc4366"
    const COLOR_FG2 = "#f7e1c3"

    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const width = GRID_SIZE * GRID_WIDTH + 2 * MARGIN
    const height = GRID_SIZE * GRID_HEIGHT + 2 * MARGIN

    canvas.width = width
    canvas.height = height

    let shapes = [
        () => {},
        () => {
            ctx.moveTo(0, 0)
            ctx.lineTo(1, 1)
        },
        () => {
            ctx.moveTo(0, 0)
            ctx.lineTo(1, 0)
            ctx.moveTo(1, 1)
            ctx.lineTo(0, 1)
        },
        () => {
            ctx.arc(0, 0, 1, 0, Math.PI / 2)
        },
        // () => {
        //     ctx.arc(.5, .5, .5, 0, 2 * Math.PI)
        // },
    ]

    ctx.lineCap = "round" 
    ctx.lineWidth = 4

    for (let x = 0; x < GRID_WIDTH; x++) {
        for (let y = 0; y < GRID_HEIGHT; y++) {
            ctx.save()
            ctx.translate(x * GRID_SIZE + MARGIN, y * GRID_SIZE + MARGIN)
            ctx.scale(GRID_SIZE, GRID_SIZE)

            // Random rotation
            ctx.translate(.5, .5)
            ctx.rotate(rng.nextRange(4) * Math.PI / 2)
            ctx.translate(-.5, -.5)

            // Draw random shape
            ctx.beginPath()
            rng.choice(shapes)()

            ctx.restore()

            if (rng.nextBool()) {
                ctx.globalCompositeOperation = 'destination-over'
                ctx.strokeStyle = COLOR_FG1
            } else {
                ctx.globalCompositeOperation = 'source-over'
                ctx.strokeStyle = COLOR_FG2
            }

            ctx.stroke()
        }
    }

    ctx.globalCompositeOperation = 'destination-over'
    ctx.fillStyle = COLOR_BG
    ctx.fillRect(0, 0, width, height)

}
