function RNG(seed) {
    // LCG using GCC's constants
    this.m = 0x80000000; // 2**31;
    this.a = 1103515245;
    this.c = 12345;

    this.seed = seed ? seed : Math.floor(Math.random() * (this.m - 1));

    this.state = this.seed
}
RNG.prototype.nextInt = function () {
    this.state = (this.a * this.state + this.c) % this.m;
    return this.state;
}
/**
 * returns in range [0,1]
 */
RNG.prototype.nextFloat = function () {
    return this.nextInt() / (this.m - 1);
}

RNG.prototype.nextBool = function () {
    return this.nextFloat() < .5
}
/**
 * returns in range [start, end): including start, excluding end
 * @param {number} start
 * @param {number} end
 */
RNG.prototype.nextRange = function (start, end) {
    if (typeof end === "undefined") {
        end = start
        start = 0
    }
    // can't modulu nextInt because of weak randomness in lower bits
    let rangeSize = end - start;
    let randomUnder1 = this.nextInt() / this.m;
    return start + Math.floor(randomUnder1 * rangeSize);
}
RNG.prototype.choice = function (array) {
    return array[this.nextRange(0, array.length)];
}
RNG.prototype.normal = function (mean, stdev) {
    if (typeof mean === "undefined") mean = 0
    if (typeof stdev === "undefined") stdev = 0
    let u = 0, v = 0
    while (u === 0) u = this.nextFloat()
    while (v === 0) v = this.nextFloat()
    let random = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
    return (random * stdev) + mean
}
/**
 * @param {number} start
 * @param {number} end
 */
RNG.prototype.normalRange = function (start, end) {
    if (typeof end === "undefined") {
        end = start
        start = 0
    }
    let range = end - start
    let stdev = range / 6.0
    let mean = start + (range / 2.0)
    return clamp(start, end, this.normal(mean, stdev))
}

function clamp(min, max, x) {
    return x < min ? min : x > max ? max : x
}

function range(a, b) {
    let min, max
    if (b) {
        min = a
        max = b
    } else {
        min = 0
        max = a
    }
    const values = []
    for (i = min; i < max; i++) {
        values.push(i)
    }

    return values
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

function setPixel(ctx, [x, y], color) {
    if (Array.isArray(color)) {
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
    } else {
        ctx.fillStyle = color
    }
    ctx.fillRect(x, y, 1, 1)
}

function lerpColor(colorA, colorB, t) {
    if (typeof colorA === "string") { colorA = rgbToHex(colorA) }
    if (typeof colorB === "string") { colorB = rgbToHex(colorB) }

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
        let hex = rgbOrHex.replace('#', '');
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
        return [r, g, b].map((x) => x / 255)
    } else if (Array.isArray(rgbOrHex)) {
        let r, g, b
        if (rgbOrHex.some(isFloat)) {
            [r, g, b] = rgbOrHex.map((x) => Math.round(x * 255))
        } else {
            [r, g, b] = rgbOrHex
        }

        const numberToHex = (c) => {
            var hex = c.toString(16)
            return hex.length == 1 ? "0" + hex : hex
        }

        return "#" + numberToHex(r) + numberToHex(g) + numberToHex(b)
    }
}


