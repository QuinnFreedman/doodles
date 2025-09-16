function thirtythree(rng) {
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const GRID_WIDTH = rng.nextRange(6, 9)
    const GRID_HEIGHT = rng.nextRange(5, 8)
    const TILE_WIDTH = 100
    const MARGIN = 50
    const CANVAS_WIDTH = 2 * MARGIN + (GRID_WIDTH + 1) * TILE_WIDTH
    const CANVAS_HEIGHT = 2 * MARGIN + (GRID_HEIGHT + 1) * TILE_WIDTH

    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
    
    ctx.fillStyle = "#eed"
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    const OVERLAP_PADDING = 20
    ctx.lineWidth = 10
    
    const DATA = Array(GRID_WIDTH)
    for (let y of xrange(GRID_HEIGHT)) {
        DATA[y] = Array(GRID_WIDTH)
        for (let x of xrange(GRID_WIDTH)) {
            DATA[y][x] = rng.nextInt() % 5; // Number >=3 determines how much overlap
        }
    }

    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            const cell = DATA[y][x];
            ctx.save()
            ctx.translate(MARGIN + TILE_WIDTH / 2 + x * TILE_WIDTH,
                          MARGIN + TILE_WIDTH / 2 + y * TILE_WIDTH)

            // ctx.strokeStyle="red";
            // ctx.lineWidth = 1
            // ctx.strokeRect(0, 0, TILE_WIDTH, TILE_WIDTH); 
            // ctx.strokeStyle="black";
            // ctx.lineWidth = 10

            switch (cell) {
                case 0: {
                    ctx.moveTo(TILE_WIDTH / 2, 0)

                    ctx.arc(0, 0, TILE_WIDTH / 2, 0, Math.PI / 2)

                    ctx.moveTo(TILE_WIDTH / 2, TILE_WIDTH)
                    ctx.arc(TILE_WIDTH, TILE_WIDTH, TILE_WIDTH / 2,
                            Math.PI, 3 / 2 * Math.PI)
                
                    ctx.stroke()
                } break;
                case 1: {
                    ctx.moveTo(TILE_WIDTH, TILE_WIDTH / 2)

                    ctx.arc(TILE_WIDTH, 0, TILE_WIDTH / 2, Math.PI / 2, Math.PI)

                    ctx.moveTo(0, TILE_WIDTH / 2)
                    ctx.arc(0, TILE_WIDTH, TILE_WIDTH / 2, 3 / 2 * Math.PI, 0)
                    
                    ctx.stroke()
                } break;
                default: {
                    if ((x + y) % 2 == 1) {
                        ctx.moveTo(TILE_WIDTH / 2, 0)
                        ctx.lineTo(TILE_WIDTH / 2, TILE_WIDTH)

                        ctx.moveTo(0, TILE_WIDTH / 2)
                        ctx.lineTo(TILE_WIDTH / 2 - OVERLAP_PADDING, TILE_WIDTH / 2)
                
                        ctx.moveTo(TILE_WIDTH / 2 + OVERLAP_PADDING, TILE_WIDTH / 2)
                        ctx.lineTo(TILE_WIDTH, TILE_WIDTH / 2)
                
                        ctx.stroke()
                    } else {
                        ctx.moveTo(0, TILE_WIDTH / 2)
                        ctx.lineTo(TILE_WIDTH, TILE_WIDTH / 2)

                        ctx.moveTo(TILE_WIDTH / 2, 0)
                        ctx.lineTo(TILE_WIDTH / 2, TILE_WIDTH / 2 - OVERLAP_PADDING)
                
                        ctx.moveTo(TILE_WIDTH / 2, TILE_WIDTH / 2 + OVERLAP_PADDING)
                        ctx.lineTo(TILE_WIDTH / 2, TILE_WIDTH)
                
                        ctx.stroke()
                    }
                } break;
            }

            ctx.restore()
        }
    }

    ctx.beginPath()
    ctx.arc(MARGIN + TILE_WIDTH / 2, MARGIN + TILE_WIDTH / 2, TILE_WIDTH / 2,
            Math.PI / 2, 0)
    ctx.stroke()

    for (let x = 1; x < GRID_WIDTH; x+=2) {
        ctx.beginPath()
        ctx.save()
        ctx.translate(MARGIN + TILE_WIDTH / 2 + x * TILE_WIDTH, MARGIN)

        if (x == GRID_WIDTH - 1) {
            ctx.arc(TILE_WIDTH, TILE_WIDTH / 2, TILE_WIDTH / 2, Math.PI, Math.PI / 2)
        } else {
            ctx.arc(TILE_WIDTH, TILE_WIDTH / 2, TILE_WIDTH / 2, Math.PI, 0)
        }
        
        ctx.stroke()
        ctx.restore()
    }

    for (let x = GRID_HEIGHT % 2 === 0 ? 1 : 0; x < GRID_WIDTH; x+=2) {
        ctx.beginPath()
        ctx.save()
        ctx.translate(MARGIN + TILE_WIDTH / 2 + x * TILE_WIDTH,
                      MARGIN + GRID_HEIGHT * TILE_WIDTH)

        if (x == GRID_WIDTH - 1) {
            ctx.arc(TILE_WIDTH, TILE_WIDTH / 2, TILE_WIDTH / 2, 3 / 2 * Math.PI, Math.PI)
        } else {
            ctx.arc(TILE_WIDTH, TILE_WIDTH / 2, TILE_WIDTH / 2, 0, Math.PI)
        }
        
        ctx.stroke()
        ctx.restore()
    }

    for (let y = 1; y < GRID_HEIGHT; y+=2) {
        ctx.beginPath()
        ctx.save()
        ctx.translate(MARGIN, MARGIN + TILE_WIDTH / 2 + y * TILE_WIDTH)

        if (y == GRID_HEIGHT - 1) {
            ctx.arc(TILE_WIDTH / 2, TILE_WIDTH, TILE_WIDTH / 2, 0, 3 / 2 * Math.PI)
        } else {
            ctx.arc(TILE_WIDTH / 2, TILE_WIDTH, TILE_WIDTH / 2, Math.PI / 2, 3 / 2 * Math.PI)
        }
        
        ctx.stroke()
        ctx.restore()
    }

    for (let y = GRID_WIDTH % 2 === 0 ? 1 : 0; y < GRID_HEIGHT; y+=2) {
        ctx.beginPath()
        ctx.save()
        ctx.translate(MARGIN + TILE_WIDTH * GRID_WIDTH,
                      MARGIN + TILE_WIDTH / 2 + y * TILE_WIDTH)
                      
        if (y == GRID_HEIGHT - 1) {
            ctx.arc(TILE_WIDTH / 2, TILE_WIDTH, TILE_WIDTH / 2, 3 / 2 * Math.PI, Math.PI)
        } else {
            ctx.arc(TILE_WIDTH / 2, TILE_WIDTH, TILE_WIDTH / 2, 3 / 2 * Math.PI, Math.PI / 2)
        }
        
        ctx.stroke()
        ctx.restore()
    }
}
