function forty(rng) {
  const canvas = document.querySelector("canvas")
  const ctx = canvas.getContext("2d")
  const width = 100
  const height = 150
  const cellSize = 5

  canvas.width = width * cellSize
  canvas.height = height * cellSize

  const rule = [] // [1,0,1,1,0,1,0,0]
  for (let x = 0; x < 64; x++) {
    rule[x] = rng.nextRange(4)
  }
  console.log(`rule is: ${JSON.stringify(rule)}`)

  const firstRow = []
  for (let x = 0; x < height; x++) {
    firstRow[x] = rng.nextRange(4)
  }

  const board = [firstRow]

  for (let y = 1; y < height; y++) {
    board[y] = []
    for (let x = 0; x < width; x++) {
      const a = board[y-1][(x - 1 + width) % width]
      const b = board[y-1][x]
      const c = board[y-1][(x + 1) % width]
      const index = a + 4 * b + 8 * c
      board[y][x] = rule[index]
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (board[y][x] === 0) {
        ctx.fillStyle = "#986ec6"
      } else if (board[y][x] === 1) {
        ctx.fillStyle = "#6a62a6"
      } else if (board[y][x] === 2) {
        ctx.fillStyle = "#3c5787"
      } else if (board[y][x] === 3) {
        ctx.fillStyle = "#0a394d"
      }
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
    }
  }
}

