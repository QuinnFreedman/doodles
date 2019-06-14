function nineteen_(rng) {
    const width = 900
    const height = 900

    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    canvas.width = width
    canvas.height = height

    const REFLECTIONS = 6
    const NUM_LINES = 30

    const TWO_PI = Math.PI * 2

    let lines = range(NUM_LINES).map(() => [
        [rng.normalRange(0, width), rng.normalRange(0, width)],
        [rng.normalRange(0, width), rng.normalRange(0, width)]
    ])

    for (let i of range(REFLECTIONS)) {
        ctx.beginPath()
        for (let [start, end] of lines) {
            ctx.moveTo(...start)
            ctx.lineTo(...end)
        }
        ctx.stroke()
        ctx.translate(width / 2, height / 2)
        ctx.rotate(TWO_PI / REFLECTIONS)
        ctx.translate(-width / 2, -height / 2)
    }
}

function nineteen(rng) {
    const width = 900
    const height = 900

    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    canvas.width = width
    canvas.height = height

    const REFLECTIONS = 6
    const FLIP_AFTER = 60 * 7
    const MARGIN = 0

    const TWO_PI = Math.PI * 2

    let t = 0
    let white = false
    const animId = startAnimating(draw, 60)

    function draw() {
        for (let {} of range(REFLECTIONS)) {
            let start = [
                rng.normalRange(MARGIN, width - MARGIN),
                rng.normalRange(MARGIN, height - MARGIN)
            ]
            let end = [
                rng.normalRange(MARGIN, width - MARGIN),
                rng.normalRange(MARGIN, height - MARGIN)
            ]
            ctx.beginPath()
            ctx.moveTo(...start)
            ctx.lineTo(...end)
            ctx.stroke()
            ctx.translate(width / 2, height / 2)
            ctx.rotate(TWO_PI / REFLECTIONS)
            ctx.translate(-width / 2, -height / 2)
        }

        if (t++ >= FLIP_AFTER) {
            ctx.strokeStyle = white ? "black" : "white"
            t = 0
            white = !white
        }
    }

    return () => stopAnimation(animId)
}
