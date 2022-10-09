function Chunk() {
    this.mapData = {};
    this.flying = 0;
    this.flying2 = 0;
    this.chunk = [];
    this.imgs = {}
    this.offsets = {}
};
Chunk.prototype.createFlatChunk = function (canvas, ctx, tileW, tileZ, x, y, mapX, mapY) {
    let oriX = x, oriY = y;
    this.chunk = []
    for (let i = 0; i < mapX; i++) {
        let mapRow = [];
        for (let j = 0; j < mapY; j++) {
            let isoCube = new Iso3d(canvas, ctx, x, y, tileW, tileZ);
            x += tileW;
            y += tileW / 2;
            mapRow[j] = isoCube;
        };
        oriX -= tileW;
        oriY += tileW / 2;
        x = oriX;
        y = oriY;
        this.chunk[i] = mapRow;
    };
    return this;
};
Chunk.prototype.loadChunk = function (mouseX, mouseY, operation, stroke, key) {
    for (let i = 0; i < this.chunk.length; i++) {
        for (let j = 0; j < this.chunk[i].length; j++) {
            this.chunk[i][j].drawCube(stroke);
            if (operation) {
                this.chunk[i][j].collision(mouseX, mouseY).eventInitializer(operation, this.chunk, key);
            };
        };
    };
    return this;
};
Chunk.prototype.createPerlinChunk = function (size, perlin, code, gridSize, resolution, groundLayers, heightLimit, num, op, num1, op2) {
    if (resolution !== 0) {
        // if (!this.mapData[code]) {
        this.mapData[code] = []
        // };
//        if (num, op) {
//            eval(`this.${num} ${op}= gridSize / resolution`);
//        }
//        if (num1, op2) {
//            eval(`this.${num1} ${op2}= gridSize / resolution`);
//        }
        let yoff = this.flying2;
        for (let y = 0; y < size; y++) {
            let xoff = this.flying;
            let row = []
            for (let x = 0; x < size; x++) {
                let v = parseInt((perlin.get(xoff, yoff) + groundLayers) * heightLimit);
                if (v < 0) { v = 0; }
                    this.chunk[x][y].h = v
                row[x] = v
                xoff += gridSize / resolution;
            };
            yoff += gridSize / resolution;
            this.mapData[code][y] = row
        };

    };
    return this;
};
