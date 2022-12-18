function thirtynine(rng) {
  const canvas = document.querySelector("canvas")
  const ctx = canvas.getContext("2d")
  const width = 100
  const height = 150
  const cellSize = 5

  canvas.width = width * cellSize
  canvas.height = height * cellSize

  const rule = [] // [1,0,1,1,0,1,0,0]
  for (let x = 0; x < 8; x++) {
    rule[x] = rng.nextRange(2)
  }
  console.log(`rule is: ${JSON.stringify(rule)}`)

  const firstRow = []
  for (let x = 0; x < height; x++) {
    firstRow[x] = rng.nextRange(2)
  }

  const board = [firstRow]

  for (let y = 1; y < height; y++) {
    board[y] = []
    for (let x = 0; x < width; x++) {
      const a = board[y-1][(x - 1 + width) % width]
      const b = board[y-1][x]
      const c = board[y-1][(x + 1) % width]
      const index = a + 2 * b + 4 * c
      board[y][x] = rule[index]
    }
  }

  ctx.fillStyle = "black"
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (board[y][x]) {
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
      }
    }
  }
}

