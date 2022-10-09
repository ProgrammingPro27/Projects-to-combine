function Chunk(ctx) {
    this.mapData = [];
    this.ctx = ctx;
    this.flying = 0;
    this.flying2 = 0;
    this.matrix = []
    let canvas2 = document.createElement("canvas");
    let ctx2 = canvas2.getContext("2d");
    canvas2.width = canvas2.height = 40
    ctx2.lineWidth = 0.2;
    let cube = new Iso3d(canvas2.width / 2, canvas2.height, 20, 20).drawCube()
    cube.fillCube(ctx2)
    this.canvas = canvas2
};
Chunk.prototype.createFlatChunk = function (tileW, tileZ, xx, yy, x, y, z) {
    // this.mapData = [];
    let oriX = xx;
    let oriY = yy;
    for (let i = 0; i < x; i++) {
        if (!this.mapData.hasOwnProperty(this.mapData[i])) {
            this.mapData[i] = [];
        }
        for (let j = 0; j < y; j++) {
            if (!this.mapData[i].hasOwnProperty(this.mapData[i][j])) {
                this.mapData[i][j] = [];
            }
            for (let k = 0; k < z; k++) {
                if (!this.mapData[i][j].hasOwnProperty(this.mapData[i][j][k])) {
                    this.mapData[i][j][k] = { x: xx, y: yy };
                }
                yy -= tileZ;
            };
            xx += tileW;
            yy += tileW / 2;
            yy += tileZ * z;
        };
        xx = oriX -= tileW;
        yy = oriY += tileW / 2;
    };
    return this;
};
Chunk.prototype.loadChunk = function (mouseX, mouseY, operation, key) {
    for (let i = 0; i < this.mapData.length; i++) {
        for (let j = 0; j < this.mapData[i].length; j++) {
            for (let k = 0; k < this.mapData[i][j].length; k++) {
                //  if (operation) {
                //      this.mapData[code][i][j][k].collision(this.ctx, mouseX, mouseY, operation, key, this.mapData[code], i, j)
                //  };
                if (this.matrix[i]) {
                    if (k < this.matrix[i][j]) {
                        this.ctx.drawImage(this.canvas, this.mapData[i][j][k].x, this.mapData[i][j][k].y)
                    }
                }
            };
        };
    };
    return this;
};
Chunk.prototype.createPerlinChunk = function (perlin, gridSize, resolution, groundLayers, heightLimit, num, op, num1, op2) {
    if (resolution != 0) {
        if (num, op) {
            eval(`this.${num} ${op}= gridSize / resolution`);
        };
        if (num1, op2) {
            eval(`this.${num1} ${op2}= gridSize / resolution`);
        };
        let yoff = this.flying2;
        for (let y = 0; y < this.mapData.length; y++) {
            let xoff = this.flying;
            this.matrix[y] = []
            for (let x = 0; x < this.mapData[y].length; x++) {
                let v = parseInt((perlin.get(xoff, yoff) + groundLayers) * heightLimit);
                if (v <= 0) { v = 1; }
                let base = this.mapData[x][y][0]
                let yy = base.y
                this.matrix[y][x] = v
                for (let i = 1; i < v; i++) {
                    yy -= 20
                    if (!this.mapData[x][y].hasOwnProperty(this.mapData[x][y][i])) {
                        this.mapData[x][y][i] = { x: base.x, y: yy }
                    }
                }
                xoff += gridSize / resolution;
            };
            yoff += gridSize / resolution;
        };
    };
    return this;
};