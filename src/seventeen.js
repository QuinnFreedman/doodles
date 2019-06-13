function seventeen(rng) {
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const width = 900
    const height = 900

    canvas.width = width
    canvas.height = height

    const TWO_PI = 2 * Math.PI

    let grad = ctx.createLinearGradient(0, 0, 0, height)
    grad.addColorStop(0, "#9f9f9f")
    grad.addColorStop(1, "#464646")

    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)

    const center = [width / 2, height / 2]

    // grad = ctx.createLinearGradient(0, 0, 0, height);
    // grad.addColorStop(0, "#464646");
    // grad.addColorStop(1, "#9f9f9f");

    // ctx.strokeStyle = grad

    for (let {} of range(5)) {
        let start = rng.nextRange(0, TWO_PI)
        let end = start + rng.normalRange(1.5 * Math.PI, 1.8 * Math.PI)
        let color = rng.nextBool() ? "white" : "black"
        let lineWidth = rng.nextRange(2, 20)
        let radius = rng.nextRange(width / 3 - 50, width / 3 + 50)
        ctx.strokeStyle = color
        ctx.lineWidth = lineWidth
        ctx.beginPath()
        ctx.arc(...center, radius, start, end)
        ctx.stroke()
    }

    for (let {} of range(rng.nextBool() ? 1 : 2)) {
        ctx.strokeStyle = rng.nextBool() ? "white" : "black"
        ctx.lineWidth = rng.nextRange(2, 20)
        let straight = rng.nextBool()
        let theta = rng.nextRange((-Math.PI * 3) / 4, -Math.PI / 4)
        let distance = rng.nextRange(width / 3 + 100, width / 3 + 150)
        let p1 = moveInDirection(center, theta, distance)
        let p2 = straight
            ? moveInDirection(center, -theta, distance)
            : moveInDirection(center, theta - Math.PI, distance)
        ctx.beginPath()
        ctx.moveTo(...p1)
        ctx.lineTo(...p2)
        ctx.stroke()
    }

    let simplex = new SimplexNoise(rng.nextFloat.bind(rng))

    let image = ctx.getImageData(0, 0, width, height)
    let imageData = image.data

    function getPixelAt(x, y) {
        x = x < 0 ? 0 : x >= width ? width : x
        y = y < 0 ? 0 : y >= height ? height : y

        let cell = (x + y * width) * 4
        const r = imageData[cell]
        const g = imageData[cell + 1]
        const b = imageData[cell + 2]
        return [r, g, b]
    }

    const BLOCK_SIZE = 40
    let blockCountX = width / BLOCK_SIZE
    let blockCountY = height / BLOCK_SIZE
    const NOISE_SCALE = 2
    const NOISE_THRESH = .7
    ctx.lineWidth = 1
    for (let x of range(blockCountX)) {
        for (let y of range(blockCountY)) {
            let rand =
                (simplex.noise2D(
                    (x / blockCountX) * NOISE_SCALE,
                    (y / blockCountY) * NOISE_SCALE
                ) +
                    1) /
                2
            if (rand > NOISE_THRESH) {
                let colorsInRegion = [[], [], []]
                for (let _y of range(y * BLOCK_SIZE, (y + 1) * BLOCK_SIZE)) {
                    for (let _x of range(x * BLOCK_SIZE, (x + 1) * BLOCK_SIZE)) {
                        let color = getPixelAt(_x, _y)
                        for (let i of range(3)) {
                            colorsInRegion[i].push(color[i])
                        }
                    }
                }
                let avgColor = []
                let stdDevs = []
                for (let i of range(3)) {
                    let [mean, stdev] = calculateMeanStdv(colorsInRegion[i])
                    avgColor.push(mean)
                    stdDevs.push(stdev)
                }
                let maxStdv = 0
                for (let s of stdDevs) {
                    if (s > maxStdv) {
                        maxStdv = s
                    }
                }
                if (maxStdv < 3) {
                    break
                }

                let [r, g, b] = avgColor

                console.log(r, g, b)
                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
                ctx.beginPath()
                ctx.rect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
                ctx.fill()
            }
        }
    }
}
