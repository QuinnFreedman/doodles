function nine(rng) {
    const width = 800
    const height = 800

    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const TWO_PI = 2 * Math.PI

    canvas.width = width
    canvas.height = height

    let simplex = new SimplexNoise(/*rng.nextFloat.bind(rng)*/)

    function* randomWalk(start, seed, initialAngle, offset) {
        const STEP = 15
        const SPEED = 20
        const MAGNITUDE = 1
        let p = start
        // if (typeof initialAngle === "undefined") {
        //     initialAngle = simplex.noise3D(seed, 0, offset)
        // }

        for (let i = 0; ; i++) {
            yield p
            let theta =
                initialAngle +
                MAGNITUDE * simplex.noise4D(seed, i / SPEED, offset, 0)
            p = moveInDirection(p, theta, STEP)
        }
    }

    const NUM_PATHS = 20
    const origin = [0, height - 100]
    const angle = -Math.PI / 4
    const WAVE_SPEED = 2000
    const PARTICLE_SPEED = 100

    const pathSeeds = range(NUM_PATHS).map(() => rng.nextInt())
    console.log(pathSeeds)

    let frameNumber = 0
    startAnimating(draw, 60)
    function draw() {
        canvas.width = width
        for (let i of range(NUM_PATHS)) {
            ctx.fillStyle = `rgba(${(i / NUM_PATHS) * 255}, ${(1 -
                i / NUM_PATHS) *
                255}, ${((0.5 + i / NUM_PATHS) * 255) % 255})`
            const walk = randomWalk(origin, pathSeeds[i], angle, frameNumber / WAVE_SPEED)
            let p_idx = 0
            for (let p of islice(walk, 0, 100)) {
                spatter(p, i, p_idx, frameNumber / PARTICLE_SPEED)
                p_idx++
            }
        }
        frameNumber++
    }

    function spatter([x, y], path, point, frame) {
        const density = 4
        const spread = 10
        const pointSize = 1
        ctx.beginPath()
        for (let i of range(density)) {
            _x = x + spread * simplex.noise4D(i + 1000, path * 100, point * 100, frame)
            _y = y + spread * simplex.noise4D(i, path * 100, point * 100, frame) 
            ctx.arc(_x, _y, pointSize, 0, 2 * Math.PI)
            // _x = x + rng.normalRange(spread)
            // _y = y + rng.normalRange(spread)
        }
        ctx.fill()
        // ctx.beginPath()
        // ctx.arc(x, y, pointSize, 0, 2 * Math.PI)
        // ctx.fill()
    }
}
