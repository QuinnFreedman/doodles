function thirtyone(rng) {
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const WIDTH = 800
    const HEIGHT = 800

    canvas.width = WIDTH
    canvas.height = HEIGHT

    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    const SMALLEST_SPLIT = 20
    const NUM_SPLIT_RANGE = [2, 4]

    ctx.strokeStyle = "#000"

    function paintRect(x, y, w, h) {
        ctx.strokeRect(x, y, w, h)
        const numSplits = Math.min(w, h) > SMALLEST_SPLIT
            ? rng.nextRange(...NUM_SPLIT_RANGE)
            : 0
        const splitDirection = rng.nextBool()
        for (let i = 0; i < numSplits; i++) {
            if (splitDirection) {
                let _width = w / numSplits
                let _height = h
                let _x = x + i * _width
                let _y = y
                paintRect(_x, _y, _width, _height)
            } else {
                let _width = w
                let _height = h / numSplits
                let _x = x
                let _y = y + i * _height
                paintRect(_x, _y, _width, _height)
            }
        }
    }

    paintRect(0, 0, WIDTH, HEIGHT)

}
