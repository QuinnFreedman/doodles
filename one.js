function one(rng) {
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext('2d')

    width = 300
    height = 400

    canvas.width = width
    canvas.height = height

    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, width, height)

    for (let { } of range(30)) {
        const points = range(3).map(() =>
            [rng.nextRange(0, width), rng.nextRange(0, height)])
        ctx.fillStyle = randomColor(...points[0], width, height)
        triangle(ctx, ...points, true)
    }

    // for (let y of range(height)) {
    //     for (let x of range(width)) {
    //         setPixel(ctx, [x, y], randomColor(x, y, width, height))
    //     }
    // }


    function randomColor(x, y, width, height) {
        const letters = "abcdef"
        const colors = []
        const offsets = [0x2357, 0x876, 0x3458]
        for (let i of range(3)) {
            xIndex = Math.round(x / width * letters.length)
            yIndex = Math.round(y / height * letters.length)
            let a = letters[(xIndex + offsets[i]) % letters.length]
            let b = letters[(yIndex + offsets[i]) % letters.length]
            colors.push(i == 1 ? b + a : a + b)
        }
        return "#" + colors.join('')
    }
}
