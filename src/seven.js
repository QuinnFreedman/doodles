function seven(rng) {
    const noiseScales = [100, 60, 30, 20]
    const SPEED = 3
    const blackLevel = 0.1

    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const width = 800
    const height = 600

    canvas.width = width
    canvas.height = height

    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, width, height)

    let simplex = new SimplexNoise(rng.nextFloat.bind(rng))

    let loop = []
    let looping = false

    let frameCount = 0
    let frameTotal = 150.0
    let i = 0

    const animId = startAnimating(draw, 60)
    function draw() {
        let image
        if (!looping) {
            image = ctx.createImageData(canvas.width, canvas.height)
            let imageData = image.data
            let t = frameCount / frameTotal
            drawSimplexFlames(simplex, imageData, width, height, t, {
                noiseScales,
                blackLevel
            })
            frameCount += SPEED
            loop.push(image)
            if (t >= 1) {
                looping = true
            }
        } else {
            image = loop[i]
            i = (i + 1) % loop.length
        }

        ctx.putImageData(image, 0, 0)
    }

    return () => stopAnimation(animId)
}

function drawSimplexFlames(simplex, imageData, width, height, t, config) {
    const { noiseScales, blackLevel, flameHeight } = config
    const scaleFactor = config.scaleFactor || 1
    const data = imageData
    const TWO_PI = 2 * Math.PI
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let stackedNoise = 1
            for (let noiseScale of noiseScales) {
                stackedNoise *=
                    (simplex.noise4D(
                        x / noiseScale * scaleFactor,
                        y / noiseScale * scaleFactor,
                        0.3 * Math.cos(TWO_PI * t),
                        0.3 * Math.sin(TWO_PI * t)
                    ) +
                        1) /
                    2
            }
            stackedNoise = Math.sqrt(stackedNoise)
            stackedNoise *= (y / height) ** (flameHeight || 2)

            let cell = (x + y * width) * 4
            if (stackedNoise < blackLevel) {
                data[cell] = data[cell + 1] = data[cell + 2] = 0
            } else {
                data[cell] = 255
                data[cell + 1] = Math.floor((1 - stackedNoise * 2) * 256)
                data[cell + 2] = 0
            }
            data[cell + 3] = 255 // alpha.
        }
    }
}
