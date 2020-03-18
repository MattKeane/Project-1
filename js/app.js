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
	draw() {
		ctx.beginPath()
		ctx.arc(this.x, this.y, 30, 0, Math.PI * 2)
		ctx.fillStyle = this.color
		ctx.fill()
	}
	move(direction) {
		if (direction === "left" && this.x - 34 >= 0) {
			this.x -= 5
		} else if (direction === "right" && this.x + 34 <= board.width) {
			this.x += 5
		} else if (direction === "down" && this.y + 34 <= board.height) {
			this.y += 5
		} else if (direction === "up" && this.y - 34 >= 0) {
			this.y -= 5
		}
	}
}

const game = {
	tiles: [],

	keysPressed: {},

	players: [new Player(40, 40, "blue"), new Player(300, 40, "red")],

	drawBoard: function () {
		for (let i = 0; i < this.tiles.length; i++) {
			this.tiles[i].draw()
		}
	},

	clearBoard: function () {
		ctx.clearRect(0, 0, board.width, board.height)
	},

	drawPlayers: function () {
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].draw()
		}
	},

	move: function() {
		if (this.keysPressed.a) {
			this.players[0].move("left")
		} if (this.keysPressed.s) {
			this.players[0].move("down")
		} if (this.keysPressed.d) {
			this.players[0].move("right")
		} if (this.keysPressed.w) {
			this.players[0].move("up")
		} if (this.keysPressed.j) {
			this.players[1].move("left")
		} if (this.keysPressed.k) {
			this.players[1].move("down")
		} if (this.keysPressed.l) {
			this.players[1].move("right") 
		} if (this.keysPressed.i) {
			this.players[1].move("up")
		}
		this.clearBoard()
		this.drawBoard()
		this.drawPlayers()
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

const player2 = new Player(300, 40, "red")
player2.draw()

$( document ).on("keydown", (event) => {
	game.keysPressed[event.key] = true
	game.move()
})

$( document ).on("keyup", (event) => {
	delete game.keysPressed[event.key]
})