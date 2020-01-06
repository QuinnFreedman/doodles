function twentyseven(rng) {
    twentysix(rng, 2)
}

function twentysix(rng, mode=1) {
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const width = 1200
    const height = 600

    canvas.width = width
    canvas.height = height

    ctx.lineWidth = 3.1
    ctx.lineCap = "round"
    ctx.fillStyle = "#faf8f4"
    ctx.fillRect(0, 0, width, height)

    const palette = ["#f98720", "#fccc06", "#991560", "#f53930", "#0366cb"]

    const simplex = new SimplexNoise(rng.nextFloat.bind(rng))
    const NOISE_SCALE = mode == 1 ? 200 : 300
    const STEP_SIZE = 5
    // const LINE_LENGTH = 8

    for (let _ of xrange(700)) {
        const LINE_LENGTH = rng.nextRange(6, 20)
        ctx.beginPath()

        let x = rng.nextRange(width)
        let y = rng.nextRange(height)

        ctx.moveTo(x, y)

        for (let i = 0; i < LINE_LENGTH; i++) {
            let noise = simplex.noise2D(x / NOISE_SCALE, y / NOISE_SCALE)
            // this really "should" be just noise * PI but I made two mistakes
            // and I liked them both better that the uniform distribution
            let theta = mode == 1 ? noise * Math.PI / 2 : noise * Math.PI * 2

            let [newX, newY] = moveInDirection([x, y], theta, STEP_SIZE)
            x = newX
            y = newY

            ctx.lineTo(x, y)
        }

        ctx.strokeStyle = rng.choice(palette)
        ctx.stroke()
    }
}
