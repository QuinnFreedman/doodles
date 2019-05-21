function six(rng) {
    const NUM_POINTS = 30
    const MARGIN = 200
    const ACCELERATION = .1
    const TARGET_FPS = 45
    const SPAWN_RATE = .01
    const CREEP_MARGIN = 60
    const CREEP_SPEED = 0.6

    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const width = 800
    const height = 600

    canvas.width = width
    canvas.height = height

    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, width, height)

    voronoi = new Voronoi()

    let sites = range(NUM_POINTS).map(() => ({
        x: Math.round(rng.nextRange(width)),
        y: Math.round(rng.nextRange(height))
    }))

    let diagram = null

    let velocity = []

    let firstTime = true
    let animId = startAnimating(draw, TARGET_FPS)
    // draw()
    function draw() {
        canvas.width = width
        // ctx.fillStyle = "#8addee"
        ctx.fillStyle = "#000"
        voronoi.recycle(diagram)

        if (rng.nextFloat() < SPAWN_RATE || firstTime) {
            firstTime = false
            sites.push({ x: rng.normalRange(width), y: -MARGIN })
            velocity.push(CREEP_SPEED)
        }

        let i = 0
        while (i < velocity.length) {
            let pointIndex = NUM_POINTS + i
            if (sites[pointIndex].y > -CREEP_MARGIN) {
                velocity[i] += ACCELERATION
            }
            sites[pointIndex].y += velocity[i]
            if (sites[pointIndex].y > height + MARGIN) {
                velocity.splice(i, 1)
                sites.splice(pointIndex, 1)
            } else {
                i++
            }
        }


        diagram = voronoi.compute(sites, {
            xl: 0,
            xr: width,
            yt: 0,
            yb: height
        })

        fillVoronoiDiagram(diagram)
    }

    return () => { delete window[animId] }

    function fillVoronoiDiagram(diagram) {
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
}

//seed=111752166

