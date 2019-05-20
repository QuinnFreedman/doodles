function four(rng) {
    const NUM_POINTS = 30
    const FREQ = 8
    const AMPLITUDE = 6
    const CYCLE_SPREAD = (Math.PI * 2) / 3

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
        rng.normalRange(0, CYCLE_SPREAD)
    )

    let t = 0
    let diagram = null

    setInterval(draw, 100)
    // draw()
    function draw() {
        canvas.width = width
        ctx.fillStyle = "#8addee"
        t++
        for (let i of range(sites.length)) {
            sites[i].x = initialSites[i].x + Math.sin(offsets[i] + t / FREQ) * AMPLITUDE 
        }
        voronoi.recycle(diagram)
        diagram = voronoi.compute(sites, {
            xl: 0,
            xr: width,
            yt: 0,
            yb: height
        })

        for (let cell of diagram.cells) {
            let edges = cell.halfedges.map(he => he.edge)

            let points = polyFromEdges(edges)
            if (!points.length) continue

            let center = [
                points.map(({ x }) => x).reduce((a, b) => a + b) /
                    points.length,
                points.map(({ y }) => y).reduce((a, b) => a + b) / points.length
            ]

            points = points
                .map(({ x, y }) => moveToward([x, y], center, 10))
                .map(([x, y]) => ({ x, y }))

            ctx.beginPath()
            roundPolly(ctx, points, 20)
            ctx.fill()
        }
    }

    /**
     * @param {Array} edges
     */
    function polyFromEdges(edges) {
        if (!edges.length) return []
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
 * Draws a polygon with rounded corners
 * @param {CanvasRenderingContext2D} ctx The canvas context
 * @param {Array} points A list of `{x, y}` points
 * @radius {number} how much to round the corners
 */
function roundPolly(ctx, points, radius) {
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
