function twentyeight(rng) {
    function drawBlob(points, width) {
        const minWidth = width / 4
        
        if (points.length == 0) {
            return
        }
        if (points.length == 1) {
            let r = rng.nextFloatRange(minWidth, width)
            ctx.moveTo(...points[0])
            ctx.arc(...points[0], r / 2, 0, 2 * Math.PI)
            return 
        }
        let outline = []
        let r0 = rng.nextFloatRange(minWidth, width)
        let [x0, y0] = p0 = points[0]
        let [x1, y1] = points[1]
        let angle = Math.atan2(y0 - y1, x0 - x1)
        outline.push(moveInDirection(p0, angle - Math.PI / 2, r0))
        outline.push(moveInDirection(p0, angle, r0))
        outline.push(moveInDirection(p0, angle + Math.PI / 2, r0))

        for (let i = 1; i < points.length - 1; i++) {
            angle = Math.atan2(
                points[i-1][1] - points[i+1][1],
                points[i-1][0] - points[i+1][0]
            )
            let p = points[i]
            let r = rng.nextFloatRange(minWidth, width)
            outline.push(moveInDirection(p, angle + Math.PI / 2, r))
            outline.unshift(moveInDirection(p, angle - Math.PI / 2, r))

        }

        let [xN, yN] = pN = points[points.length - 1]
        let [xN1, yN1] = points[points.length - 2]
        let angleN = Math.atan2(yN - yN1, xN - xN1)
        let rN = rng.nextFloatRange(minWidth, width)
        outline.push(moveInDirection(pN, angleN - Math.PI / 2, rN))
        outline.push(moveInDirection(pN, angleN, rN))
        outline.push(moveInDirection(pN, angleN + Math.PI / 2, rN))
        
        roundPoly(ctx, outline.map(([x, y]) => ({x, y})), 100)
    }

    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const width = 1200
    const height = 600

    canvas.width = width
    canvas.height = height


    const NOISE_SCALE = 300
    const MAX_STEP_SIZE = 30
    const MIN_STEP_SIZE = 3
    const PATH_LENGTH = 160
    const OVERFLOW = 100
    const DROPLET_DENSITY = .3
    const MAX_GROUP_SPREAD = 50
    const BLOB_WIDTH = 15
    const NUM_STROKES = 100
    const NUM_PASSES = 1

    const BACKGROUND_COLOR = "#D9E1CD"
    const PALETTE = [ "#E56A49", "#EFDA59", "#2FB6DA", "#2A7FB9" ]

    ctx.fillStyle = BACKGROUND_COLOR
    ctx.fillRect(0, 0, width, height)

    for (let _ of range(NUM_STROKES)) {
        const directionField = SimplexNoise.prototype.noise2D.bind(
            new SimplexNoise(rng.nextFloat.bind(rng)))
        const magnitudeField = SimplexNoise.prototype.noise2D.bind(
            new SimplexNoise(rng.nextFloat.bind(rng)))

        ctx.beginPath()
        let origX = rng.nextRange(width)
        let origY = rng.nextRange(height)

        for (let pass = 0; pass < NUM_PASSES; pass++) {
            let x = origX
            let y = origY
            let currentGroup = []
            let distanceToLastInGroup = 0
            for (let i = 0; i < PATH_LENGTH; i++) {
                let noise = directionField(x / NOISE_SCALE, y / NOISE_SCALE)
                let theta = noise * Math.PI
                let magnitude = 
                    (magnitudeField(x / NOISE_SCALE, y / NOISE_SCALE) + 1) /2
                let step = lerp(MIN_STEP_SIZE, MAX_STEP_SIZE, magnitude)
                let [newX, newY] = moveInDirection([x, y], theta, step)
                x = newX
                y = newY
                if (
                    x < -OVERFLOW || x > width + OVERFLOW ||
                    y < -OVERFLOW || y > height + OVERFLOW
                ) {
                    break
                }

                
                distanceToLastInGroup += step
                if (rng.nextFloat() < DROPLET_DENSITY) {
                    // ctx.fillStyle = "red"
                    // ctx.fillRect(x, y, 3, 3)
                    if (currentGroup.length == 0) {
                        currentGroup.push([x, y])
                    } else if (distanceToLastInGroup > MAX_GROUP_SPREAD) {
                        drawBlob(currentGroup, BLOB_WIDTH)
                        currentGroup = [[x, y]]
                    } else {
                        currentGroup.push([x, y])
                    }
                    distanceToLastInGroup = 0
                } else {
                    // ctx.fillStyle = "black"
                    // ctx.fillRect(x, y, 3, 3)
                }
            }
            drawBlob(currentGroup, BLOB_WIDTH)
        }
        ctx.fillStyle = rng.choice(PALETTE)
        ctx.fill()
    }
}
