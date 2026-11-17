function gdroundlang() {
    return {
        canvas: null,
        ctx: null,
        player : {
            x: 100,
            y: 100,
            speed: 2,
            framesPNG: 'character.png',
            moving: false,
            dirRow: 0,
            frame: 0,
            frameTimer: 0,
            img: null
        },
        staticBodies : [
            { x: 0, y: 0, width: 800, height: 10, color: "blueviolet", ref: "The wall at top"},
            { x: 0, y: 150, width: 800, height: 10, color: "blueviolet", ref: "The bottom boundary collider"},
            { x: 300, y: 0, width: 10, height: 800, color: "blueviolet", ref: "The right boundary collider"},
            { x: -10, y: 0, width: 10, height: 800, color: "blueviolet", ref: "The left boundary collider"},

        ],
        keys: {},
        init () {
            this.canvas = this.$refs.game
            this.ctx = this.canvas.getContext("2d")

            this.player.img = new Image()
            this.player.img.src = this.player.framesPNG

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
            this.player.moving = false
            let oldY = this.player.y;


            // vertical movement
            if (this.keys["w"]) { 
                this.player.y -= this.player.speed;
                this.player.dirRow = 2; 
                this.player.moving = true
            }
            if (this.keys["s"]) {
                this.player.y += this.player.speed;
                this.player.dirRow = 0; 
                this.player.moving = true
            }
            if (this.staticBodies.some(b => this.checkCollision(this.player, b))) {
                this.player.y = oldY;
            }

            let oldX = this.player.x;
            // horizontal movement
            if (this.keys["a"]) {
                this.player.x -= this.player.speed;
                this.player.dirRow = 1
                this.player.moving = true
            }
            if (this.keys["d"]) {
                this.player.x += this.player.speed;
                this.player.dirRow = 3;
                this.player.moving = true
            }
            if (this.staticBodies.some(b => this.checkCollision(this.player, b))) {
                this.player.x = oldX;
            }


            if (this.keys["x"]) {
                // X button action
            }
            if (this.keys["button_a"]) {
                // A button action
            }
            if (this.keys["b"]) {
                // B button action
            }
            if (this.keys["y"]) {
                // Y button action
            }

            if (this.player.moving) this.animate(this.player, 4, 10) 
            else this.player.frame = 0
        },
        draw () {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            
            // to be removed
            this.ctx.fillStyle = "black";
            this.ctx.fillRect(this.player.x, this.player.y, 20, 20)
            //

            this.staticBodies.forEach(body => {
                if (body.img?.complete && body.img.naturalWidth > 0) {
                    this.ctx.drawImage(body.img, body.x, body.y, body.width, body.height);
                } else {
                    this.ctx.fillStyle = body.color || "gray";
                    this.ctx.fillRect(body.x, body.y, body.width, body.height);
                }
            });
        },
        press(key) {
            this.keys[key] = true;
        },
        
        release(key) {
            this.keys[key] = false;
        },
        checkCollision(a, b) {
            return (
                a.x < b.x + b.width &&
                a.x + 20 > b.x &&
                a.y < b.y + b.height &&
                a.y + 20 > b.y
            )
        },
        animate(obj, n, ticks) {
            if (++obj.frameTimer >= ticks) {
                obj.frameTimer = 0
                obj.frame = (obj.frame + 1) % n
            }
        },
        drawTiles () {

        }
    }
}