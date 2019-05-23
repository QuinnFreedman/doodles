function seven(rng) {
    const NOISE_SCALES = [100, 60, 30, 20]
    const SPEED = 3
    const BLACK_LEVEL = 0.1

    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const width = 800
    const height = 600
    const TWO_PI = 2 * Math.PI

    canvas.width = width
    canvas.height = height

    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, width, height)

    let simplex = new SimplexNoise()

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
            let data = image.data
            let t = frameCount / frameTotal
            frameCount += SPEED
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    let stackedNoise = 1
                    for (let scale of NOISE_SCALES) {
                        stackedNoise *=
                            (simplex.noise4D(
                                x / scale,
                                y / scale,
                                0.3 * Math.cos(TWO_PI * t),
                                0.3 * Math.sin(TWO_PI * t)
                            ) +
                                1) /
                            2
                    }
                    stackedNoise = Math.sqrt(stackedNoise)
                    stackedNoise *= (y / height) ** 2

                    let cell = (x + y * canvas.width) * 4
                    if (stackedNoise < BLACK_LEVEL) {
                        data[cell] = data[cell + 1] = data[cell + 2] = 0
                    } else {
                        data[cell] = 255
                        data[cell + 1] = Math.floor((1 - stackedNoise * 2) * 256)
                        data[cell + 2] = 0
                    }
                    data[cell + 3] = 255 // alpha.
                }
            }
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
