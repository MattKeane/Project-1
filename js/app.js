const board = document.querySelector("#board")
const ctx = board.getContext("2d")

class Tile {
	constructor(x, y, passable, goal, button) {
		this.button = false
		this.x = x * 75
		this.y = y * 75
		this.passable = passable
		this.tlCorner = {
			"x": this.x,
			"y": this.y
		}
		this.trCorner = {
			"x": this.x + 75,
			"y": this.y
		}
		this.blCorner = {
			"x": this.x,
			"y": this.y + 75
		}
		this.brCorner = {
			"x": this.x + 75,
			"y": this.y + 75
		}
		this.goal = goal
	}
}

class Floor extends Tile {
	constructor(x, y) {
		super(x, y, true, false, false)
	}
	draw() {
		ctx.beginPath()
		ctx.rect(this.x, this.y, 75, 75)
		ctx.fillStyle = "rgb(200, 200, 200)"
		ctx.fill()
	}
}

class Wall extends Tile {
	constructor(x, y) {
		super(x, y, false, false, false)
	}
	draw () {
		ctx.beginPath()
		ctx.rect(this.x, this.y, 75, 75)
		ctx.fillStyle = "rgb(100, 100, 100)"
		ctx.fill()
		ctx.rect(this.x, this.y, 75, 75)
		ctx.lineWidth = 1
		ctx.strokeStyle = "black"
		ctx.stroke()
	}
}

class Goal extends Tile {
	constructor(x, y) {
		super(x, y, true, true, false)
	}
	draw() {
		ctx.beginPath()
		ctx.rect(this.x, this.y, 75, 75)
		ctx.fillStyle = "gold"
		ctx.fill()
	}
}

class Button extends Tile {
	constructor(x, y, color, id) {
		super(x, y, true, false, true)
		this.color = color
		this.id = id
		game.addButton(this)
	}
	draw() {
		ctx.beginPath()
		ctx.rect(this.x, this.y, 75, 75)
		ctx.fillStyle = "rgb(200, 200, 200)"
		ctx.fill()
		ctx.beginPath()
		ctx.arc(this.x + 37, this.y +37, 35, 0, Math.PI * 2)
		ctx.fillStyle = this.color
		ctx.fill()
	}
}

class Gate extends Tile {
	constructor(x, y, color, id) {
		super(x, y, false, false, false)
		this.color = color
		this.id = id
		game.addGate(this)
	}
	draw() {
		if (this.passable) {
			ctx.beginPath()
			ctx.rect(this.x, this.y, 75, 75)
			ctx.fillStyle = ("rgb(200, 200, 200)")
			ctx.fill()
			ctx.beginPath()
			ctx.rect(this.x, this.y, 75, 75)
			ctx.strokeStyle = this.color
			ctx.lineWidth = 2
			ctx.stroke()
		} else {
			ctx.beginPath()
			ctx.rect(this.x, this.y, 75, 75)
			ctx.fillStyle = ("rgb(200, 200, 200)")
			ctx.fill()
			ctx.beginPath()
			ctx.rect(this.x, this.y, 75, 75)
			ctx.strokeStyle = this.color
			ctx.lineWidth = 2
			ctx.stroke()
			for (let i = 1; i < 4; i++) {
				ctx.beginPath()
				ctx.moveTo(this.x + i * 19, this.y)
				ctx.lineTo(this.x + i * 19, this.y + 75)
				ctx.strokeStyle = this.color
				ctx.lineWidth = 2
				ctx.stroke()
			}
		}

	}
	open() {
		this.passable = true
	}
	close() {
		this.passable = false
	}
}

class Hazard extends Tile {
	constructor(x, y, damage) {
		super(x, y, true, false, false)
		this.damage = damage
		game.addHazard(this)
	}
}

class Lava extends Hazard {
	constructor(x, y) {
		super(x, y, 1)
	}
	draw() {
		ctx.beginPath()
		ctx.rect(this.x, this.y, 75, 75)
		ctx.fillStyle = "orange"
		ctx.fill()
		for (let i = 0; i < 3; i++) {
			ctx.beginPath()
			ctx.moveTo(this.x, this.y + 30 * i + 15)
			ctx.lineTo(this.x + 19, this.y + 30 * i)
			ctx.lineTo(this.x + 38, this.y + 30 * i + 15)
			ctx.lineTo(this.x + 57, this.y + 30 * i)
			ctx.lineTo(this.x + 75, this.y + 30 * i + 15)
			ctx.strokeStyle = "yellow"
			ctx.lineWidth = 5
			ctx.stroke()
		}
		for (let i = 0; i < 2; i++) {
			ctx.beginPath()
			ctx.moveTo(this.x, this.y + 30 * i + 30)
			ctx.lineTo(this.x + 19, this.y + 30 * i + 15)
			ctx.lineTo(this.x + 38, this.y + 30 * i + 30)
			ctx.lineTo(this.x + 57, this.y + 30 * i + 15)
			ctx.lineTo(this.x + 75, this.y + 30 * i + 30)
			ctx.strokeStyle = "red"
			ctx.lineWidth = 5
			ctx.stroke()
		}
	}
}




class Player {
	constructor(x, y, width, color) {
		this.passable = false
		this.x = x
		this.y = y
		this.color = color
		this.width = width
		this.tlCorner = {
			"x": x,
			"y": y
		}
		this.trCorner = {
			"x": x + width,
			"y": y
		}
		this.blCorner = {
			"x": x,
			"y": y + width
		}
		this.brCorner = {
			"x": x + width,
			"y": y + width
		}
		this.hp = 10
	}
	updateCorners() {
		this.tlCorner = {
			"x": this.x,
			"y": this.y
		}
		this.trCorner = {
			"x": this.x + this.width,
			"y": this.y
		}
		this.blCorner = {
			"x": this.x,
			"y": this.y + this.width
		}
		this.brCorner = {
			"x": this.x + this.width,
			"y": this.y + this.width
		}
	}
	draw() {
		ctx.beginPath()
		ctx.rect(this.x, this.y, this.width, this.width)
		ctx.fillStyle = this.color
		ctx.fill()
	}
	move(direction) {
		if (!this.checkCollision(direction)) {
			if (direction === "left" && this.x - 1 >= 0) {
				this.x -= 1
			} else if (direction === "right" && this.x + this. width + 1 <= board.width) {
				this.x += 1
			} else if (direction === "down" && this.y + this.width + 1 <= board.height) {
				this.y += 1
			} else if (direction === "up" && this.y - 4 >= 0) {
				this.y -= 1
			}
		}
		this.updateCorners()
	}

	checkCollision(direction) {
		// for all tiles on the board
		for (let i = 0; i < game.gameObjects.length; i++) {
			// if the tile is impassable
			const currentTile = game.gameObjects[i]
			if (!currentTile.passable) {
				// if the direction is down
				if (direction === "down") {
					// if the bottom of the player is higher than the top of the tile
					if ((this.blCorner.y <= currentTile.tlCorner.y) &&
					// AND the bottom of the player is less than 5 pixels above the top of the tile
					(this.blCorner.y + 1 > currentTile.tlCorner.y)) {
						// if the blCorner of the player's x is between the corners of the top corners of the tile
						if (((this.blCorner.x > currentTile.tlCorner.x) &&
							(this.blCorner.x < currentTile.trCorner.x)) ||
						// OR the brCorner " " " " " " " " " "
							// COLLISION (return true)
							((this.brCorner.x > currentTile.tlCorner.x) &&
							(this.brCorner.x < currentTile.trCorner.x))) {
							return true
						}
					}
				}
				if (direction === "up") {
					// if the top of the player is lower than the bottm of the tile
					if ((this.tlCorner.y >= currentTile.blCorner.y) &&
					// AND the top of the player is less than 5 pixels below the bottom of the tile
					(this.tlCorner.y - 1 < currentTile.blCorner.y)) {
						// if the tlCorner of the player's x is between the corners of the top corners of the tile
						if (((this.tlCorner.x > currentTile.blCorner.x) &&
							(this.tlCorner.x < currentTile.brCorner.x)) ||
						// OR the trCorner " " " " " " " " " "
							// COLLISION (return true)
							((this.trCorner.x > currentTile.blCorner.x) &&
							(this.trCorner.x < currentTile.brCorner.x))) {
							return true
						}
					}
				}
				if (direction === "left") {
					// if the left of the player is right of the right of the tile
					if ((this.tlCorner.x >= currentTile.trCorner.x) &&
					// AND the left of the player is less than 5 pixels to the right of the tile
					(this.tlCorner.x - 1 < currentTile.trCorner.x)) {
						// if the tlCorner of the player's y is between the right corners of the tile
						if (((this.tlCorner.y > currentTile.trCorner.y) &&
							(this.tlCorner.y < currentTile.brCorner.y)) ||
						// OR the blCorner " " " " " " " " " "
							// COLLISION (return true)
							((this.blCorner.y > currentTile.trCorner.y) &&
							(this.blCorner.y < currentTile.brCorner.y))) {
							return true
						}
					}
				}
				if (direction === "right") {
					// if the right of the player is left of the left of the tile
					if ((this.trCorner.x <= currentTile.tlCorner.x) &&
					// AND the right of the player is less than 5 pixels to the left of the tile
					(this.trCorner.x + 1 > currentTile.tlCorner.x)) {
						// if the trCorner of the player's y is between the left corners of the tile
						if (((this.trCorner.y > currentTile.tlCorner.y) &&
							(this.trCorner.y < currentTile.blCorner.y)) ||
						// OR the brCorner " " " " " " " " " "
							// COLLISION (return true)
							((this.brCorner.y > currentTile.tlCorner.y) &&
							(this.brCorner.y < currentTile.blCorner.y))) {
							return true
						}
					}
				}
			}
		}
	}

	isInside(tile) {
		const corners = [this.tlCorner, this.trCorner, this.blCorner, this.brCorner]
		for (let i = 0; i < corners.length; i++) {
			if (!((corners[i].x < tile.trCorner.x) &&
				(corners[i].x > tile.tlCorner.x) &&
				(corners[i].y < tile.brCorner.y) &&
				(corners[i].y > tile.trCorner.y))) {
					return false
			}
		}
		return true
	}

	overlapsWith(tile) {
		const corners = [this.tlCorner, this.trCorner, this.blCorner, this.brCorner]
		for (let i = 0; i < corners.length; i++) {
			if ((corners[i].x < tile.trCorner.x) &&
				(corners[i].x > tile.tlCorner.x) &&
				(corners[i].y < tile.brCorner.y) &&
				(corners[i].y > tile.trCorner.y)) {
					return true
			}
		}
		return false
	}

	onGoal() {
		for (let i = 0; i < game.tiles.length; i++) {
			if (game.tiles[i].goal) {
				if (this.isInside(game.tiles[i])) {
					return true
				}
			}
		}
		return false
	}

	takeDamage(amount) {
		this.hp -= amount
		game.displayHP()
	}
}


const game = {
	time: 0,

	$player1HP: $( "#player-1-hp" ),

	$player2HP: $( "#player-2-hp" ),

	$timer: $( "#timer" ),

	running: false,

	tiles: [],

	gameObjects: [],

	keysPressed: {},

	gates: [],

	buttons: [],

	players: [new Player(0, 0, 65, "blue"), new Player(830, 530, 65, "red")],

	hazards: [],

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
			for (let i = 0; i < 5; i++) {
				this.players[0].move("left")
			}
		} if (this.keysPressed.s) {
			for (let i = 0; i < 5; i++) {
				this.players[0].move("down")
			}
		} if (this.keysPressed.d) {
			for (let i = 0; i < 5; i++) {
				this.players[0].move("right")
			}
		} if (this.keysPressed.w) {
			for (let i = 0; i < 5; i++) {
				this.players[0].move("up")
			}
		} if (this.keysPressed.j) {
			for (let i = 0; i < 5; i++) {
				this.players[1].move("left")
			}
		} if (this.keysPressed.k) {
			for (let i = 0; i < 5; i++) {
				this.players[1].move("down")
			}
		} if (this.keysPressed.l) {
			for (let i = 0; i < 5; i++) {
				this.players[1].move("right") 
			}
		} if (this.keysPressed.i) {
			for (let i = 0; i < 5; i++) {
				this.players[1].move("up")
			}
		}
		this.checkButtons()
		this.clearBoard()
		this.drawBoard()
		this.drawPlayers()
		this.checkForWin()
	},

	checkForWin: function() {
		if (this.players[0].onGoal() && this.players[1].onGoal()) {
			console.log("YOU WIN")
		}
	},

	addButton: function(button) {
		this.buttons.push(button)
	},

	addGate: function(gate) {
		this.gates[gate.id] = gate
	},

	checkButtons: function() {
		for (let i = 0; i < this.buttons.length; i++) {
			if (this.players[0].isInside(this.buttons[i]) || this.players[1].isInside(this.buttons[i])) {
				this.gates[this.buttons[i].id].open()
			} else {
				this.gates[this.buttons[i].id].close()
			}
		}
	},

	start: function() {
		this.running = true
		this.displayHP()
		const interval = window.setInterval( () => {
			this.tick()
		}, 1000)
	},

	displayHP: function() {
		this.$player1HP.text(this.players[0].hp)
		this.$player2HP.text(this.players[1].hp)
	},

	tick: function() {
		this.$timer.text(++this.time)
		if (this.time % 3 === 0) {
			for (let i = 0; i < this.hazards.length; i++) {
				for (let j = 0; j < this.players.length; j++) {
					if (this.players[j].overlapsWith(this.hazards[i])) {
						this.players[j].takeDamage(this.hazards[i].damage)
					}
				}				
			}
		}
	},

	addHazard: function (tile) {
		this.hazards.push(tile)
	}

}

game.tiles.push(new Floor(0, 0))
game.tiles.push(new Lava(1, 0))
for (let i = 2; i < 10; i++) {
		game.tiles.push(new Floor(i, 0))
}
game.tiles.push(new Gate(10, 0, "green", 0))
const goal1 = new Goal(11,0)
game.tiles.push(goal1)
game.tiles.push(new Floor(0, 1))
for (let i = 1; i < 11; i++) {
	game.tiles.push(new Wall(i, 1))
}
	game.tiles.push(new Floor(11, 1))
for (let i = 1; i < 3; i++) {
	for (let j = 0; j < 12; j++) {
		game.tiles.push(new Floor(j, i * 2))
	}
	game.tiles.push(new Floor(0, i * 2 + 1))
	for (let j = 1; j < 11; j++) {
		game.tiles.push(new Wall(j, i * 2 + 1))
	}
	game.tiles.push(new Floor(11, i * 2 + 1))
}
for (let i = 0; i < 12; i++) {
	game.tiles.push(new Floor(i, 6))
}
game.tiles.push(new Goal(0, 7))
for (let i = 1; i < 11; i++) {
	game.tiles.push(new Wall(i, 7))
}
game.tiles.push(new Button(11, 7, "green", 0))

game.drawBoard()

for (let i = 0; i < game.tiles.length; i++) {
	game.gameObjects.push(game.tiles[i])
}

for (let i = 0; i < game.players.length; i++) {
	game.gameObjects.push(game.players[i])
}


$( document ).on("keydown", (event) => {
	if (!game.running) {
		game.start()
	}
	game.keysPressed[event.key] = true
	game.move()
})

$( document ).on("keyup", (event) => {
	delete game.keysPressed[event.key]
})