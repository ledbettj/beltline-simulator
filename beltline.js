class Beltline {
    constructor(node) {
        this.canvas = node;
        this.ctx = node.getContext('2d');
        this.stopped = true;
        this.grid = [];
        this.WIDTH = 16;
        this.HEIGHT = 32;
        this.CELL = 24;
        this.GRID_LEFT = 1024/3;
        for(let i = 0; i < this.HEIGHT; ++i) {
            this.grid.push(new Array(this.WIDTH));
        }

        this.player = { x: this.WIDTH  - 1, y: this.HEIGHT - 1 };
        this.canvas.addEventListener('keyup', this.onKeyUp.bind(this));

        for(let i = 0; i < 10; ++i ){
            let x = Math.floor(Math.random() * this.WIDTH);
            let y = Math.floor(Math.random() * (this.HEIGHT / 2));
            let items = ['w', 'b', 'h'];
            this.grid[y][x] = items[Math.floor(Math.random() * items.length)];
        }
    }

    onKeyUp(e) {
        this.events.push(e);
    }

    run() {
        this.stopped = false;
        this.lastFrame = 0;
        this.frameInterval = 1000 / 30;
        this.t = 0;
        this.events = [];
        this.frame();
    }

    stop() {
        this.stopped = true;
    }

    frame() {
        if (this.stopped) {
            this.ctx.fillStyle = 'red';
            this.ctx.font = '64px serif';
            this.ctx.fillText('Game over!', 1024/2, 768/2);
            return;

        }

        requestAnimationFrame(this.frame.bind(this));

        let now = Date.now(),
            elapsed = now - this.lastFrame;

        if (elapsed >= this.frameInterval) {
            this.lastFrame = now - (elapsed % this.frameInterval);
            this.doFrame(elapsed);
        }
    }

    doFrame(elapsed) {
        this.newFrame(this.t);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        this.ctx.fillText(`fps: ${Math.round(1000 / elapsed)}`, 30, 10);
        this.t += 1;
    }

    newFrame(fNo) {
        this.processEvents(fNo);
        this.background(this.ctx, fNo);
      //  this.drawGrid(this.ctx);
        this.drawItems(this.ctx);
    }

    processEvents(fNo) {
        let e;

        while ((e = this.events.shift())) {
            switch(e.key) {
            case 'w':
                this.player.y -= 1;
                break;
            case 'a':
                this.player.x -= 1;
                break;
            case 's':
                this.player.y += 1;
                break;
            case 'd':
                this.player.x += 1;
                break;
            default:
                break;
            }
        }

        if (fNo % 15 != 0)
            return;

        this.grid.pop();
        this.grid.unshift(new Array(this.WIDTH));

        for(let i = 0; i < 4; ++i ){
            let x = Math.floor(Math.random() * this.WIDTH);
            let items = ['w', 'b', 'h'];
            this.grid[0][x] = items[Math.floor(Math.random() * items.length)];
        }

        if (this.grid[this.player.y][this.player.x]) {
            this.stop();
        }
    }

    background(ctx, frameNo) {
        ctx.fillStyle = '#22aa33';
        ctx.fillRect(0, 0, 1024, 768);

        ctx.fillStyle = '#cacad0';
        ctx.fillRect(1024/3, 0, 24 * 16,  768);

        ctx.strokeStyle = '#f0f0ff';
        ctx.setLineDash([16, 16]);
        ctx.beginPath();
        ctx.moveTo(this.GRID_LEFT + this.WIDTH / 2 * this.CELL, 0);
        ctx.lineTo(this.GRID_LEFT + this.WIDTH / 2 * this.CELL, 768);
        ctx.stroke();
    }

    drawGrid(ctx) {
        let startX = this.GRID_LEFT;
        let startY = 0;
        let cell = this.CELL;
        let totalX = this.WIDTH;
        let totalY = this.HEIGHT;

        ctx.setLineDash([]);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        for(let x = 0; x < totalX; x++) {
            ctx.beginPath();
            ctx.moveTo(startX + x * cell, 0);
            ctx.lineTo(startX + x * cell, 768);
            ctx.stroke();
        }
        for(let y = 0; y < totalY; y++) {
            ctx.beginPath();
            ctx.moveTo(startX, startY + y * cell);
            ctx.lineTo(startX + cell * this.WIDTH, startY + y * cell);
            ctx.stroke();
        }
    }

    textAt(ctx, x, y, text) {
        ctx.font = '22px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = '#fff';
        ctx.fillText(text, this.GRID_LEFT + this.CELL * x + this.CELL / 2, y * this.CELL + this.CELL);
    }

    drawItems(ctx) {
        for(let y = 0; y < this.grid.length; ++y) {
            for(let x = 0; x < this.grid[y].length; ++x) {
                switch(this.grid[y][x]) {
                case 'b':
                    this.textAt(ctx, x, y, '\u{01f6b4}');
                    break;
                case 'h':
                    this.textAt(ctx, x, y, '\u{01f483}');
                    break;
                case 'w':
                    this.textAt(ctx, x, y, '\u{01f938}');
                default:
                    break;
                }
            }
        }
        this.textAt(ctx, this.player.x, this.player.y, '\u{01f3c3}');
    }
}
