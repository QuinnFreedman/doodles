function thirtythree(rng) {
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const WIDTH = 800
    const HEIGHT = 800

    canvas.width = WIDTH
    canvas.height = HEIGHT

    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    ctx.fillStyle = "#000"

    points = []
    for (let _ of range(2)) {
        let x = rng.normal(WIDTH/2, WIDTH/8)
        let y = rng.normal(HEIGHT/2, HEIGHT/8)
        points.push({x, y})
    }

    // for (let {x, y} of points) {
    //     ctx.fillRect(x, y, 3, 3)
    // }
    ctx.fillStyle = "#f00"
    ctx.fillRect(points[0].x, points[0].y, 3, 3)
    ctx.fillStyle = "#000"
    ctx.fillRect(points[1].x, points[1].y, 3, 3)

    let cmp = ((p1, p2) => p1.x - p2.x)

    console.log(points.sort(cmp))

    let p0 = points.max(cmp)

    console.log("p0", p0)

    for (let p of points.slice(0, points.length)) {
        console.log("p", p)
        const x1 = p0.x
        const y1 = p0.y
        const x2 = p.x
        const y2 = p.y
        
        let dx = x1 - x2
        let dy = y1 - y2

        console.log(dx, dy)

        let theta = Math.atan(dy / dx)
        console.log(theta)
    }

    

}

Array.prototype.max = function(comparator) {
    if (this.length === 0) {
        return undefined
    }
    if (this.length === 1) {
        return this[0]
    }

    let max = this[0]
    for (let i = 1; i < this.length; i++) {
        if (comparator(max, this[i]) < 0) {
            max = this[i]
        }
    }
    return max
}
