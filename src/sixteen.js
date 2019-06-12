function sixteen(rng) {
    const PETAL_LENGTH_MEAN = [115, 95]
    const PETAL_LENGTH_SD = [10, 10, 10]
    const PETAL_WIDTH_MEAN = Math.PI / 8
    const PETAL_WIDTH_SD = Math.PI / 96
    const PETAL_ROUNDNESS_MEAN = .75
    const PETAL_ROUNDNESS_SD = .05
    const PETAL_CORNER_RADIUS_MEAN = 25
    const PETAL_CORNER_RADIUS_SD = 0
    // const PETAL_COLOR = "#efcddd"
    const PETAL_COLOR_1 = "#efcddd"
    const PETAL_COLOR_2 = "#ffbabf"
    const PETAL_COUNT = 20
    const NUM_FLOWERS_X = 3
    const NUM_FLOWERS_Y = 2

    const simplex = new SimplexNoise(rng.nextFloat.bind(rng))

    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const width = 800
    const height = 600

    canvas.width = width
    canvas.height = height

    ctx.fillStyle = "#aadcff"
    
    ctx.fillRect(0, 0, width, height)


    for (let x of range(NUM_FLOWERS_X)) {
        for (let y of range(NUM_FLOWERS_Y)) {
            let center = [
                (x + .5) * width / (NUM_FLOWERS_X),
                (y + .5) * height / (NUM_FLOWERS_Y)
            ]
            console.log(center)
            drawFlower(center, x * y + y)
        }
    }

    function drawFlower(center, t) {
        ctx.shadowColor = "#dc4a6a95" 
        ctx.shadowBlur = 10

        for (let i of range(PETAL_LENGTH_MEAN.length)) {
            for (let {} of range(PETAL_COUNT)) {
                let theta = rng.nextFloat() * Math.PI * 2
                drawPetal(center, theta, {
                    length: rng.normal(PETAL_LENGTH_MEAN[i], PETAL_LENGTH_SD[i]),
                    width: rng.normal(PETAL_WIDTH_MEAN, PETAL_WIDTH_SD),
                    roundness: rng.normal(PETAL_ROUNDNESS_MEAN, PETAL_ROUNDNESS_SD),
                    cornerRadius: rng.normal(PETAL_CORNER_RADIUS_MEAN, PETAL_CORNER_RADIUS_SD),
                    color: lerpColor(PETAL_COLOR_1, PETAL_COLOR_2, rng.nextFloat())
                })
            }
        }

        let middle = randomPoly(simplex, center, 30, t, .1, 30).map(([x, y]) => ({x, y}))

        ctx.beginPath()
        // ctx.arc(...center, 30, 0, Math.PI * 2)
        roundPolly(ctx, middle, 5)
        ctx.shadowColor = "#dc4a6a" //"#cc3a5a"
        ctx.shadowBlur = 40
        ctx.fillStyle = "#dc4a6a" 
        ctx.fill()
    }

    function drawPetal(center, theta, config) {
        const {length, width, roundness, cornerRadius, color} = config
        let p1 = center
        let p2 = moveInDirection(center, theta - width, length * roundness)
        let p3 = moveInDirection(center, theta + width, length * roundness)
        let p4 = moveInDirection(center, theta, length)
        let poly = [p1, p2, p4, p3].map(([x, y]) => ({x, y}))
        ctx.fillStyle = color
        ctx.beginPath()
        roundPolly(ctx, poly, cornerRadius)
        ctx.fill()
    }
}
