const STYLE_LINE_CLUSTERS = "STYLE_LINE_CLUSTERS"
const STYLE_PARTIAL_FILL = "STYLE_PARTIAL_FILL"
const STYLE_DOTS = "STYLE_DOTS"
const STYLE_LINES = "STYLE_LINES"

function nine(rng) {
    const config = {
        width: 800,
        height: 800,
        numPaths: 20,
        origin: [0, 700],
        initialAngle: -Math.PI / 4,
        colorFunction: function(i) {
            return `rgba(${(i / this.numPaths) * 255}, ${(1 -
                i / this.numPaths) *
                255}, ${((0.5 + i / this.numPaths) * 255) % 255})`
        },
        randomWalk: {
            morphSpeed: 1 / 2000,
            stepSize: 15,
            simplexStepSize: 20
        },
        pointCluster: {
            style: STYLE_PARTIAL_FILL,
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
        colorFunction: function(i) {
            return `rgba(${(i / this.numPaths) * 255}, ${(1 -
                i / this.numPaths) *
                255}, ${((0.5 + i / this.numPaths) * 255) % 255})`
        },
        randomWalk: {
            morphSpeed: 1 / 4000,
            stepSize: 5,
            noiseMagnitudeFunction: i => 1 + 1.1 ** (i / 5),
            simplexStepSize: 10
        },
        pointCluster: {
            style: STYLE_DOTS,
            morphSpeed: 1 / 100,
            numPoints: 4,
            spread: 10,
            pointSize: 1.5
        }
    }
    return nine_core(rng, config)
}

function eleven(rng) {
    const config = {
        width: 800,
        height: 800,
        numPaths: 20,
        origin: [400, 400],
        initialAngle: null,
        colorFunction: function(i) {
            return `rgba(${(i / this.numPaths) * 255}, ${(1 -
                i / this.numPaths) *
                255}, ${((0.5 + i / this.numPaths) * 255) % 255})`
        },
        randomWalk: {
            morphSpeed: 1 / 3000,
            stepSize: 10,
            noiseMagnitudeFunction: i => 1 + 1.1 ** (i / 5),
            simplexStepSize: 10,
            morphSpeedRamp: 0.2
        },
        pointCluster: {
            style: STYLE_LINES,
            morphSpeed: 1 / 500,
            numPoints: 3,
            spread: 2,
            pointSize: 1.5
        }
    }
    return nine_core(rng, config)
}

function nine_core(rng, config) {
    const { width, height } = config

    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const TWO_PI = 2 * Math.PI

    canvas.width = width
    canvas.height = height

    let simplex = new SimplexNoise(rng.nextFloat.bind(rng))

    const NUM_PATHS = config.numPaths
    const pathSeeds = range(NUM_PATHS).map(() => rng.nextInt())

    let frameNumber = 0
    const animId = startAnimating(draw, 30)
    function draw() {
        canvas.width = width
        for (let i of range(NUM_PATHS)) {
            let oldPoints = null // only used in STYLE_LINES
            ctx.strokeStyle = ctx.fillStyle = config.colorFunction.apply(
                config,
                [i]
            )
            const walk = randomWalk(
                simplex,
                config.origin,
                pathSeeds[i],
                config.initialAngle,
                frameNumber * config.randomWalk.morphSpeed,
                config.randomWalk
            )
            for (let [p_idx, p] of enumerate(islice(walk, 0, 100))) {
                let points = scatterPoints(
                    p,
                    i,
                    p_idx,
                    frameNumber * config.pointCluster.morphSpeed
                )
                if (config.pointCluster.style === STYLE_LINES) {
                    if (oldPoints) {
                        ctx.beginPath()
                        for (let j in range(points.length)) {
                            ctx.moveTo(...oldPoints[j])
                            ctx.lineTo(...points[j])
                        }
                        ctx.stroke()
                    }
                    oldPoints = points
                } else {
                    drawSpatter(points)
                }
                p_idx++
            }
        }
        frameNumber++
    }

    function scatterPoints([cx, cy], path, point, frame) {
        const { numPoints, spread } = config.pointCluster
        let result = []
        for (let i of range(numPoints)) {
            x =
                cx +
                spread *
                    simplex.noise4D(i + 1000, path * 100, point * 100, frame)
            y = cy + spread * simplex.noise4D(i, path * 100, point * 100, frame)
            result.push([x, y])
        }
        return result
    }

    function drawSpatter(points) {
        const { pointSize, style } = config.pointCluster
        ctx.beginPath()
        if (style === STYLE_LINE_CLUSTERS) {
            for (let [i, [x, y]] of enumerate(points)) {
                if (i == 0) {
                    ctx.moveTo(x, y)
                } else {
                    ctx.lineTo(x, y)
                }
            }
            ctx.stroke()
        } else if (style === STYLE_PARTIAL_FILL) {
            for (let [x, y] of points) {
                ctx.arc(x, y, pointSize, 0, 2 * Math.PI)
            }
            ctx.fill()
        } else if (style === STYLE_DOTS) {
            for (let [x, y] of points) {
                ctx.moveTo(x, y)
                ctx.arc(x, y, pointSize, 0, 2 * Math.PI)
            }
            ctx.fill()
        }
    }

    return () => stopAnimation(animId)
}

function* randomWalk(simplex, start, seed, initialAngle, offset, config) {
    const {
        stepSize,
        noiseMagnitudeFunction,
        simplexStepSize,
        morphSpeedRamp
    } = config
    let p = start
    if (typeof initialAngle === "undefined" || initialAngle === null) {
        initialAngle = Math.PI * 2 * simplex.noise2D(seed, 0)
    }

    for (let i = 0; ; i++) {
        yield p
        let noiseIndex = i / simplexStepSize
        let noiseAmplification = noiseMagnitudeFunction
            ? noiseMagnitudeFunction(i)
            : 1
        let t = morphSpeedRamp ? offset * i ** morphSpeedRamp : offset
        let theta =
            initialAngle +
            noiseAmplification * simplex.noise4D(seed, noiseIndex, t, 0)
        p = moveInDirection(p, theta, stepSize)
    }
}
