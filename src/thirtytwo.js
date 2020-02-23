function thirtytwo(rng) {
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const WIDTH = 800
    const HEIGHT = 800

    canvas.width = WIDTH
    canvas.height = HEIGHT

    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    const SMALLEST_SPLIT_MAX = 20
    const SMALLEST_SPLIT_MIN = 5
    const LARGEST_SPLIT = WIDTH / 2
    const NUM_SPLITS = 2

    ctx.strokeStyle = "#000"
    const PALETTE = [
        "#FFFFFF",
        "#FF616C", //"#AF2D0B",
        "#FFFA42", //"#AF9B0B",
        "#339ED8", //"#371277",
        "#000000",
    ]

    function shrinkRect([x, y, w, h], margin) {
        return [x + margin, y + margin, w - margin * 2, h - margin * 2]
    }

    function frameRect([x, y, w, h], ratio) {
        let edge = Math.min(w, h) * ratio
        let x2 = x + w
        let y2 = y + h
        ctx.moveTo(x, y + edge)
        ctx.lineTo(x, y)
        ctx.lineTo(x + edge, y)

        ctx.moveTo(x2 - edge, y)
        ctx.lineTo(x2, y)
        ctx.lineTo(x2, y + edge)

        ctx.moveTo(x2, y2 - edge)
        ctx.lineTo(x2, y2)
        ctx.lineTo(x2 - edge, y2)

        ctx.moveTo(x + edge, y2)
        ctx.lineTo(x, y2)
        ctx.lineTo(x, y2 - edge)
    }

    function diagonalLineFill(rect, numLines) {
        const [x, y, w, h] = rect

        ctx.beginPath()
        ctx.rect(...rect)
        ctx.clip()
        
        ctx.beginPath()
        for (let i = 0; i < numLines; i++) {
            let y1 = lerp(y - w, y + h, i / numLines)
            let y2 = y1 + w
            let x1 = x
            let x2 = x + w
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
        }
    }

    function paintRect(x, y, w, h) {
        ctx.save()
        ctx.strokeColor = PALETTE[4]
        if (rng.nextRange(6) == 0) {
            ctx.strokeRect(x, y, w, h)
        }
        ctx.beginPath()
        switch (rng.nextRange(7)) {
            case 0: {
                ctx.fillStyle = PALETTE[2]
                let rect = shrinkRect([x, y, w, h], 5)
                ctx.fillRect(...rect)
            } break
            case 1: {
                let borderColor = PALETTE[1]
                let strokeColor = PALETTE[3]
                let strokeWidth = 5
                let rect = shrinkRect([x, y, w, h], rng.nextRange(strokeWidth))
                ctx.lineWidth = strokeWidth
                ctx.strokeStyle = borderColor
                
                // ctx.strokeRect(...rect)
                ctx.beginPath()
                frameRect(rect, .2)
                ctx.stroke()

                let clipRect = shrinkRect(rect, 10)
                diagonalLineFill(clipRect, 20)
                ctx.strokeStyle = strokeColor
                ctx.lineWidth = 2
                ctx.stroke()
            } break
            case 2: {
                let rect = shrinkRect([x, y, w, h], rng.nextRange(5))
                ctx.strokeStyle = rng.choice([PALETTE[1], PALETTE[3], PALETTE[4]])
                ctx.lineWidth = 2
                ctx.beginPath()
                ctx.rect(...rect)
                let x1 = rect[0]
                let y1 = rect[1]
                let x2 = x1 + rect[2]
                let y2 = y1 + rect[3]
                ctx.moveTo(x1, y1)
                ctx.lineTo(x2, y2)
                ctx.moveTo(x1, y2)
                ctx.lineTo(x2, y1)
                ctx.stroke()
            } break
            case 3: {
                let rect = shrinkRect([x, y, w, h], rng.nextRange(5))
                let [_x, _y, _w, _h] = rect
                ctx.lineWidth = 2
                ctx.strokeStyle = PALETTE[4]
                ctx.beginPath()
                ctx.rect(...rect)
                if (rng.nextBool()) {
                    let numLines = ((_h / HEIGHT) ** (1 / 2)) * HEIGHT / 40
                    for (let i = 0; i < numLines; i++) {
                        let yi = lerp(_y, _y + _h, i / numLines)
                        ctx.moveTo(_x, yi)
                        ctx.lineTo(_x + _w, yi)
                    }
                } else {
                    let numLines = ((_w / WIDTH) ** (1 / 2)) * WIDTH / 40
                    for (let i = 0; i < numLines; i++) {
                        let xi = lerp(_x, _x + _w, i / numLines)
                        ctx.moveTo(xi, _y)
                        ctx.lineTo(xi, _y + _h)
                    }
                }
                ctx.stroke()
            } break
            case 4: {
                ctx.strokeStyle = PALETTE[1]
                let rect = shrinkRect([x, y, w, h], rng.nextRange(10))
                diagonalLineFill(rect, Math.max(w, h) / 5)
                ctx.stroke()
                ctx.save()
                ctx.translate(x + w / 2, y + h / 2)
                ctx.scale(-1, 1)
                ctx.translate(-(x + w / 2), -(y + h / 2))
                diagonalLineFill(rect, Math.max(w, h) / 5)
                ctx.stroke()
                ctx.restore()
            } break
            case 5: {
                let rect = shrinkRect([x, y, w, h], 15)
                frameRect(rect, .25)
                ctx.strokeStyle = PALETTE[3]
                ctx.lineWidth = 6
                ctx.stroke()
            } break
            case 6: {
                let rect = shrinkRect([x, y, w, h], 1)
                ctx.strokeStyle = PALETTE[4]
                ctx.fillStyle = PALETTE[4]
                ctx.strokeRect(...rect)
                let numDots = rng.nextRange(w * h / 30, w * h / 20) + 10
                for (let i = 0; i < numDots; i++) {
                    let _x = Math.abs(rng.normalRange(-w, w))
                    if (x < WIDTH / 2) {
                        _x = w - _x
                    }
                    let _y = rng.nextRange(h)
                    ctx.fillRect(x + _x, y + _y, 1.5, 1.5)
                }
                ctx.stroke()
            } break
            default: {
                console.log("Something went wrong here")
            } break
        }
        ctx.restore()
    }

    function recPaintRect(x, y, w, h, split) {
        
        if (Math.max(w, h) < SMALLEST_SPLIT_MAX ||
            Math.min(w, h) < SMALLEST_SPLIT_MIN ||
            split == false
        ) {
            paintRect(x, y, w, h)
            return
        }

        // let distanceToCenter = Math.abs((x + w/2) - (WIDTH / 2))
        // let shouldSplitBias = (1 - (distanceToCenter / (WIDTH/2))) ** 2
        // shouldSplitBias += Math.min(w, h) / Math.min(WIDTH, HEIGHT)
        // let shouldSplit = rng.nextBool(shouldSplitBias)
        // if (!shouldSplit) return

        let splitDirection = rng.nextBool(w / h)
        let centermostSplit = (x + w/2) < (WIDTH / 2) ? NUM_SPLITS - 1 : 0
        for (let i = 0; i < NUM_SPLITS; i++) {
            let shouldSplit
            if (typeof(split) == "undefined") {
                shouldSplit = true
            } else {
                let splitBias = 0
                if (splitDirection) {
                    splitBias = i == centermostSplit ? 1 : 0
                } else {
                    splitBias = 1
                }

                // splitBias += (Math.max(w, h) / Math.max(WIDTH, HEIGHT)) ** 2
                
                shouldSplit = rng.nextBool(splitBias)
            }
            if (splitDirection) {
                let _width = w / NUM_SPLITS
                let _height = h
                let _x = x + i * _width
                let _y = y
                recPaintRect(_x, _y, _width, _height, shouldSplit)
            } else {
                let _width = w
                let _height = h / NUM_SPLITS
                let _x = x
                let _y = y + i * _height
                recPaintRect(_x, _y, _width, _height, shouldSplit)
            }
        }
    }

    recPaintRect(0, 0, WIDTH, HEIGHT)
    //paintRect(0, 0, WIDTH, HEIGHT / 2)

}

