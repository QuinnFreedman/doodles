function seventeen(rng) {

    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const width = 900
    const height = 900

    canvas.width = width
    canvas.height = height

    const TWO_PI = 2 * Math.PI

    let grad = ctx.createLinearGradient(0, 0, 0, height)
    grad.addColorStop(0, "#9f9f9f")
    grad.addColorStop(1, "#464646")

    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)
    
    let grad2 = ctx.createLinearGradient(0, 0, 0, height)
    grad2.addColorStop(1, "#9f9f9f")
    grad2.addColorStop(0, "#464646")
    ctx.fillStyle = grad2
    function drawStackedSin(rng, width, height) {
        const COL_WIDTH = 5
        const onePeriod = 2 * Math.PI / (width / COL_WIDTH)
        const STACKED_NOISE_RANGES = [[onePeriod, .6],
                                      [onePeriod * 4.5, .5],
                                      [onePeriod * 8.2, .4],
                                      [onePeriod * 43.1, .5]]
        const MAX_HEIGHT = height / 2.5
        const MIN_HEIGHT = height / 16
        const POINT_DENSITY = 3
        
        const offsets = range(STACKED_NOISE_RANGES.length).map(() => rng.nextRange(0, 2 * Math.PI))

        ctx.beginPath()
        for (let i of range(width / COL_WIDTH)) {
            let x = i * COL_WIDTH
            let maxY = 0
            for (let [j, [period, magnitude]] of enumerate(STACKED_NOISE_RANGES)) {
                maxY += magnitude * MAX_HEIGHT * (Math.sin(i * period + offsets[j]) + 1) / 2
            }
            maxY = height - (maxY + MIN_HEIGHT)

            // ctx.moveTo(i * COL_WIDTH, height - (y + MIN_HEIGHT))
            // ctx.lineTo(i * COL_WIDTH, height)
            for (let y of range(maxY, height)) {
                for (let {} of range(POINT_DENSITY)) {
                    ctx.fillRect(
                        rng.normal(x, 1.5),
                        rng.normal(y, 1.5),
                        1, 1
                    )
                }
            }
        }
        ctx.stroke()
    }

    drawStackedSin(rng, width, height)


    let grid = drawGrid(rng)
    ctx.drawImage(grid, 0, 0)


    const center = [width / 2, height / 2]

    for (let {} of range(5)) {
        let start = rng.nextRange(0, TWO_PI)
        let end = start + rng.normalRange(1.5 * Math.PI, 1.8 * Math.PI)
        let color = rng.nextBool() ? "white" : "black"
        let lineWidth = rng.nextRange(2, 20)
        let radius = rng.nextRange(width / 3 - 50, width / 3 + 50)
        ctx.strokeStyle = color
        ctx.lineWidth = lineWidth
        ctx.beginPath()
        ctx.arc(...center, radius, start, end)
        ctx.stroke()
    }

    for (let {} of range(rng.nextBool() ? 1 : 2)) {
        ctx.strokeStyle = rng.nextBool() ? "white" : "black"
        ctx.lineWidth = rng.nextRange(2, 20)
        let straight = rng.nextBool()
        let theta = rng.nextRange((-Math.PI * 3) / 4, -Math.PI / 4)
        let distance = rng.nextRange(width / 3 + 100, width / 3 + 150)
        let p1 = moveInDirection(center, theta, distance)
        let p2 = straight
            ? moveInDirection(center, -theta, distance)
            : moveInDirection(center, theta - Math.PI, distance)
        ctx.beginPath()
        ctx.moveTo(...p1)
        ctx.lineTo(...p2)
        ctx.stroke()
    }


    function drawGrid(rng) {
        const NOISE_SCALE_X = 4
        const NOISE_SCALE_Y = 4
        const COLOR = "white"
        const GRID_SIZE_X = 40
        const GRID_SIZE_Y = 40

        const simplex = new SimplexNoise(rng.nextFloat.bind(rng))

        const image = ctx.createImageData(width, height)
        const imageData = image.data
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let v =
                    1 -
                    Math.max(
                        0,
                        simplex.noise2D(
                            (x / width) * NOISE_SCALE_X,
                            (y / height) * NOISE_SCALE_Y
                        )
                    )
                let cell = (x + y * width) * 4
                imageData[cell] = 0
                imageData[cell + 1] = 0
                imageData[cell + 2] = 0
                imageData[cell + 3] = v * 255
            }
        }

        let maskCanvas = document.createElement("canvas")
        maskCanvas.width = width
        maskCanvas.height = height
        let maskCtx = maskCanvas.getContext("2d")

        maskCtx.putImageData(image, 0, 0)

        let linesCanvas = document.createElement("canvas")
        linesCanvas.width = width
        linesCanvas.height = height
        let linesCtx = linesCanvas.getContext("2d")
        linesCtx.strokeStyle = COLOR
        linesCtx.beginPath()
        for (let y = 0; y < height; y += GRID_SIZE_Y) {
            linesCtx.moveTo(0, y)
            linesCtx.lineTo(width, y)
        }
        for (let x = 0; x < width; x += GRID_SIZE_X) {
            linesCtx.moveTo(x, 0)
            linesCtx.lineTo(x, height)
        }
        linesCtx.stroke()

        maskCtx.globalCompositeOperation = "source-out"
        maskCtx.drawImage(linesCanvas, 0, 0)

        return maskCanvas
    }
}

