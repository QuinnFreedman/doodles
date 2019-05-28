function nine(rng) {
    const width = 800
    const height = 800

    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const TWO_PI = 2 * Math.PI

    canvas.width = width
    canvas.height = height

    let simplex = new SimplexNoise(rng.nextFloat.bind(rng))
    

    function* randomWalk(start, seed, initialAngle) {
        const STEP = 15
        const SPEED = 10
        const MAGNITUDE = 1
        let p = start
        if (typeof initialAngle === "undefined") {
            initialAngle = simplex.noise2D(seed,0)
        }

        for(let i = 0;;i++) {
            yield p
            let theta = initialAngle + MAGNITUDE * simplex.noise2D(seed, i / SPEED)
            p = moveInDirection(p, theta, STEP)
        }
    }

    const NUM_PATHS = 20
    const origin = [0, height - 100]
    const angle = -Math.PI / 4
    for (let i of range(NUM_PATHS)) {
        ctx.fillStyle = `rgba(${i / NUM_PATHS * 255}, ${(1 - i / NUM_PATHS) * 255}, ${((.5 + i / NUM_PATHS) * 255) % 255})`
        for (let p of islice(randomWalk(origin, rng.nextInt(), angle), 0, 100)) {
            spatter(p)
        }
    }

    function spatter([x, y]) {
        const density = 4
        const spread = 20
        const pointSize = 1
        ctx.beginPath()
        for (let {} of range(density)) {
            _x = x + rng.normalRange(spread)
            _y = y + rng.normalRange(spread)
            ctx.arc(_x, _y, pointSize, 0, 2 * Math.PI)
        }
        ctx.fill()
    }

}
