function RNG(seed, useSeedrandom) {
    this.useSeedrandom = useSeedrandom
    if (useSeedrandom) {
        this.random = new Math.seedrandom(seed)
        this.seed = seed
    } else {
        // LCG using GCC's constants
        this.m = 0x80000000 // 2**31;
        this.a = 1103515245
        this.c = 12345
        this.seed =
            typeof seed === "number"
                ? seed
                : Math.floor(Math.random() * (this.m - 1))
        this.state = this.seed
    }
}
RNG.prototype.nextInt = function() {
    if (this.useSeedrandom) {
        return Math.abs(this.random.int32())
    } else {
        this.state = (this.a * this.state + this.c) % this.m
        return this.state
    }
}
/**
 * returns in range [0,1]
 */
RNG.prototype.nextFloat = function() {
    if (this.useSeedrandom) {
        return this.random()
    } else {
        return this.nextInt() / (this.m - 1)
    }
}

RNG.prototype.nextBool = function() {
    return this.nextFloat() < 0.5
}

RNG.prototype.nextSign = function() {
    return this.nextBool() ? 1 : -1
}
/**
 * returns integer in range [start, end): including start, excluding end
 * @param {number} start
 * @param {number} end
 */
RNG.prototype.nextRange = function(start, end) {
    if (typeof end === "undefined") {
        end = start
        start = 0
    }
    // can't modulu nextInt because of weak randomness in lower bits
    let rangeSize = end - start
    let randomUnder1 = this.nextFloat()
    return start + Math.floor(randomUnder1 * rangeSize)
}
/**
 * returns number in range [start, end): including start, excluding end
 * @param {number} start
 * @param {number} end
 */
RNG.prototype.nextFloatRange = function(start, end) {
    if (typeof end === "undefined") {
        end = start
        start = 0
    }
    // can't modulu nextInt because of weak randomness in lower bits
    let rangeSize = end - start
    let randomUnder1 = this.nextFloat()
    return start + randomUnder1 * rangeSize
}
RNG.prototype.choice = function(array) {
    return array[this.nextRange(0, array.length)]
}
RNG.prototype.normal = function(mean, stdev) {
    if (typeof mean === "undefined") mean = 0
    if (typeof stdev === "undefined") stdev = 0
    let u = 0,
        v = 0
    while (u === 0) u = this.nextFloat()
    while (v === 0) v = this.nextFloat()
    let random = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
    return random * stdev + mean
}
/**
 * @param {number} start
 * @param {number} end
 */
RNG.prototype.normalRange = function(start, end) {
    if (typeof end === "undefined") {
        end = start
        start = 0
    }
    let range = end - start
    let stdev = range / 6.0
    let mean = start + range / 2.0
    return clamp(start, end, this.normal(mean, stdev))
}

function clamp(min, max, x) {
    return x < min ? min : x > max ? max : x
}

function range(a, b, step) {
    let min, max
    if (b) {
        min = a
        max = b
    } else {
        min = 0
        max = a
    }
    step = step || 1
    const values = []
    for (i = min; i < max; i += step) {
        values.push(i)
    }

    return values
}

function* xrange(a, b, step) {
    let min, max
    if (b) {
        min = a
        max = b
    } else {
        min = 0
        max = a
    }
    step = step || 1
    for (i = min; i < max; i += step) {
        yield i
    }
}

function triangle(ctx, p1, p2, p3, fill) {
    ctx.beginPath()
    ctx.moveTo(...p1)
    ctx.lineTo(...p2)
    ctx.lineTo(...p3)
    ctx.lineTo(...p1)
    if (fill) {
        ctx.fill()
    } else {
        ctx.stroke()
    }
}

function euclideanDistance(v1, v2) {
    if (v1.length !== v2.length) {
        throw "Vector lengths do not match"
    }
    return Math.sqrt(
        range(v1.length)
            .map(i => (v1[i] - v2[i]) ** 2)
            .reduce((a, b) => a + b)
    )
}

function setPixel(ctx, [x, y], color) {
    if (Array.isArray(color)) {
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
    } else {
        ctx.fillStyle = color
    }
    ctx.fillRect(x, y, 1, 1)
}

function lerpColor(colorA, colorB, t) {
    t = t < 0 ? 0 : t > 1 ? 1 : t
    if (typeof colorA === "string") {
        colorA = rgbToHex(colorA)
    }
    if (typeof colorB === "string") {
        colorB = rgbToHex(colorB)
    }

    const [ar, ag, ab] = colorA
    const [br, bg, bb] = colorB

    return rgbToHex([
        ar + (br - ar) * t,
        ag + (bg - ag) * t,
        ab + (bb - ab) * t
    ])
}

function isFloat(n) {
    return typeof n === "number" && !Number.isInteger(n)
}

function isInt(n) {
    return typeof n === "number" && Number.isInteger(n)
}

function rgbToHex(rgbOrHex) {
    if (typeof rgbOrHex === "string") {
        let hex = rgbOrHex.replace("#", "")
        let r = parseInt(hex.substring(0, 2), 16)
        let g = parseInt(hex.substring(2, 4), 16)
        let b = parseInt(hex.substring(4, 6), 16)
        return [r, g, b].map(x => x / 255)
    } else if (Array.isArray(rgbOrHex)) {
        let r, g, b
        ;[r, g, b] = rgbOrHex.map(x => Math.round(x * 255))

        const numberToHex = c => {
            var hex = c.toString(16)
            return hex.length == 1 ? "0" + hex : hex
        }

        return "#" + numberToHex(r) + numberToHex(g) + numberToHex(b)
    }
}

function moveInDirection(from, theta, distance) {
    return [
        from[0] + Math.cos(theta) * distance,
        from[1] + Math.sin(theta) * distance
    ]
}

function lerp(a, b, x) {
    return a + (b - a) * x
}

function lerpVec(v1, v2, x) {
    if (v1.length !== v2.length) {
        throw "Vector lengths do not match"
    }

    let result = new Array(v1.length)
    for (let i = 0; i < v1.length; i++) {
        result[i] = lerp(v1[i], v2[i], x)
    }
    return result
}

function moveToward(from, to, distance) {
    let totalDistance = euclideanDistance(from, to)
    let ratio = distance / totalDistance
    return [lerp(from[0], to[0], ratio), lerp(from[1], to[1], ratio)]
}

function approxEqual(v1, v2, epsilon) {
    if (epsilon == null) {
        epsilon = 0.001
    }
    return Math.abs(v1 - v2) < epsilon
}

/**
 * Draws a polygon with rounded corners
 * @param {CanvasRenderingContext2D} ctx The canvas context
 * @param {Array} points A list of `{x, y}` points
 * @radius {number} how much to round the corners
 */
function roundPoly(ctx, points, radius) {
    function distance(p1, p2) {
        return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
    }

    function lerp2D(p1, p2, t) {
        return {
            x: lerp(p1.x, p2.x, t),
            y: lerp(p1.y, p2.y, t)
        }
    }

    const numPoints = points.length

    let corners = []
    for (let i of range(numPoints)) {
        let lastPoint = points[i]
        let thisPoint = points[(i + 1) % numPoints]
        let nextPoint = points[(i + 2) % numPoints]

        let lastEdgeLength = distance(lastPoint, thisPoint)
        let lastOffsetDistance = Math.min(lastEdgeLength / 2, radius)
        let start = lerp2D(
            thisPoint,
            lastPoint,
            lastOffsetDistance / lastEdgeLength
        )

        let nextEdgeLength = distance(nextPoint, thisPoint)
        let nextOffsetDistance = Math.min(nextEdgeLength / 2, radius)
        let end = lerp2D(
            thisPoint,
            nextPoint,
            nextOffsetDistance / nextEdgeLength
        )

        corners.push([start, thisPoint, end])
    }

    ctx.moveTo(corners[0][0].x, corners[0][0].y)
    for (let [start, ctrl, end] of corners) {
        ctx.lineTo(start.x, start.y)
        ctx.quadraticCurveTo(ctrl.x, ctrl.y, end.x, end.y)
    }

    ctx.closePath()
}

/**
 * @param {Array} pollygon
 */
function drawPoly(ctx, pollygon) {
    ctx.beginPath()
    ctx.moveTo(...pollygon[0])
    for (let p of pollygon.slice(1)) {
        ctx.lineTo(...p)
    }
    ctx.closePath()
}

function regularPolygon(ctx, x, y, radius, n) {
    ctx.moveTo(
        x + radius * Math.cos(0),
        y + radius * Math.sin(0)
    )

    for (let i = 1; i < n + 1; i++) {
        let theta = i * 2 * Math.PI / n
        ctx.lineTo(
            x + radius * Math.cos(theta),
            y + radius * Math.sin(theta)
        )
    }
}


function randomPoly(simplex, center, radius, t, varience, numPoints) {
    const TWO_PI = 2 * Math.PI
    numPoints = numPoints || 30
    let points = []
    for (let i of range(numPoints)) {
        let theta = (TWO_PI / numPoints) * i
        let random = simplex.noise3D(
            t,
            Math.cos((TWO_PI * i) / numPoints),
            Math.sin((TWO_PI * i) / numPoints)
        )
        random = random / 2 + 0.5

        let distance = varience * radius * random + (1 - varience) * radius
        points.push(moveInDirection(center, theta, distance))
    }
    return points
}

function startAnimating(callback, fps) {
    let fpsInterval = 1000 / fps
    let then = Date.now()
    let uid = "animation_" + then
    window[uid] = true

    function animate() {
        if (!window[uid]) {
            return
        }

        requestAnimationFrame(animate)

        now = Date.now()
        elapsed = now - then

        if (elapsed > fpsInterval) {
            then = now - (elapsed % fpsInterval)
            callback(elapsed)
        }
    }

    animate()
    return uid
}

function stopAnimation(uid) {
    delete window[uid]
}

function* islice(it, start, stop) {
    start = start || 0
    if (typeof stop === "undefined") {
        stop = Number.MAX_SAFE_INTEGER
    }
    for (let i = 0; i < stop; i++) {
        let val = it.next().value
        if (i >= start) {
            yield val
        }
    }
}

function* enumerate(it) {
    let i = 0
    for (let x of it) {
        yield [i, x]
        i++
    }
}

function shuffle(array, random) {
    random = random || Math.random.bind(Math)

    let i = 0,
        j = 0,
        temp = null

    for (i = array.length - 1; i > 0; i -= 1) {
        j = Math.floor(random() * (i + 1))
        temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
}

/**
 * @param {Array} data
 */
function calculateMeanStdv(data) {
    let sum = 0
    for (let x of data) {
        sum += x
    }
    let mean = sum / data.length

    let sumSqrdDif = 0
    for (let x of data) {
        sumSqrdDif += (x - mean) ** 2
    }
    let meanSqrdDif = sumSqrdDif / data.length
    return [mean, Math.sqrt(meanSqrdDif)]
}
