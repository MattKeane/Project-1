const board = document.querySelector("#board")
const ctx = board.getContext("2d")

class Tile {
	constructor(x, y) {
		this.x = x
		this.y = y
	}
}

class Floor extends Tile {
	constructor(x, y) {
		super(x, y)
	}
	draw() {
		ctx.beginPath()
		ctx.rect(this.x * 25, this.y * 25, 25, 25)
		ctx.fillStyle = "black"
		ctx.fill()
	}
}

const tile1 = new Floor(0, 0)
const tile2 = new Floor(3, 4)