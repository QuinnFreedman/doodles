function five(rng) {
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext('2d')

    // canvas.style.border = "3px solid black"

    const width = 800
    const height = 600

    canvas.width = width
    canvas.height = height

    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, width, height)

    const interval = 10

    const rows = height / interval + 1
    const cols = width / interval + 1

    const heightmap = new Array(rows)
    for (let y of range(rows)) {
        heightmap[y] = (new Array(cols))
    }

    const points = range(6).map(() => ({
        x: rng.nextRange(0, cols),
        y: rng.nextRange(0, rows)
    }))
    const velocity = points.map(() => rng.nextSign() * .05)
    

    setInterval(draw, 10)
    function draw() {
        for (let y of range(rows)) {
            for (let x of range(cols)) {
                heightmap[y][x] = 0
            }
        }
        
        const radius = 6 * Math.PI / 2
        for (let i of range(points.length)) {
            points[i].y += velocity[i]
            if (points[i].y < -radius) {
                points[i].y = rows + radius
            } else if (points[i].y > rows + radius) {
                points[i].y = -radius
            }
        }

        for (let p of points) {
            for (let y of range(Math.round(p.y - radius),
                                Math.round(p.y + radius))) {
                if (y >= 0 && y < heightmap.length) {
                    for (let x of range(Math.round(p.x - radius),
                                        Math.round(p.x + radius))) {
                        let dx = (p.x - x) / 6
                        let dy = (p.y - y) / 6
                        if (x >= 0 && x < heightmap[0].length) {
                            // heightmap[y][x] += Math.cos(dx) * Math.cos(dy)
                            heightmap[y][x] = Math.max(heightmap[y][x], Math.cos(dx) * Math.cos(dy))
                        }
                    }
                }
            }
        }

        canvas.width = width
        drawDisplacement(heightmap, interval)
    }


    function drawDisplacement(heightmap, interval) {
        ctx.beginPath()
        for (let y of range(heightmap.length)) {
            ctx.moveTo(0, y * interval)
            for (let x of range(heightmap[y].length)) {
                ctx.lineTo(x * interval, (y * interval) - (heightmap[y][x] ** 2 * 30))
            }
        }
        ctx.stroke()
    }
}
