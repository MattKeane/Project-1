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

	drawBoard: function () {
		for (let i = 0; i < this.tiles.length; i++) {
			this.tiles[i].draw()
		}
	},

	clearBoard: function () {
		ctx.clearRect(0, 0, board.width, board.height)
	},

	move: function(key) {
		if (key === "a") {
			player1.move("left")
		} else if (key === "s") {
			player1.move("down")
		} else if (key === "d") {
			player1.move("right")
		} else if (key === "w") {
			player1.move("up")
		} else if (key === "j") {
			player2.move("left")
		} else if (key === "k") {
			player2.move("down")
		} else if (key === "l") {
			player2.move("right") 
		} else if (key === "i") {
			player2.move("up")
		}
		// switch (key) {
		// 	case "a":
		// 		player1.move("left")
		// 		break
		// 	case "s":
		// 		player1.move("down")
		// 		break
		// 	case "d":
		// 		player1.move("right")
		// 		break
		// 	case "w":
		// 		player1.move("up")
		// 		break
		// }
		this.clearBoard()
		this.drawBoard()
		player1.draw()
		player2.draw()
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
	game.move(event.key)
})