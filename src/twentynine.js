function twentynine(rng) {
    wreath(rng, () => [1, 1, 1], false)
}

function thirty(rng) {
    wreath(rng, 
        (x) => {
            x = x < .5 ? 2*x : 2*(1-x)
            return rgbToHex(lerpColor([1, 0, .5], [0, 1, .5], x))
        },
        // () => [1, .5, .5],
        true
    )
}

function wreath(rng, getColor, inverseAlpha) {
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const width = 800
    const height = 800

    canvas.width = width
    canvas.height = height

    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, width, height)

    const NUM_LINES = 750
    const CENTER = [width / 2, height / 2]
    const RADIUS = 300
    const LINE_LENGTH = 12
    const SEGMENT_LENGTH = 10
    const WOBBLE = 4

    let points = []
    let velocities = []

    for (let i = 0; i < NUM_LINES; i++) {
        let theta = i * 2 * Math.PI / NUM_LINES
        points[i] = moveInDirection(CENTER, theta, RADIUS)
        velocities[i] = moveInDirection([0, 0], theta - Math.PI / 2, SEGMENT_LENGTH)
    }

    for (let j = 0; j < LINE_LENGTH; j++){
        for (let i = 0; i < NUM_LINES; i++) {
            ctx.beginPath()
            let v = velocities[i]
            let p = points[i]
            ctx.moveTo(...p)
            v[0] += rng.nextFloatRange(-WOBBLE, WOBBLE)
            v[1] += rng.nextFloatRange(-WOBBLE, WOBBLE)
            p[0] += v[0]
            p[1] += v[1]
            ctx.lineTo(...p)
            let alpha = inverseAlpha ? 
                (j / LINE_LENGTH) ** 2 :
                1 - (j / LINE_LENGTH)
            let color = getColor(i/NUM_LINES).slice(0, 3)
            let colorWithAlpha = color.concat(alpha)
            ctx.strokeStyle = rgbToHex(colorWithAlpha) 
            ctx.stroke()
        }
    }
}

function oldTwentynine(rng) {
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
