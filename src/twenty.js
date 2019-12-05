function twenty(rng) {
    const BRANCHING_RATE = 0.9
    const BRANCH_LENGTH_RATIO_MIN = 0.6
    const BRANCH_LENGTH_RATIO_MAX = 0.8
    const BRANCH_ANGLE_MIN = Math.PI / 12
    const BRANCH_ANGLE_MAX = Math.PI / 4 

    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const width = 1000
    const height = 800

    canvas.width = width
    canvas.height = height

    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, width, height)

    ctx.lineWidth = 1.5
    ctx.globalCompositeOperation = "lighter"

    const NUM_TREES = 200
    for (let i = 0; i < NUM_TREES; i++) {
        ctx.save()
        ctx.beginPath()
        let x = i * (width / NUM_TREES)
        ctx.translate(x, 500)
        let len = 100 * rng.nextFloat()
        tree(len)
        ctx.strokeStyle = rng.nextBool() ? "#0f0" : "#f60"
        ctx.stroke()
        ctx.restore()
    }
    for (let i = 0; i < NUM_TREES; i++) {
        ctx.save()
        ctx.beginPath()
        let x = i * (width / NUM_TREES)
        ctx.translate(x, 500)
        let len = 60 * rng.nextFloat()
        tree(-len)
        ctx.strokeStyle = rng.nextBool() ? "#888" : "#66d"
        ctx.stroke()
        ctx.restore()
    }

    function randomBranchLenRatio() {
        return rng.nextFloat() * (BRANCH_LENGTH_RATIO_MAX - BRANCH_LENGTH_RATIO_MIN) + BRANCH_LENGTH_RATIO_MIN
    }

    function randomBranchAngle() {
        return rng.nextFloat() * (BRANCH_ANGLE_MAX - BRANCH_ANGLE_MIN) + BRANCH_ANGLE_MIN
    }

    function tree(len) {
        if (Math.abs(len) < 10) {
            return
        }

        ctx.moveTo(0, 0)
        ctx.lineTo(0, -len)

        if (rng.nextFloat() < BRANCHING_RATE) {
            ctx.save()
            ctx.translate(0, -len)
            ctx.rotate(-randomBranchAngle())
            tree(len * randomBranchLenRatio())
            ctx.restore()
        }
        
        // if (rng.nextFloat() < BRANCHING_RATE) {
        //     ctx.save()
        //     ctx.translate(0, -len)
        //     tree(len * randomBranchLenRatio())
        //     ctx.restore()
        // }

        if (rng.nextFloat() < BRANCHING_RATE) {
            ctx.save()
            ctx.translate(0, -len)
            ctx.rotate(randomBranchAngle())
            tree(len * randomBranchLenRatio())
            ctx.restore()
        }
    }

}
