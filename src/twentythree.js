function twentythree(rng) {

    /**
     * The distance from a point p to a line defined by two other points p1, p2
     */
    /*
    function distance(p1, p2, p) {
        const [x1, y1] = p1
        const [x2, y2] = p2
        const [x0, y0] = p

        const num = Math.abs( (y2-y1) * x0 - (x2-x1) * y0 + x2*y1 - y2*x1 )
        const denom = Math.sqrt( (y2-y1)**2 + (x2-x1)**2 )
        return num / denom
    }
    */


    const GRID_SIZE = 200
    const GRID_WIDTH = 4
    const GRID_HEIGHT = 3
    const MARGIN = GRID_SIZE / 8

    const PALETTE_DARK = [
        "#7B4B94",
        "#7D82B8",
    ]

    const PALETTE_LIGHT = [
        "#B7E3CC",
        "#C4FFB2",
        "#D6F7A3",
    ]

    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const width = (GRID_SIZE + MARGIN) * GRID_WIDTH + MARGIN
    const height = (GRID_SIZE + MARGIN) * GRID_HEIGHT + MARGIN

    canvas.width = width
    canvas.height = height

    for (let x = 0; x < GRID_WIDTH; x++) {
        for (let y = 0; y < GRID_HEIGHT; y++) {
            // Pick forground, background colors            
            let fg, bg
            if (rng.nextBool()) {
                fg = rng.choice(PALETTE_LIGHT)
                bg = rng.choice(PALETTE_DARK)
            } else {
                fg = rng.choice(PALETTE_DARK)
                bg = rng.choice(PALETTE_LIGHT)
            }

            // Draw tile background
            ctx.save()
            ctx.translate(
                x * (GRID_SIZE + MARGIN) + MARGIN,
                y * (GRID_SIZE + MARGIN) + MARGIN
            )
            ctx.scale(GRID_SIZE, GRID_SIZE)

            ctx.beginPath()
            ctx.rect(0, 0, 1, 1)
            ctx.restore()
            ctx.fillStyle = fg
            ctx.fill()

            // Generate random points
            let points = []
            for (let j = 0; j < 1; j++) {
                points[j] = []
                for (let i = 0; i < 13; i++) {
                    points[j][i] = [rng.nextFloat(), rng.nextFloat()]
                    if (i > 0) {
                        ctx.moveTo(...points[j][i - 1])
                        ctx.lineTo(...points[j][i])
                    }
                }
            }

            // Draw points in tile
            ctx.save()
            ctx.translate(
                x * (GRID_SIZE + MARGIN) + MARGIN,
                y * (GRID_SIZE + MARGIN) + MARGIN
            )
            ctx.scale(GRID_SIZE, GRID_SIZE)
            ctx.beginPath()

            for (let path of points) {
                roundPoly(ctx, path.map(([x, y]) => ({x, y})), 1)
            }

            ctx.restore()
            ctx.fillStyle = bg
            ctx.fill()
        }
    }

}

