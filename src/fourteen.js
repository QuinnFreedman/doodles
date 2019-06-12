function fourteen(rng) {
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const width = 800
    const height = 600

    canvas.width = width
    canvas.height = height

    const simplex = new SimplexNoise(rng.nextFloat.bind(rng))
            
    const image = ctx.createImageData(width, height)
    const imageData = image.data

    const INITIAL_VARIENCE = 1 / 50

    let y = 0
    for (let x of range(width)) {
        let cell = (x + y * width) * 4
        imageData[cell + 0] = (simplex.noise2D(x * INITIAL_VARIENCE, 0)  / 2 + 1) * 255
        imageData[cell + 1] = (simplex.noise2D(x * INITIAL_VARIENCE, 10) / 2 + 1) * 255
        imageData[cell + 2] = (simplex.noise2D(x * INITIAL_VARIENCE, 20) / 2 + 1) * 255
        imageData[cell + 3] = 255
    }
    
    const BLEED_RATE = .4
    const SPAWN_RATE = .005
    for (y = y + 1; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let cell = (x + y * width) * 4

            let random = rng.nextFloat()
            let otherX, otherY
            if (random < BLEED_RATE) {
                otherX = x - 1
                otherY = y - 1
            } else if (random < 2 * BLEED_RATE) {
                otherX = x + 1
                otherY = y - 1
            } else if (random < 2 * BLEED_RATE + SPAWN_RATE) {
                otherX = x
                otherY = 0
            } else {
                otherX = x
                otherY = y - 1
            }
            let otherCell = (otherX + otherY * width) * 4
            imageData[cell + 0] = imageData[otherCell + 0] 
            imageData[cell + 1] = imageData[otherCell + 1] 
            imageData[cell + 2] = imageData[otherCell + 2] 
            imageData[cell + 3] = 255
        }
    }

    console.log(image)

    ctx.putImageData(image, 0, 0)
}
