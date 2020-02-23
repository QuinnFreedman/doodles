function thirtyone(rng) {
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const WIDTH = 800
    const HEIGHT = 800

    canvas.width = WIDTH
    canvas.height = HEIGHT

    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    const SMALLEST_SPLIT = 10 // 20
    const NUM_SPLIT_RANGE = [2, 4]


    const PALETTE = [
        "#9DA8A1",
        "#606D5D",
        "#BC9CB0",
        "#D3CDD7",
        "#DDF2EB"
    ]

    function paintRect(x, y, w, h, color, oldSplitDirection) {
        const numSplits = Math.min(w, h) > SMALLEST_SPLIT
            ? rng.nextRange(...NUM_SPLIT_RANGE)
            : 0
        if (numSplits === 0) {
            let alpha = rng.choice(["ff", "fb", "f8", "f4", "f0"])
            ctx.fillStyle = color + alpha
            ctx.strokeStyle = color + alpha
            ctx.fillRect(x, y, w + 1, h + 1)
            //ctx.strokeRect(x, y, w, h)
        }
        const splitDirection = rng.nextBool(/* w / h */)
        
        if (splitDirection != oldSplitDirection) {
            color = rng.choice(PALETTE)
        }

        for (let i = 0; i < numSplits; i++) {
            if (splitDirection) {
                let _width = w / numSplits
                let _height = h
                let _x = x + i * _width
                let _y = y
                paintRect(_x, _y, _width, _height, color, splitDirection)
            } else {
                let _width = w
                let _height = h / numSplits
                let _x = x
                let _y = y + i * _height
                paintRect(_x, _y, _width, _height, color, splitDirection)
            }
        }
    }

    paintRect(0, 0, WIDTH, HEIGHT)

}
