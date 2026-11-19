function gdroundlang() {
    return {
        logs: [
            'loaded gameplay'
        ],
        canvas: null,
        ctx: null,
        player : {
            x: 100,
            y: 100,
            speed: 1,
            framesPNG: '/static/character.png',
            moving: false,
            dirRow: 0,
            frame: 0,
            frameTimer: 0,
            img: null,
            w: 16,
            h: 20,
            score: 0
        },
        staticBodies : [
            { x: 0, y: 0, width: 800, height: 20, color: "blueviolet", ref: "The wall at top", sx: 369, sy: 13, sw: 23, sh: 23},
            { x: 0, y: 150, width: 800, height: 10, color: "blueviolet", ref: "The bottom boundary collider"},
            { x: 300, y: 0, width: 10, height: 800, color: "blueviolet", ref: "The right boundary collider"},
            { x: -10, y: 0, width: 10, height: 800, color: "blueviolet", ref: "The left boundary collider"},

        ],
        npcs : [
            {id: 'witch', x: 20, y: 22, intro: '', pass: [''], fail: [''], row: 0, width: 24, height: 24, frame: 0, frameTimer: 0 },
            {id: 'golem', x: 125, y: 22, intro: '', pass: [''], fail: [''], row: 2, width: 24, height: 24, frame: 0, frameTimer: 0 },
            {id: 'turtle', x: 270, y: 22, intro: '', pass: [''], fail: [''], row: 4, width: 24, height: 24, frame: 0, frameTimer: 0 }
        ],
        keys: {},
        activeMsger: {
            isVisible: true,
            isWritingAreaVisible: true,
            placeholderText: "answer me?",
            text: null,
            CTAs: [
            ] // have dict shaped buttons
        },
        keywords: {
            witch: ['potion', 'moon', 'spell', 'shadow', 'cauldron', 'curse', 'broom'],
            golem: ['stone', 'mountain', 'iron', 'earth', 'crystal', 'weight', 'strength'],
            turtle: ['shell', 'ocean', 'patience', 'tide', 'sand', 'island', 'time']
        },
        init () {
            this.canvas = this.$refs.game
            this.ctx = this.canvas.getContext("2d")

            // character.png (for the player)

            this.player.img = new Image()
            this.player.img.src = this.player.framesPNG

            // overworld.png (for tiles and other setup props)

            this.overworldImg = new Image()
            this.overworldImg.src = '/static/Overworld.png'
            this.staticBodies[0].img = this.overworldImg
            
            // cave.png
            this.caveImg = new Image()
            this.caveImg.src = '/static/cave.png'


            // this.torchImg = new Image()
            // this.torchImg.src = '/static/torch.png'

            // npc.image frame sheet
            this.npcImg = new Image()
            this.npcImg.src = '/static/npcs.png'

            
            window.addEventListener("keydown", (e) => {
                if (e.target.matches('input, textarea, [contenteditable]')) return
                this.keys[e.key.toLowerCase()] = true
            })
            window.addEventListener("keyup", (e) => {
                this.keys[e.key.toLowerCase()] = false;
            })

            this.activeMsger.CTAs = [
                { label: 'submit', action: () => this.log("we're finally here!") }
            ]
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
            const hitY = this.staticBodies.concat(this.npcs).find(b => this.checkCollision(this.player, b))
            if (hitY) {
                this.player.y = oldY
                this.log('bumped ' + (hitY.id || hitY.ref) + ' @ ' + Math.round(this.player.x) + ',' + Math.round(this.player.y))
                if (hitY.id) {
                    this.activeMsger.text = hitY.intro
                    this.activeMsger.isVisible = true
                }
            }
            let oldX = this.player.x;
            // horizontal movement
            if (this.keys["a"]) {
                this.player.x -= this.player.speed;
                this.player.dirRow = 3
                this.player.moving = true
            }
            if (this.keys["d"]) {
                this.player.x += this.player.speed;
                this.player.dirRow = 1;
                this.player.moving = true
            }
            const hitX = this.staticBodies.concat(this.npcs).find(b => this.checkCollision(this.player, b))
            if (hitX) {
                this.player.x = oldX
                this.log('bumped ' + (hitX.id || hitX.ref) + ' @ ' + Math.round(this.player.x) + ',' + Math.round(this.player.y))
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

            this.npcs.forEach(n => this.animate(n, 8, 30))
            if (this.player.moving) this.animate(this.player, 4, 10)
            
            else this.player.frame = 0
        },
        draw () {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

            this.ctx.fillStyle = '#151017'
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
                        
            const p = this.player
            if (p.img.complete && p.img.naturalWidth > 0) {
                this.ctx.drawImage(p.img, p.frame*16, p.dirRow*32, 16, 32, p.x, p.y, 16, 32)
            } else {
                this.ctx.fillStyle = "black"
                this.ctx.fillRect(p.x, p.y, 16, 32)
            }

            this.staticBodies.forEach(body => {
                if (body.img?.complete && body.img.naturalWidth > 0) {
                    this.drawTiledStatic(body.img, body.sx, body.sy, body.sw, body.sh, body.x, body.y, body.width, body.height)
                } else {
                    this.ctx.fillStyle = body.color || "gray";
                    this.ctx.fillRect(body.x, body.y, body.width, body.height);
                }
            });
            if (this.npcImg?.complete && this.npcImg.naturalWidth > 0) {
                this.npcs.forEach(n => {
                    this.ctx.drawImage(this.npcImg, n.frame*128, n.row*128, 128, 128, n.x, n.y, 20, 20)
                })
            }
        },
        press(key) {
            this.keys[key] = true;
        },
        
        release(key) {
            this.keys[key] = false;
        },
        checkCollision(a, b) {
            const left = a.x + (16 - a.w) / 2
            const top = a.y + (32 - a.h) / 2
            return (
                left < b.x + b.width &&
                left + a.w > b.x &&
                top < b.y + b.height &&
                top + a.h > b.y
            )
        },
        animate(obj, n, ticks) {
            if (++obj.frameTimer >= ticks) {
                obj.frameTimer = 0
                obj.frame = (obj.frame + 1) % n
            }
        },
        drawTiles () {

        },
        drawTiledStatic(img, sx, sy, sw, sh, x, y, w, h) {
            for (let ty = y; ty < y + h; ty += sh) {
                for (let tx = x; tx < x + w; tx += sw) {
                    this.ctx.drawImage(img, sx, sy, sw, sh, tx, ty, sw, sh)
                }
            }
        },
        
        log (msg) {
            this.logs.push(msg)
            this.$nextTick(() => {
            this.$refs.loglist.scrollTop = this.$refs.loglist.scrollHeight
        })
        },

        getQuestion (character, prev) {
            return
        },
        startRiddle (id, prev) {

        }
    }
}