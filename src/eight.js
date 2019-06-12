function eight(rng) {
    const width = 400
    const height = 400

    const NUM_ECHOS = 5
    const ECHO_SPACING = 40
    const COLOR_SPEED = 300
    const MORPH_SPEED = 150
    const REVERSE = true
    const SMOOTH = true
    const RADIUS_VARIENCE = 0.2
    const CENTER_RANGE = 50
    const CENTER_SPEED = 500
    const MAX_RADIUS = (width - CENTER_RANGE) / 2
    const RADIUS_SPEED = 500
    const COLOR_SIN = false

    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    canvas.width = width
    canvas.height = height

    let simplex = new SimplexNoise(rng.nextFloat.bind(rng))

    const animId = startAnimating(draw, 60)
    // draw()

    let t = 0
    function draw(dt) {
        canvas.width = width
        for (let i of range(NUM_ECHOS).reverse()) {
            let t_ = t - i * ECHO_SPACING
            // if (t_ < 0) continue
            let randomRadius =
                MAX_RADIUS * ((simplex.noise2D(t_ / RADIUS_SPEED, 0) + 1) / 2)
            let radius =
                randomRadius * RADIUS_VARIENCE +
                MAX_RADIUS * (1 - RADIUS_VARIENCE)
            let morphVarience =
                0.4 + 0.5 * ((simplex.noise2D(0, t_ / 400) + 1) / 2)
            let dx = CENTER_RANGE * simplex.noise2D(t_ / CENTER_SPEED, 0)
            let dy = CENTER_RANGE * simplex.noise2D(0, t_ / CENTER_SPEED)
            let center = [width / 2 + dx, height / 2 + dy]
            let poly = randomPoly(
                simplex,
                center,
                radius,
                t_ / MORPH_SPEED,
                morphVarience
            )
            let alpha = REVERSE ? (i + 1) / NUM_ECHOS : 1 - i / NUM_ECHOS
            if (COLOR_SIN) {
                let color = (255 * (Math.sin(t_ / COLOR_SPEED) + 1)) / 2
                ctx.fillStyle = `rgba(${color}, 100, 255, ${alpha})`
            } else {
                let r =
                    (255 * (simplex.noise4D(1, 0, 0, t_ / COLOR_SPEED) + 1)) / 2
                // let g = 255 * (simplex.noise4D(0, 1, 0, t_ / COLOR_SPEED) + 1) / 2
                let b =
                    (255 * (simplex.noise4D(0, 0, 1, t_ / COLOR_SPEED) + 1)) / 2
                let g = Math.min(r, b) / 2
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
            }
            if (SMOOTH) {
                roundPoly(ctx, poly.map(([x, y]) => ({ x, y })), radius / 10)
            } else {
                drawPoly(ctx, poly)
            }
            ctx.fill()
        }
        // ctx.fillStyle = "black"
        // ctx.fillText("fps: " + 1000 / dt, 8, 8)
        t++
    }

    return () => stopAnimation(animId)
}

