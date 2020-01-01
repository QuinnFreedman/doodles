function twentyfour(rng) {
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const width = 800
    const height = 600

    canvas.width = width
    canvas.height = height

    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, width, height)

    ctx.lineWidth = 1.2

    for (let i = 0; i < 100; i++) {
        let x = rng.nextRange(width)
        let y = rng.nextRange(height)

        let b = 0.8
        let r = (x + y) / (width + height)
        let g = 1 - r

        ctx.beginPath()
        regularPolygon(ctx, x, y, 200, 20)
        let fillColor = rgbToHex([r, g, b]) + "44"
        ctx.fillStyle = fillColor

        let strokeColor = rgbToHex([r + .2, g + .2, b + .2].map((x) => Math.min(x, 255)))
        ctx.strokeStyle = strokeColor + "66"
        ctx.fill()
        ctx.stroke()

    }
}
