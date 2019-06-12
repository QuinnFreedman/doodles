function fifteen(rng) {
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const width = 1200
    const height = 800

    canvas.width = width
    canvas.height = height

    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, width, height)

    let colors = [
        "#00FF00",
        "#FFFF00",
        "#FF3300",
        "#5600FF",
        "#00FF99",
        "#50BFE6",
        "#FF6EFF",
        "#EE34D2",

        "#FF00aa",
        "#00DDFF",
    ]

    shuffle(colors, rng.nextFloat.bind(rng))

    const NUM_LINES = 5
    const LINE_LENGTH = 8
    const SPREAD = 100
    const OVERLAP = false

    ctx.lineWidth = 20
    ctx.strokeStyle = "white" 
    ctx.shadowBlur = 30
    ctx.lineCap = "round"
    let paths = []
    for (let {} of range(NUM_LINES)) {
        paths.push(range(LINE_LENGTH)
            .map(() => [rng.nextRange(-SPREAD, width + SPREAD),
                        rng.nextRange(-SPREAD, height + SPREAD)])
        )
    }

    for (let i of range(paths.length)) {
        let path = paths[i]
        ctx.shadowColor = colors[i]
        smoothPath(path)
        ctx.stroke()
    }
    
    if (!OVERLAP) {
        ctx.shadowBlur = 0
        for (let i of range(paths.length)) {
            let path = paths[i]
            ctx.shadowColor = colors[i]
            smoothPath(path)
            ctx.stroke()
        }
    }

    function smoothPath(points) {
        // ctx.fillStyle = "#220022"
        // for (let p of points) {
        //     ctx.beginPath()
        //     ctx.arc(...p, 5, 0, Math.PI * 2)
        //     ctx.fill()
        // }
        let centerPoints = []
        for (let i of range(points.length - 1)) {
            let p1 = points[i]
            let p2 = points[i + 1]
            let p = lerpVec(p1, p2, .5)
            centerPoints.push(p)
            // ctx.fillStyle = "#ff5555"
            // ctx.beginPath()
            // ctx.arc(...p, 5, 0, Math.PI * 2)
            // ctx.fill()
        }

        ctx.beginPath()
        ctx.moveTo(...centerPoints[0])
        for (let i of range(1, centerPoints.length)) {
            ctx.quadraticCurveTo(...points[i], ...centerPoints[i])
        }

    }
}
