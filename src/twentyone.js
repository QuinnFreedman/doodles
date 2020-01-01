function twentyone(rng) {
    const MAX_BRANCH_COUNT = 5
    const BRANCHING_ANGLE_BASE = Math.PI / 3
    const BRANCHING_ANGLE_DECAY = Math.log(rng.nextFloat(), 20) + 1.5
    const BRANCH_LEN_RATIO = rng.nextBool() ? .6 : .7
    const BRANCHING_RATE = 1

    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    const width = 1000
    const height = 800

    canvas.width = width
    canvas.height = height

    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, width, height)

    ctx.lineWidth = 1.5
    // ctx.globalCompositeOperation = "lighter"

    ctx.translate(500, 500)
    let len = 100
    tree(len)

    function tree(len, branchCount, iteration) {
        branchCount = branchCount || 0
        iteration = iteration || 0
        if (branchCount > MAX_BRANCH_COUNT || len < 5) {
            return
        }
    
        ctx.beginPath()
        ctx.strokeStyle = lerpColor("#00ff00", "#ff0000", iteration / 10)

        ctx.moveTo(0, 0)
        ctx.lineTo(0, -len)
        
        ctx.stroke()

        let branchingAngle = BRANCHING_ANGLE_BASE / ((iteration + 1) * BRANCHING_ANGLE_DECAY)
        let shouldBranch = rng.nextFloat() < BRANCHING_RATE


        if (shouldBranch) {
            ctx.save()
            ctx.translate(0, -len)
            ctx.rotate(-branchingAngle)
            tree(len * BRANCH_LEN_RATIO, branchCount + 1, iteration + 1)
            ctx.restore()
        }
        
        
        ctx.save()
        ctx.translate(0, -len)
        tree(len * BRANCH_LEN_RATIO, branchCount, iteration + 1)
        ctx.restore()


        if (shouldBranch) {
            ctx.save()
            ctx.translate(0, -len)
            ctx.rotate(branchingAngle)
            tree(len * BRANCH_LEN_RATIO, branchCount + 1, iteration + 1)
            ctx.restore()
        }
    }

}
