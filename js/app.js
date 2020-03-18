const board = document.querySelector("#board")
const ctx = board.getContext("2d")

class Tile {
	constructor(x, y, passable) {
		this.x = x
		this.y = y
		this.passable = passable
	}
}

class Floor extends Tile {
	constructor(x, y) {
		super(x, y, true)
	}
	draw() {
		ctx.beginPath()
		ctx.rect(this.x * 25, this.y * 25, 25, 25)
		ctx.fillStyle = "rgb(200, 200, 200)"
		ctx.fill()
	}
}

class Wall extends Tile {
	constructor(x,y) {
		super(x, y, false)
	}
	draw () {
		ctx.beginPath()
		ctx.rect(this.x * 25, this.y * 25, 25, 25)
		ctx.fillStyle = "rgb(100, 100, 100)"
		ctx.fill()
		ctx.rect(this.x * 25, this.y * 25, 25, 25)
		ctx.lineWidth = 1
		ctx.strokeStyle = "black"
		ctx.stroke()
	}
}

const game = {
	tiles: [],

	drawBoard: function () {
		for (let i = 0; i < this.tiles.length; i++) {
			this.tiles[i].draw()
		}
	}
}


for (let i = 0; i < 3; i++) {
	for (let j = 0; j < 12; j++) {
		game.tiles.push(new Floor(j, i * 2))
	}
	for (let j = 0; j < 11; j++) {
		game.tiles.push(new Wall(j, i * 2 + 1))
	}
	game.tiles.push(new Floor(11, i * 2 + 1))
}

game.drawBoard()