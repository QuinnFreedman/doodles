function four(rng) {
    const NUM_POINTS = 30

    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    // canvas.style.border = "3px solid black"

    const width = 800
    const height = 600

    canvas.width = width
    canvas.height = height

    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, width, height)

    voronoi = new Voronoi()

    let initialSites = range(NUM_POINTS).map(() => ({
        x: Math.round(rng.nextRange(width)),
        y: Math.round(rng.nextRange(height))
    }))

    let sites = []
    for (let site of initialSites) {
        sites.push(site)
    }

    let offsets = range(sites.length).map(() =>
        rng.nextRange(0, (Math.PI * 2) / 3)
    )

    // ctx.fillStyle = "#f00"
    // for (let {x, y} of sites) {
    //     ctx.beginPath()
    //     ctx.arc(x, y, 5, 0, Math.PI * 255)
    //     ctx.fill()
    // }

    let t = 0
    let diagram = null

    setInterval(draw, 100)
    // draw()
    function draw() {
        canvas.width = width
        ctx.fillStyle = "#8addee"
        t++
        for (let i of range(sites.length)) {
            sites[i].x = initialSites[i].x + Math.sin(offsets[i] + t / 8) * 4
        }
        voronoi.recycle(diagram)
        diagram = voronoi.compute(sites, {
            xl: 0,
            xr: width,
            yt: 0,
            yb: height
        })


        for (let cell of diagram.cells) {
            let edges =cell.halfedges.map((he) => he.edge) 

            let points = polyFromEdges(edges)
            
            let center = [
                points.map(({x}) => x).reduce((a, b) => a + b) / points.length,
                points.map(({y}) => y).reduce((a, b) => a + b) /points.length 
            ]

            points = points
                .map(({ x, y }) => moveToward([x, y], center, 10))
                .map(([x, y]) => ({ x, y }))

            ctx.beginPath()
            // ctx.moveTo(points[0].x, points[0].y)
            // points.forEach(p => ctx.lineTo(p.x, p.y))
            // ctx.closePath()
            roundPolly(ctx, points, 20)
            ctx.fill()
        }
    }

    /**
     * @param {Array} edges
     */
    function polyFromEdges(edges) {
        const pointsEqual = (a, b) =>
            approxEqual(a.x, b.x) && approxEqual(a.y, b.y)

        let edge1 = edges.pop()
        let points = [edge1.va, edge1.vb]
        while (edges.length) {
            let point = points[points.length - 1]
            let edgeToRemove = -1
            for (let i of range(edges.length)) {
                let edge = edges[i]
                if (pointsEqual(point, edge.va)) {
                    points.push(edge.vb)
                    edgeToRemove = i
                    break
                } else if (pointsEqual(point, edge.vb)) {
                    points.push(edge.va)
                    edgeToRemove = i
                    break
                }
            }
            edges.splice(edgeToRemove, 1)
        }

        points.pop()
        return points
    }
}
function approxEqual(v1, v2, epsilon) {
    if (epsilon == null) {
        epsilon = 0.001
    }
    return Math.abs(v1 - v2) < epsilon
}
/**
 * From https://riptutorial.com/html5-canvas/example/18766/render-a-rounded-polygon-
 */
function roundPolly(ctx, points, radius) {
    var i,
        x,
        y,
        len,
        p1,
        p2,
        p3,
        v1,
        v2,
        sinA,
        sinA90,
        radDirection,
        drawDirection,
        angle,
        halfAngle,
        cRadius,
        lenOut
    var asVec = function(p, pp, v) {
        // convert points to a line with len and normalised
        v.x = pp.x - p.x // x,y as vec
        v.y = pp.y - p.y
        v.len = Math.sqrt(v.x * v.x + v.y * v.y) // length of vec
        v.nx = v.x / v.len // normalised
        v.ny = v.y / v.len
        v.ang = Math.atan2(v.ny, v.nx) // direction of vec
    }
    v1 = {}
    v2 = {}
    len = points.length // number points
    p1 = points[len - 1] // start at end of path
    for (i = 0; i < len; i++) {
        // do each corner
        p2 = points[i % len] // the corner point that is being rounded
        p3 = points[(i + 1) % len]
        // get the corner as vectors out away from corner
        asVec(p2, p1, v1) // vec back from corner point
        asVec(p2, p3, v2) // vec forward from corner point
        // get corners cross product (asin of angle)
        sinA = v1.nx * v2.ny - v1.ny * v2.nx // cross product
        // get cross product of first line and perpendicular second line
        sinA90 = v1.nx * v2.nx - v1.ny * -v2.ny // cross product to normal of line 2
        angle = Math.asin(sinA) // get the angle
        radDirection = 1 // may need to reverse the radius
        drawDirection = false // may need to draw the arc anticlockwise
        // find the correct quadrant for circle center
        if (sinA90 < 0) {
            if (angle < 0) {
                angle = Math.PI + angle // add 180 to move us to the 3 quadrant
            } else {
                angle = Math.PI - angle // move back into the 2nd quadrant
                radDirection = -1
                drawDirection = true
            }
        } else {
            if (angle > 0) {
                radDirection = -1
                drawDirection = true
            }
        }
        halfAngle = angle / 2
        // get distance from corner to point where round corner touches line
        lenOut = Math.abs((Math.cos(halfAngle) * radius) / Math.sin(halfAngle))
        if (lenOut > Math.min(v1.len / 2, v2.len / 2)) {
            // fix if longer than half line length
            lenOut = Math.min(v1.len / 2, v2.len / 2)
            // ajust the radius of corner rounding to fit
            cRadius = Math.abs(
                (lenOut * Math.sin(halfAngle)) / Math.cos(halfAngle)
            )
        } else {
            cRadius = radius
        }
        x = p2.x + v2.nx * lenOut // move out from corner along second line to point where rounded circle touches
        y = p2.y + v2.ny * lenOut
        x += -v2.ny * cRadius * radDirection // move away from line to circle center
        y += v2.nx * cRadius * radDirection
        // x,y is the rounded corner circle center
        ctx.arc(
            x,
            y,
            cRadius,
            v1.ang + (Math.PI / 2) * radDirection,
            v2.ang - (Math.PI / 2) * radDirection,
            drawDirection
        ) // draw the arc clockwise
        p1 = p2
        p2 = p3
    }
    ctx.closePath()
}
