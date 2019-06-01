function twelve(rng) {
    const noiseScales = [100, 60, 30, 20]
    const blackLevel = 0.1
    const BASE_SCALE = 1 / 4

    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const width = 800
    const height = 600

    canvas.width = width
    canvas.height = height

    const baseImageWidth = width * BASE_SCALE
    const baseImageHeight = height * BASE_SCALE

    let simplex = new SimplexNoise(rng.nextFloat.bind(rng))

    let image = ctx.createImageData(baseImageWidth, baseImageHeight)
    let imageData = image.data
    drawSimplexFlames(simplex, imageData, baseImageWidth, baseImageHeight, 0, {
        noiseScales,
        blackLevel,
        scaleFactor: 4,
        flameHeight: 1.5
    })
    // ctx.putImageData(image, 0, 0)
    paintImage(ctx, image, [width, height], rng, simplex, {
        stride: 10,
        lineWidth: 3
    })
}

function paintImage(ctx, image, [ctxWidth, ctxHeight], rng, simplex, config, t) {
    const { stride, lineWidth } = config
    const imgWidth = image.width
    const imgHeight = image.height
    const imageData = image.data

    const xScale = imgWidth / ctxWidth
    const yScale = imgHeight / ctxHeight
    ctx.lineWidth = lineWidth
    for (let _y = 0; _y < ctxHeight; _y += stride) {
        for (let _x = 0; _x < ctxWidth; _x += stride) {
            let x = _x + rng.nextFloat() * stride// rng.normalRange(_x - stride, _x + stride)
            let y = _y + rng.nextFloat() * stride// rng.normalRange(_y - stride, _y + stride)
            !x && console.log(y)
            let imgX = Math.round(xScale * x)
            let imgY = Math.round(yScale * y)
            let cell = (imgX + imgY * imgWidth) * 4
            const r = imageData[cell]
            const g = imageData[cell + 1]
            const b = imageData[cell + 2]
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
            ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`
            // ctx.fillRect(x, y, stride, stride)
            ctx.moveTo(x, y)
            let walk = randomWalk(simplex, [x, y], x * y, Math.PI / 2, t || 0, {
                stepSize: 10,
                simplexStepSize: 10
            })
            let _ = false
            ctx.beginPath()
            for (let p of islice(walk, 0, 10)) {
                if (_) {
                    ctx.moveTo(...p)
                    _ = true
                }
                ctx.lineTo(...p)
            }
            ctx.stroke()
        }
    }
}
