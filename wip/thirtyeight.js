function thirtyeight(rng) {
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const CANVAS_WIDTH = 1200;
    const CANVAS_HEIGHT = 800;

    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT

    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    ctx.beginPath()
    ctx.strokeStyle = "#0003"
    ctx.lineWidth = 1

    const NUM_PARTICLES = 2
    const START_AREA = 300
    const MAX_STARTING_VELOCITY = 1
    const NUM_STEPS = 10000
    const PARTICLE_WEIGHT = .000001
    const CENTER_WEIGHT = .00001
    const RANDOM_WEIGHT = true

    const colors = ["#80451f",
                    "#000000",
                    "#00f"]

    const particles = []
    for (let i of range(NUM_PARTICLES)) {
        let x = rng.nextRange(CANVAS_WIDTH / 2 - START_AREA, CANVAS_WIDTH / 2 + START_AREA)
        let y = rng.nextRange(CANVAS_HEIGHT / 2 - START_AREA, CANVAS_HEIGHT / 2 + START_AREA)
        let theta = Math.atan(y / x)
        theta += rng.nextSign() * Math.PI / 2
        let delta = rng.nextFloatRange(-MAX_STARTING_VELOCITY, MAX_STARTING_VELOCITY)
        let [dx, dy] = moveInDirection([0, 0], theta, delta)
        particles.push({ x, y, dx, dy,
            weight: RANDOM_WEIGHT ? rng.nextFloatRange(PARTICLE_WEIGHT, PARTICLE_WEIGHT * 10) : PARTICLE_WEIGHT,
            color: "#000"
        })
        dx = rng.nextFloatRange(MAX_STARTING_VELOCITY)
        dy = rng.nextFloatRange(MAX_STARTING_VELOCITY)
    }

    const CENTER = {
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2,
    }

    for (let i of range(NUM_STEPS)) {
        for (let p of particles) {
            let startx = p.x
            let starty = p.y
            let fx = 0
            let fy = 0
            for (let other of particles) {
                if (other == p) continue
                const d = distance(p, other)
                fx += (other.x - p.x) * d * other.weight
                fy += (other.y - p.y) * d * other.weight
            }
            const d = distance(p, CENTER)
            fx += (CENTER.x - p.x) * d * CENTER_WEIGHT
            fy += (CENTER.y - p.y) * d * CENTER_WEIGHT
            
            p.dx += fx
            p.dy += fy
            p.x += p.dx
            p.y += p.dy
            //p.x -= particles[0].x - CANVAS_WIDTH / 2
            //p.y -= particles[0].y - CANVAS_HEIGHT / 2
            //ctx.translate(CANVAS_WIDTH / 2 - particles[0].x, CANVAS_HEIGHT / 2 - particles[0].y)
            ctx.beginPath();
            ctx.moveTo(startx, starty)
            ctx.lineTo(p.x, p.y)
            ctx.strokeStyle = p.color
            ctx.resetTransform()
            ctx.stroke()
            
        }
        
    }

}
