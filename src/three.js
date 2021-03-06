function three(rng) {
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext('2d')

    width = 600
    height = 800

    canvas.width = width
    canvas.height = height

    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, width, height)

    const DELTA_1 = [150, 20]
    const DELTA_2 = [50, 6]
    for (let { } of range(60)) {
        const point1 = [rng.nextRange(0, width), rng.nextRange(0, height)]
        
        const theta2 = rng.nextRange(2 * Math.PI)
        const r2 = rng.normal(...DELTA_1)
        const point2 = moveInDirection(point1, theta2, r2)
        
        const theta3 = theta2 + normalWithUniformSign(Math.PI / 4, Math.PI / 24)
        const r3 = rng.normal(...DELTA_2)
        const point3 = moveInDirection(point1, theta3, r3)
        points = [point1, point2, point3]

        const color = randomColor()
        ctx.fillStyle = color
        triangle(ctx, ...points, true)
        paintStroke(ctx, point1, point2, color)
    }

    
    function normalWithUniformSign(...args) {
        return (rng.nextBool() ? 1 : -1) * rng.normal(...args)
    }

    function randomColor() {
        const r = 1.0
        const gb = rng.normalRange(0, 1)
        return rgbToHex([r, gb, gb])
    }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} strokeStart
 * @param {Array} strokeEnd
 */
function paintStroke(ctx, strokeStart, strokeEnd, color) {
    if (typeof color === "string") {
        color = rgbToHex(color)
    }

    const strokeStep = 5
    const strokeWidthStep = 5
    const strokeWidth = 10
    
    let bristleColors = range(strokeWidth * 2 + 1)
        .map(() => [
            rng.normal(color[0], .05),
            rng.normal(color[1], .05),
            rng.normal(color[2], .05)
        ])
    let bristleOutlineColors = range(strokeWidth * 2 + 1)
        .map(() => [
            rng.normal(color[0], .05),
            rng.normal(color[1], .05),
            rng.normal(color[2], .05)
        ])


    const deltaX = strokeEnd[0] - strokeStart[0]
    const deltaY = strokeEnd[1] - strokeStart[1] 
    const strokeLength = euclideanDistance(strokeStart, strokeEnd)
    const theta = Math.atan2(deltaY, deltaX)

    ctx.fillStyle = "#fff"
    const color255 = color.map((x) => x * 255)
    for (let i of range(Math.round(strokeLength / strokeStep) + 1)) {
        let distance = i * strokeStep
        let tangent = theta - Math.PI / 2
        let centerPoint = moveInDirection(strokeStart, theta, distance)
        centerPoint = moveInDirection(centerPoint, tangent, rng.normal(0, 1))
        let p1 = moveInDirection(centerPoint, tangent, strokeWidth * strokeWidthStep)

        for (let j of range(strokeWidth * 2 + 1)) {
            let latteralDistance = j * strokeWidthStep
            let p = moveInDirection(p1, tangent - Math.PI, latteralDistance)
            let colorAtPoint = ctx.getImageData(...p, 1, 1).data.slice(0, 3)
            let collorDistance = euclideanDistance(color255, colorAtPoint) / 450
            let fillColor = `rgba(${bristleColors[j].map((x) => clamp(0, 255, x * 255)).join(",")},${.5 - collorDistance})`
            for (let c of range(3)) {
                bristleColors[j][c] += rng.normal(0, .01)
            }


            // let outlineColor = `rgba(${bristleOutlineColors[j].map((x) => clamp(0, 255, x * 255)).join(",")},${.5 - collorDistance})`
            ctx.beginPath()
            // ctx.arc(...p, 2, 0, Math.PI * 2)
            ctx.ellipse(...p, 6, 2, theta, 0, Math.PI * 2)
            ctx.fillStyle = fillColor
            ctx.fill()
            // ctx.strokeSyle = outlineColor
            // ctx.stroke()
        }
        ctx.beginPath()
        ctx.arc(...centerPoint, 2, 0, Math.PI * 2)
        ctx.fill()
    }
}

//seed = 1288587599
