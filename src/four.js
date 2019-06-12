function four(rng) {
    const NUM_POINTS = 30
    const FREQ = 8 * 6
    const AMPLITUDE = 70
    const CYCLE_SPREAD = (Math.PI * 2) / 3
    const MARGIN = 50

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
        x: Math.round(rng.nextRange(-MARGIN, width + MARGIN)),
        y: Math.round(rng.nextRange(-MARGIN, height + MARGIN))
    }))

    let sites = []
    for (let site of initialSites) {
        sites.push({...site})
    }

    let offsets = range(sites.length).map(() =>
        rng.normalRange(0, CYCLE_SPREAD)
    )

    let t = 0
    let diagram = null

    const animId = startAnimating(draw, 60)
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

    return () => delete window[animId]

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
