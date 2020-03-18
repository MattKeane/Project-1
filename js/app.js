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
		ctx.rect(this.x * 75, this.y * 75, 75, 75)
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
		ctx.rect(this.x * 75, this.y * 75, 75, 75)
		ctx.fillStyle = "rgb(100, 100, 100)"
		ctx.fill()
		ctx.rect(this.x * 75, this.y * 75, 75, 75)
		ctx.lineWidth = 1
		ctx.strokeStyle = "black"
		ctx.stroke()
	}
}

class Player {
	constructor(x, y, color) {
		this.x = x
		this.y = y
		this.color = color
	}
	draw () {
		ctx.beginPath()
		ctx.arc(this.x, this.y, 30, 0, Math.PI * 2)
		ctx.fillStyle = this.color
		ctx.fill()
	}
}

const game = {
	tiles: [],

	drawBoard: function () {
		for (let i = 0; i < this.tiles.length; i++) {
			this.tiles[i].draw()
		}
	},

	clearBoard: function () {
		ctx.clearRect(0, 0, board.width, board.height)
	}
}


for (let i = 0; i < 4; i++) {
	for (let j = 0; j < 12; j++) {
		game.tiles.push(new Floor(j, i * 2))
	}
	for (let j = 0; j < 11; j++) {
		game.tiles.push(new Wall(j, i * 2 + 1))
	}
	game.tiles.push(new Floor(11, i * 2 + 1))
}

game.drawBoard()

const player1 = new Player(40, 40, "blue")
player1.draw()