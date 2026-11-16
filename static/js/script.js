function gdroundlang() {
    return {
        canvas: null,
        ctx: null,
        player : {
            x: 100,
            y: 100,
            speed: 3
        },
        keys: {},
        init () {
            this.canvas = this.$refs.game
            this.ctx = this.canvas.getContext("2d")

            window.addEventListener("keydown", (e) => {
                this.keys[e.key.toLowerCase()] = true
            })
            window.addEventListener("keyup", (e) => {
                this.keys[e.key.toLowerCase()] = false;
            })

            this.gameLoop()
        },
        gameLoop() {
            this.update();
            this.draw()
            requestAnimationFrame(() => this.gameLoop())
        },
        update () {
            if (this.keys["w"]) this.player.y -= this.player.speed;
            if (this.keys["s"]) this.player.y += this.player.speed;
            if (this.keys["a"]) this.player.x -= this.player.speed;
            if (this.keys["d"]) this.player.x += this.player.speed;
            if (this.keys["x"]) {
                // X button action
            }
            if (this.keys["a"]) {
                // A button action
            }
            if (this.keys["b"]) {
                // B button action
            }
            if (this.keys["y"]) {
                // Y button action
            }
        },
        draw () {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.fillStyle = "bluevioley";
            this.ctx.fillRect(this.player.x, this.player.y, 40, 40)
        },
        press(key) {
            this.keys[key] = true;
        },
        
        release(key) {
            this.keys[key] = false;
        },
    }
}