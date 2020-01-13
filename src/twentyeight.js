function twentyeight(rng) {
    /**
     * Given a list of points, draws an blobby shape that encompasses
     * all those points with a variable width controlled by `width`.
     */
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

        // Accumulate a set of points in `outline`
        let outline = []
        // random radius
        let r0 = rng.nextFloatRange(minWidth, width)
        let [x0, y0] = p0 = points[0]
        let [x1, y1] = points[1]
        // create three points to describe the beginning of the shape
        let angle = Math.atan2(y0 - y1, x0 - x1)
        outline.push(moveInDirection(p0, angle - Math.PI / 2, r0))
        outline.push(moveInDirection(p0, angle, r0))
        outline.push(moveInDirection(p0, angle + Math.PI / 2, r0))

        // for each original point, add two points to the outline
        // on opposite sides of the blob
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

        // Do the same thing again for the last point
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

    
    const NOISE_SCALE = 300      // Scale to use for simplex noise
    const MAX_STEP_SIZE = 30     // Distance between droplet candidates in a stroke
    const MIN_STEP_SIZE = 3
    const PATH_LENGTH = 160      // How many steps to make each stroke
    const MARGIN_OVERFLOW = 100  // How far past the edge of the canvas to draw
    const DROPLET_DENSITY = .3   // What ratio of candidate droplets are accepted
    const MAX_GROUP_SPREAD = 50  // How far apart droplets can be to still get grouped into one blob
    const BLOB_WIDTH = 15        // How wide/thick to make blobs
    const NUM_STROKES = 100      // Number of strokes
    const NUM_PASSES = 1         // Number of passes over the same path for each stroke

    const BACKGROUND_COLOR = "#D9E1CD"
    const PALETTE = [ "#E56A49", "#EFDA59", "#2FB6DA", "#2A7FB9" ]

    ctx.fillStyle = BACKGROUND_COLOR
    ctx.fillRect(0, 0, width, height)

    // For each stroke
    for (let _ of range(NUM_STROKES)) {
        // Generate a unique vector field for each stroke
        const directionField = SimplexNoise.prototype.noise2D.bind(
            new SimplexNoise(rng.nextFloat.bind(rng)))
        const magnitudeField = SimplexNoise.prototype.noise2D.bind(
            new SimplexNoise(rng.nextFloat.bind(rng)))

        ctx.beginPath()
        // Pick a starting place for each stroke
        let origX = rng.nextRange(width)
        let origY = rng.nextRange(height)

        // Maybe go over each stroke with multiple passes
        for (let pass = 0; pass < NUM_PASSES; pass++) {
            // Walk along the stroke line in small steps by following the
            // vector field at each step
            let x = origX
            let y = origY
            let currentGroup = []
            let distanceToLastInGroup = 0
            // at each step:
            for (let i = 0; i < PATH_LENGTH; i++) {
                let noise = directionField(x / NOISE_SCALE, y / NOISE_SCALE)
                let theta = noise * Math.PI
                let magnitude = 
                    (magnitudeField(x / NOISE_SCALE, y / NOISE_SCALE) + 1) /2
                let step = lerp(MIN_STEP_SIZE, MAX_STEP_SIZE, magnitude)
                let [newX, newY] = moveInDirection([x, y], theta, step)
                // Move in direction given by vector field
                x = newX
                y = newY
                if (
                    x < -MARGIN_OVERFLOW || x > width + MARGIN_OVERFLOW ||
                    y < -MARGIN_OVERFLOW || y > height + MARGIN_OVERFLOW
                ) {
                    break
                }

                // keep track of how far we've come since the last droplet
                distanceToLastInGroup += step
                // choose if this new candidate should get paint
                if (rng.nextFloat() < DROPLET_DENSITY) {
                    if (currentGroup.length == 0 || 
                        distanceToLastInGroup <= MAX_GROUP_SPREAD
                    ) {
                        // If this is the first drop or if it is close
                        // to the last drop, add it to our group
                        currentGroup.push([x, y])
                    } else {
                        // Otherwise, draw the current group as a blob and then
                        // start a new group
                        drawBlob(currentGroup, BLOB_WIDTH)
                        currentGroup = [[x, y]]
                    }
                    // reset distance count
                    distanceToLastInGroup = 0
                }
            }
            // draw the last blob at the end of the loop
            drawBlob(currentGroup, BLOB_WIDTH)
        }
        // fill all the blobs for this stroke
        ctx.fillStyle = rng.choice(PALETTE)
        ctx.fill()
    }
}
