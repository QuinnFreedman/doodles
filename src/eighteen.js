function eighteen(rng) {
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const width = 900
    const height = 900

    canvas.width = width
    canvas.height = height

    const TWO_PI = 2 * Math.PI

    let grad = ctx.createLinearGradient(0, 0, 0, height)
    // grad.addColorStop(0, "#9f9f9f")
    // grad.addColorStop(1, "#464646")
    grad.addColorStop(0, "red")
    grad.addColorStop(1, "blue")

    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)

    const center = [width / 2, height / 2]

    for (let {} of range(5)) {
        let start = rng.nextRange(0, TWO_PI)
        let end = start + rng.normalRange(1.5 * Math.PI, 1.8 * Math.PI)
        let color = "black" //rng.nextBool() ? "white" : "black"
        let lineWidth = rng.nextRange(2, 20)
        let radius = rng.nextRange(width / 3 - 50, width / 3 + 50)
        ctx.strokeStyle = color
        ctx.lineWidth = lineWidth
        ctx.beginPath()
        ctx.arc(...center, radius, start, end)
        ctx.stroke()
    }

    ctx.lineWidth = rng.nextRange(3, 17)
    let r = rng.nextFloat()
    if (r < 1/3) {
        for (let {} of range(2)) {
            let theta = rng.nextRange((-Math.PI * 3) / 4, -Math.PI / 4)
            let distance = rng.nextRange(width / 3 + 100, width / 3 + 150)
            let p1 = moveInDirection(center, theta, distance)
            let p2 = moveInDirection(center, theta - Math.PI, distance)
            ctx.beginPath()
            ctx.moveTo(...p1)
            ctx.lineTo(...p2)
            ctx.stroke()
        }
    } else if (r < 2/3) {
        let x = rng.nextRange(width / 2 - (width / 3), width / 2 + (width / 3))
        let dy = rng.nextRange(width / 3 + 100, width / 3 + 150)
        let y1 = height / 2 - dy
        let y2 = height / 2 + dy
        ctx.beginPath()
        ctx.moveTo(x, y1)
        ctx.lineTo(x, y2)
        ctx.stroke()
    }

    let simplex = new SimplexNoise(rng.nextFloat.bind(rng))

    const image = ctx.createImageData(width, height)
    const imageData = image.data
    const NOISE_SCALE = 4
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let v =
                (simplex.noise2D(
                    (x / width) * NOISE_SCALE,
                    (y / height) * NOISE_SCALE
                ) +
                    1) /
                2
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
    maskCtx.globalCompositeOperation = "destination-out"
    maskCtx.beginPath()
    for (let y = 0; y < height; y += 40) {
        maskCtx.moveTo(0, y)
        maskCtx.lineTo(width, y)
    }
    for (let x = 0; x < width; x += 40) {
        maskCtx.moveTo(x, 0)
        maskCtx.lineTo(x, height)
    }
    maskCtx.stroke()

    // ctx.globalCompositeOperation = "destination-out"
    ctx.drawImage(maskCanvas, 0, 0)
}

