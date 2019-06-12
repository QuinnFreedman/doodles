function thirteen(rng) {
    const BASE_SCALE = 1 / 4

    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const width = 800
    const height = 600

    canvas.width = width
    canvas.height = height

    const baseImageWidth = Math.round(width * BASE_SCALE)
    const baseImageHeight = Math.round(height * BASE_SCALE)

    let simplex = new SimplexNoise(rng.nextFloat.bind(rng))

    const dropListener = e => {
        e.preventDefault()
        if (e.dataTransfer.files.length > 0) {
            paintImageFromSource(URL.createObjectURL(e.dataTransfer.files[0]))
        }
    }
    const dragoverListener = e => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "copy"
    }
    const message = document.createElement("p")
    message.innerText = "drag an image onto the canvas to paint it"
    document.body.addEventListener("drop", dropListener)
    document.body.addEventListener("dragover", dragoverListener)
    document.body.appendChild(message)

    paintImageFromSource("landscape.jpg")

    function paintImageFromSource(src) {
        ctx.textAlign = "center"
        ctx.fillText("Painting...", width / 2, height / 2)

        let img = new Image()
        img.onload = () => {
            const offscreenCanvas = document.createElement("canvas")
            offscreenCanvas.width = baseImageWidth
            offscreenCanvas.height = baseImageHeight
            const offscreenContext = offscreenCanvas.getContext("2d")
            offscreenContext.drawImage(
                img,
                0,
                0,
                baseImageWidth,
                baseImageHeight
            )
            const data = offscreenContext.getImageData(
                0,
                0,
                baseImageWidth,
                baseImageHeight
            )

            paintImage(ctx, data, [width, height], rng, simplex, {
                stride: 5,
                strokeWidth: 6,
                strokeSpacingRange: 2,
                maxColorDistance: 600,
                waviness: 20,
                randomDirection: true
            })
        }
        setTimeout(() => {
            img.src = src
        }, 100)
    }

    return () => {
        document.body.removeEventListener("drop", dropListener)
        document.body.removeEventListener("dragover", dragoverListener)
        document.body.removeChild(message)
    }
}

function paintImage(ctx, image, [ctxWidth, ctxHeight], rng, simplex, config) {
    const {
        stride,
        strokeWidth,
        strokeSpacingRange,
        maxColorDistance,
        waviness,
        randomDirection
    } = config
    const imgWidth = image.width
    const imgHeight = image.height
    const imageData = image.data
    const xScale = imgWidth / ctxWidth
    const yScale = imgHeight / ctxHeight
    const points = []
    for (let y = 0; y < ctxHeight; y += stride) {
        for (let x = 0; x < ctxWidth; x += stride) {
            points.push([
                rng.normalRange(x - strokeSpacingRange, x + strokeSpacingRange),
                rng.normalRange(y - strokeSpacingRange, y + strokeSpacingRange)
            ])
        }
    }

    shuffle(points, rng.nextFloat.bind(rng))

    function getPixelAt(x, y) {
        x = x < 0 ? 0 : x >= ctxWidth ? ctxWidth : x
        y = y < 0 ? 0 : y >= ctxHeight ? ctxHeight : y

        let imgX = Math.round(xScale * x)
        let imgY = Math.round(yScale * y)
        let cell = (imgX + imgY * imgWidth) * 4
        const r = imageData[cell]
        const g = imageData[cell + 1]
        const b = imageData[cell + 2]
        return [r, g, b]
    }

    for ([x, y] of points) {
        const [r, g, b] = getPixelAt(x, y)
        ctx.fillStyle = `rgb(${r}, ${g}, ${b}, .4)`
        let angle = randomDirection
            ? rng.nextRange(0, Math.PI * 2)
            : Math.PI / 2
        let walk = randomWalk(simplex, [x, y], x * y, angle, 0, {
            stepSize: 3,
            simplexStepSize: waviness
        })
        for (let [i, p] of enumerate(islice(walk, 0, 10))) {
            const [r_, g_, b_] = getPixelAt(...p)
            const distance = (r - r_) ** 2 + (g - g_) ** 2 + (b - b_) ** 2
            let shouldBreak = false
            if (distance > maxColorDistance) {
                if (i > 3) {
                    break
                } else {
                    ctx.fillStyle = `rgb(${r}, ${g}, ${b}, .4)`
                    shouldBreak = false
                }
            }
            const MORPH_SPEED = 1 / 100
            const MORPH_VARIENCE = 0.5
            let poly = randomPoly(
                simplex,
                p,
                strokeWidth,
                i * MORPH_SPEED,
                MORPH_VARIENCE
            )
            drawPoly(ctx, poly)
            // ctx.fillStyle = "#afdefe66"
            ctx.fill()
            if (shouldBreak) break
        }
    }
}
