function twentyfive(rng) {
    const TEXTURE_URI = "data:image/png;base64,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"

    /**
     * Given a set of points that define a polygon, returns a new set of
     * points with added jittering/noise along the lines.
     */
    function jitterPoly(points, detail, magnitude, noKinks) {
        if (detail < 0 || detail > 1) {
            throw "Jitter detail must be between 0 and 1"
        }
        if (magnitude < 0 || magnitude > 1) {
            throw "Jitter magnitude must be between 0 and 1"
        }

        let perimiterLength = 0
        for (let i = 0; i < points.length; i++) {
            perimiterLength += distance(points[i], points[(i + 1) % points.length])
        }

        const numExtraPoints = perimiterLength / 10 * detail
        const extraPointLocations = []
        for (let i = 0; i < numExtraPoints; i++) {
            extraPointLocations.push(rng.nextFloat() * perimiterLength)
        }
        extraPointLocations.sort((a, b) => a - b)

        let totalDist = 0
        let ptr = 0
        const resultPoints = [points[0]]
        for (let i = 1; i < points.length + 1; i++) {
            const fromPoint = points[i-1]
            const toPoint = points[i % points.length]
            const distBetween = distance(fromPoint, toPoint)
            const totalDistToLastPoint = totalDist
            totalDist += distBetween
            
            while (extraPointLocations[ptr] < totalDist) {
                const distToMove = extraPointLocations[ptr] - totalDistToLastPoint
                resultPoints.push(moveToward(fromPoint, toPoint, distToMove))
                ptr++
            }

            resultPoints.push(toPoint)
        }

        const maxDistort = magnitude * perimiterLength / 20
        if (noKinks) {
            let centerPoint = [0, 0]
            for (let p of points) {
                centerPoint[0] += p[0]
                centerPoint[1] += p[1]
            }
            centerPoint[0] /= points.length
            centerPoint[1] /= points.length
            for (let i = 0; i < resultPoints.length; i++) {
                const distort = (rng.nextFloat() - .5) * maxDistort
                resultPoints[i] = moveToward(resultPoints[i], centerPoint, distort)
            }
        } else {
            for (let i = 0; i < resultPoints.length; i++) {
                resultPoints[i][0] += (rng.nextFloat() - .5) * maxDistort
                resultPoints[i][1] += (rng.nextFloat() - .5) * maxDistort
            }
        }

        return resultPoints
    }

    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const GRID_WIDTH = 5
    const GRID_HEIGHT = 3
    const CELL_WIDTH = 150
    const CELL_HEIGHT = 200
    const MARGIN = 20

    const width = (CELL_WIDTH + MARGIN) * GRID_WIDTH + MARGIN
    const height = (CELL_HEIGHT + MARGIN) * GRID_HEIGHT + MARGIN

    canvas.width = width
    canvas.height = height
    
    const palette = ["#e6950e", "#ff5302", "#d53d13", "#1a6681", "#3a1812"]
    // const palette = ["#f98720", "#fccc06", "#991560", "#f53930", "#0366cb"]

    for (let x = 0; x < GRID_WIDTH; x++) {
        for (let y = 0; y < GRID_HEIGHT; y++) {
            ctx.save()
            ctx.translate(
                x * (CELL_WIDTH + MARGIN) + MARGIN,
                y * (CELL_HEIGHT + MARGIN) + MARGIN
            )

            // Draw a noisy "rectangle"
            const rect = [
                [0, 0],
                [CELL_WIDTH, 0], 
                [CELL_WIDTH, CELL_HEIGHT],
                [0, CELL_HEIGHT]
            ]
            const points = jitterPoly(rect, .6, .3, true)
            ctx.beginPath()
            roundPoly(ctx, points.map(([x, y]) => ({x, y})), 50)
            ctx.fillStyle = rng.choice(palette)
            ctx.globalCompositeOperation = "source-over"
            ctx.fill()

            // draw a number of smaller rectangles inside
            ctx.globalCompositeOperation = "source-atop"
            const numShapes = rng.nextRange(3, 6)
            for (let i = 0; i < numShapes; i++) {
                const MIN_WIDTH = 10
                const MAX_WIDTH = Math.min(CELL_WIDTH, CELL_HEIGHT) - 20
                const MIN_PERIM = MIN_WIDTH * 8
                const MAX_AREA = CELL_WIDTH * CELL_HEIGHT / 6

                const width = rng.nextRange(MIN_WIDTH, MAX_WIDTH)
                const height = rng.nextRange(
                    Math.max(MIN_WIDTH, MIN_PERIM - width),
                    Math.min(MAX_WIDTH, MAX_AREA / width))
                const x = rng.biasedRange(0, CELL_WIDTH - width, 3)
                const y = rng.biasedRange(0, CELL_HEIGHT - height, 3) 
                const shape = [
                    [x, y],
                    [x + width, y], 
                    [x + width, y + height],
                    [x, y + height]
                ]

                const points = jitterPoly(shape, .6, .2, true)
                ctx.beginPath()
                roundPoly(ctx, points.map(([x, y]) => ({x, y})), 50)
                ctx.fillStyle = rng.choice(palette)
                ctx.fill()

            }


            ctx.restore()
        }
    }

    // canvas/paper texture from png
    ctx.globalCompositeOperation = "source-atop"
    let img = new Image()
    img.src = TEXTURE_URI 
    img.onload = function() {
        let pattern = ctx.createPattern(img, "repeat");
        ctx.fillStyle = pattern
        ctx.fillRect(0, 0, width, height)
    }
}
