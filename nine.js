function nine(rng) {
    const config = {
        width: 800,
        height: 800,
        numPaths: 20,
        origin: [0, 700],
        initialAngle: -Math.PI / 4,
        colorFunction: function(i) { return `rgba(${(i / this.numPaths) * 255}, ${(1 - i / this.numPaths) * 255}, ${((0.5 + i / this.numPaths) * 255) % 255})`},
        randomWalk: {
            morphSpeed: 1 / 2000,
            stepSize: 15,
            noiseMagnitudeFunction: () => 1,
            simplexStepSize: 20,
        },
        pointCluster: {
            morphSpeed: 1 / 100,
            numPoints: 4,
            spread: 10,
            pointSize: 1
        }
    }
    return nine_core(rng, config)
}

function ten(rng) {
    const config = {
        width: 800,
        height: 800,
        numPaths: 25,
        origin: [400, 400],
        initialAngle: null,
        colorFunction: function(i) { return `rgba(${(i / this.numPaths) * 255}, ${(1 - i / this.numPaths) * 255}, ${((0.5 + i / this.numPaths) * 255) % 255})`},
        randomWalk: {
            morphSpeed: 1 / 4000,
            stepSize: 5,
            noiseMagnitudeFunction: (i) => 1 + 1.1 ** (i / 5),
            simplexStepSize: 10,
        },
        pointCluster: {
            // style: "line",
            morphSpeed: 1 / 100,
            numPoints: 4,
            spread: 10,
            pointSize: 1.5,
            separate: true
        }
    }
    return nine_core(rng, config)
}
function nine_core(rng, config) {
    const {width, height} = config

    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const TWO_PI = 2 * Math.PI

    canvas.width = width
    canvas.height = height

    let simplex = new SimplexNoise(rng.nextFloat.bind(rng))

    function* randomWalk(start, seed, initialAngle, offset) {
        const {stepSize, noiseMagnitudeFunction, simplexStepSize} = config.randomWalk
        let p = start
        if (typeof initialAngle === "undefined" || initialAngle === null) {
            initialAngle = TWO_PI * simplex.noise2D(seed, 0)
        }

        for (let i = 0; ; i++) {
            yield p
            let noiseIndex = (i / simplexStepSize)
            let noiseAmplification = noiseMagnitudeFunction(i) 
            let theta =
                initialAngle + noiseAmplification * simplex.noise4D(seed, noiseIndex, offset, 0)
            p = moveInDirection(p, theta, stepSize)
        }
    }

    const NUM_PATHS = config.numPaths
    const pathSeeds = range(NUM_PATHS).map(() => rng.nextInt())
    console.log(pathSeeds)

    let frameNumber = 0
    const animId = startAnimating(draw, 60)
    function draw() {
        canvas.width = width
        for (let i of range(NUM_PATHS)) {
            ctx.strokeStyle = ctx.fillStyle = config.colorFunction.apply(config, [i])
            const walk = randomWalk(config.origin,
                pathSeeds[i], config.initialAngle,
                frameNumber * config.randomWalk.morphSpeed)
            let p_idx = 0
            for (let p of islice(walk, 0, 100)) {
                spatter(p, i, p_idx, frameNumber * config.pointCluster.morphSpeed)
                p_idx++
            }
        }
        frameNumber++
    }

    function spatter([x, y], path, point, frame) {
        const {numPoints, spread, pointSize} = config.pointCluster
        ctx.beginPath()
        if (config.pointCluster.style === "line") {
            for (let i of range(numPoints)) {
                _x = x + spread * simplex.noise4D(i + 1000, path * 100, point * 100, frame)
                _y = y + spread * simplex.noise4D(i, path * 100, point * 100, frame) 
                if (i == 0) {
                    ctx.moveTo(_x, _y)
                } else {
                    ctx.lineTo(_x, _y)
                }
            }
            ctx.stroke()
        } else {
            for (let i of range(numPoints)) {
                _x = x + spread * simplex.noise4D(i + 1000, path * 100, point * 100, frame)
                _y = y + spread * simplex.noise4D(i, path * 100, point * 100, frame) 
                if (config.pointCluster.separate) {
                    ctx.moveTo(_x, _y)
                }
                ctx.arc(_x, _y, pointSize, 0, 2 * Math.PI)
            }
            ctx.fill()
        }
    }


    return () => stopAnimation(animId)
}
