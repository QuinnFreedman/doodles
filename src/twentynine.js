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
