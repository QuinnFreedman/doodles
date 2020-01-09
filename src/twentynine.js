function twentynine(rng) {
    const width = 1000
    const height = 1000

    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = width
    canvas.height = height

    ctx.fillStyle= "#1c0657"
    ctx.fillRect(0, 0, width, height)



    const NOISE_SCALE = 300
    ctx.beginPath()
    for (let _ of range(10)) {
        let simplex = new SimplexNoise(rng.nextFloat.bind(rng))
        let p1 = [rng.nextRange(width), rng.nextRange(height)]
        let p2 = [rng.nextRange(width), rng.nextRange(height)]
        for (let i = 0; i < 800; i++) {
            let [x1, y1] = p1
            let theta1 = simplex.noise2D(x1 / NOISE_SCALE, y1 / NOISE_SCALE) * Math.PI
            newP1 = moveInDirection(p1, theta1, 10)

            let [x2, y2] = p2
            let theta2 = simplex.noise2D(x2 / NOISE_SCALE, y2 / NOISE_SCALE) * Math.PI
            newP2 = moveInDirection(p2, theta2, 10)

            ctx.moveTo(...p1)
            ctx.lineTo(...newP1)
            ctx.lineTo(...newP2)
            ctx.lineTo(...p2)

            p1 = newP1
            p2 = newP2

            if (
                (x1 < 0 || y1 < 0 || x1 > width || y1 > height) &&
                (x2 < 0 || y2 < 0 || x2 > width || y2 > height)
            ) {
                break
            }
        }
        ctx.lineWidth = 2.4
        ctx.strokeStyle = "#00000020"
        ctx.stroke()
    }



    ctx.translate(width / 2, height / 2)

    const DEGREE = 6
    for (let i = 0; i < 10; i++) {
        let isOutline = rng.nextFloat() > .8 || i == 9
        let y = rng.normalRange(200, 300)
        let r = rng.nextRange(50, 300)
        let theta = rng.nextFloatRange(0, Math.PI / 8)
        ctx.rotate(rng.nextFloatRange(Math.PI * 2))
        for (let j = 0; j < DEGREE; j++) {
            ctx.beginPath()
            ctx.rotate(2 * Math.PI / DEGREE)
            regularPolygon(ctx, 0, 
                y,
                r,
                3, theta)
            if (isOutline) {
                ctx.lineWidth = 1
                ctx.strokeStyle = "#f2ea94"
                ctx.stroke()
            } else {
                ctx.fillStyle = "#80ddf299"
                ctx.fill()
            }
        }
    }
}
