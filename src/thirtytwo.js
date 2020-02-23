function thirtytwo(rng) {
    {
        const canvas = document.querySelector("canvas")
        const ctx = canvas.getContext("2d")

        const WIDTH = 800
        const HEIGHT = 800
        const MARGIN = 20

        canvas.width = WIDTH
        canvas.height = HEIGHT

        const PALETTE = ["#ff0000", "#00ff00"]

        ctx.fillStyle = "#333"
        ctx.fillRect(0, 0, WIDTH, HEIGHT)

        // For a larger modulus, more iterations might be needed
        // to see the complete picture
        const ITERATIONS = 100

        // You could use any function to seed this visualization. I
        // cose to use Fibonacci numbers modulo a small integer
        const mod = rng.nextRange(4, 32)
        console.log("Modulus is", mod)
        let numbers = [1, 2]
        for (let i = 0; i < ITERATIONS; i++) {
            numbers.push((numbers[i] + numbers[i+1]) % mod)
        }

        let flipColors = rng.nextBool()
        if (flipColors) {
            PALETTE.reverse()
        }

        ctx.translate(MARGIN, MARGIN)
        drawCircles(numbers, ctx, WIDTH - 2 * MARGIN, HEIGHT- 2 * MARGIN, PALETTE)
    }

    /**
     * Given a sequence of numbers (i.e. the output of a function),
     * draws a representation of that patten by walking a numberline
     * drawing arcs
     */
    function drawCircles(numbers, ctx, width, height, colors) {
        let y = height / 2
        let max = Math.max(...numbers)
        let min = Math.min(...numbers)
        let range = max - min

        let clockwise = true
        let arcs = new Map()
        // do a first pass to get all the lines we are 
        // *going* to draw, but don't draw them yet
        for (let i = 1; i < numbers.length; i++) {
            let a = Math.round((numbers[i - 1] - min) / range * width)
            let b = Math.round((numbers[i] - min) / range * width)

            // put them in a map where the key is an encoding of the points
            let key = JSON.stringify([a, b, clockwise])
            arcs.set(key, (arcs.get(key) || 0) + 1)
            clockwise = !clockwise
        }

        // loop through the map to get the greatest radius of any arc
        let maxDistance = 0
        for (let key of arcs.keys()) {
            let [a, b] = JSON.parse(key)
            let distance = Math.abs(a - b)
            if (distance > maxDistance) {
                maxDistance = distance
            }
        }

        // sort all the arcs so that the lines will overlap consistently
        let arcsList = Array.from(arcs.keys()).map(JSON.parse)
        arcsList.sort((a, b) => {
            let distA = Math.abs(a[0] - a[1])
            let distB = Math.abs(b[0] - b[1])
            return distB - distA
        })

        // actually draw the arcs, using their radius as a fraction of
        // the max to pcik a color
        for (let arc of arcsList) {
            let [a, b, clockwise] = arc

            let center = (a + b) / 2
            let radius = Math.abs(a - b) / 2

            ctx.beginPath()
            ctx.moveTo(Math.max(a, b), y)
            ctx.arc(center, y, radius, 0, Math.PI, clockwise)

            let radiusFraction = radius * 2 / maxDistance
            ctx.strokeStyle = lerpColor(...colors, radiusFraction)
            ctx.lineWidth = 1.1
            ctx.stroke()
        }
    }
}
