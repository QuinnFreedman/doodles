function two(rng) {
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext('2d')

    width = 600
    height = 900

    canvas.width = width
    canvas.height = height

    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, width, height)

    for (let {} of range(10000)) {
        let x1 = rng.normalRange(width)
        let y1 = rng.nextRange(height)

        let x2 = rng.normal(x1, width/12)
        let y2 = rng.normal(y1, height/50)

        let colorPoint = rng.nextBool() ? x1 : x2
        ctx.strokeStyle = lerpColor("#29d28c", "#b12ad3", colorPoint / width)
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
    }
        
}
