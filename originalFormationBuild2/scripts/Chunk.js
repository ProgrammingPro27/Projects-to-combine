function Chunk(ctx) {
    this.mapData = [];
  //  this.ctx = ctx;
    this.flying = 0;
    this.flying2 = 0;
    this.action = "points"
    this.canvas = document.createElement("canvas");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.ctx = this.canvas.getContext("2d");

    // когато сменяш от performance mode към editable, трябва да направиш грида отново, 
    // защото ще е със старите елементи, а те нямат опция за collision

    this.points = (xx, yy, color) => { return { x: xx, y: yy, colors: color } }
    this.cube = (x, y, color) => {
        let cube = new Iso3d(x, y, 25, 25).drawCube()
        cube.colors = color
        return cube
    }
};
Chunk.prototype.adjustsBaseChunkCam = function (tileSize) {
    let matrix = this.mapData
    let otCurr = matrix[0][0][0];

    let pA = { x: 0, y: 0 }
    let pC = { x: this.canvas.width, y: this.canvas.height }

    let p1 = matrix[matrix.length - 1][matrix[matrix.length - 1].length - 1][0]
    let p2 = matrix[0][matrix[matrix.length - 1].length - 1][0]

    let cX = (p1.x + (p2.x + tileSize)) - p1.x

    let botRight = [cX, p1.y]
  //  let topLeft = [width - cX, (otCurr.y -    parseInt((1 + Number(document.getElementById("groundLayers").value)) * Number(document.getElementById("heightLimit").value))) - otCurr.width];
 // chunk.createPerlinChunk(perlin, noiseControl.values.gridSize, noiseControl.values.resolution, noiseControl.values.groundLayers, noiseControl.values.heightLimit);
 //parseInt((1 + noiseControl.values.groundLayers *  noiseControl.values.heightLimit))
 let topLeft = [this.canvas.width - cX, otCurr.y - 1500 - tileSize];

    let botXmoment = Math.abs(pC.x - pA.x)
    let botYmoment = Math.abs(pC.y - pA.y)

    let topXmoment2 = Math.min(topLeft[0], botRight[0])
    let topYmoment2 = Math.min(topLeft[1], botRight[1])
    let botXmoment2 = Math.abs(botRight[0] - topLeft[0])
    let botYmoment2 = Math.abs(botRight[1] - topLeft[1])

    let factor = Math.min(botXmoment / botXmoment2, botYmoment / botYmoment2);


    this.canvas.width = botXmoment2 / (1 / factor);
    this.canvas.height = botYmoment2 / (1 / factor);


    this.ctx.scale(factor, factor)

    this.ctx.translate(-topLeft[0], -topLeft[1])

    return this;
}

Chunk.prototype.createFlatChunk = function (tileW, tileZ, xx, yy, x, y, z) {
    this.mapData = [];
    let oriX = xx;
    let oriY = yy;
    for (let i = 0; i < x; i++) {
        this.mapData[i] = [];
        for (let j = 0; j < y; j++) {
            this.mapData[i][j] = [];
            for (let k = 0; k < z; k++) {
                this.mapData[i][j][k] = this[this.action](xx, yy, "808080A9A9A9909090")
                //  this.mapData[i][j][k].dontRender = false
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

Chunk.prototype.cull = function () {
    for (let i = 0; i < this.mapData.length - 1; i++) {
        for (let j = 0; j < this.mapData[i].length - 1; j++) {
            for (let k = 0; k < this.mapData[i][j].length - 1; k++) {
                // if (this.mapData[i][j][k + 1] && this.mapData[i][j + 1][k] && this.mapData[i + 1][j][k]) {
                //   this.mapData[i][j][k].dontRender = true
                //    }
            }
            this.mapData[i][j] = this.mapData[i][j].filter(item => item.dontRender !== true);
        }
    }
}
Chunk.prototype.loadChunk = function (mouseX, mouseY, operation, block) {
    for (let i = 0; i < this.mapData.length; i++) {
        for (let j = 0; j < this.mapData[i].length; j++) {
            for (let k = 0; k < this.mapData[i][j].length; k++) {
                if (!this.mapData[i][j][k].dontRender) {
                    if (this.action == "cube") {
                        this.mapData[i][j][k].collision(this.ctx, mouseX, mouseY, operation, this.mapData, i, j, k, block)
                    }
                    this.ctx.drawImage(document.getElementById(this.mapData[i][j][k].colors), this.mapData[i][j][k].x - 25, this.mapData[i][j][k].y - 50)
                }
            };
        };
    };
    return this;
};
Chunk.prototype.setDirection = function (num, op, num1, op2, gridSize, resolution) {
    if (num, op) {
        eval(`this.${num} ${op}= gridSize / resolution`);
    };
    if (num1, op2) {
        eval(`this.${num1} ${op2}= gridSize / resolution`);
    };
    return this;
};
Chunk.prototype.createPerlinChunk = function (perlin, gridSize, resolution, groundLayers, heightLimit) {
    if (resolution != 0) {
        let m = []
        let yoff = this.flying2;
        for (let y = 0; y < this.mapData.length; y++) {
            let xoff = this.flying;
            let row = []
            for (let x = 0; x < this.mapData[y].length; x++) {
                let v = parseInt((perlin.get(xoff, yoff) + groundLayers) * heightLimit);
                if (v <= 0) { v = 1; }
                row[x] = v
                xoff += gridSize / resolution;
            };
            m[y] = row
            yoff += gridSize / resolution;
        };

        for (let y = 0; y < m.length; y++) {
            for (let x = 0; x < m[y].length; x++) {
                let base = this.mapData[x][y][0]//TODO ->направи си свой base, като генерираш координати за основа, БЕЗ да ги запазваш!
                let yy = base.y
                for (let i = 1; i < m[x][y]; i++) {
                    yy -= 25
                    if (x < m.length - 1 && y < m[y].length - 1) {
                        this.mapData[x][y][0].dontRender = true
                    }
                    let el = this[this.action](base.x, yy, "808080A9A9A9909090")
                    //намери общото между 3те проверки в ИФА и го пресметни като разлика, която да служи за индикатор КЪДЕ да се поставя И КАКЪВ БРОЙ блокчета
                    //ИДЕЯТА Е ДА НЕ СЕ ЦИКЛИ ненужно и да се увеличава ненужно стойността yy, като може просто да се умножи по базовия брой
                    //ти ще циклиш до разликата, не до пълното число
                    if (m[x + 1]) {
                        if (m[x][y + 1]) {
                            if (i < m[x][y + 1] && i < m[x + 1][y] && i < m[x][y] - 1) {
                            } else {
                                this.mapData[x][y].push(el)
                            }
                        } else {
                            this.mapData[x][y].push(el)
                        }
                    } else {
                        this.mapData[x][y].push(el)
                    }
                }
            }
        }
    };
    return this;
};
Chunk.prototype.createFilledPerlinChunk = function (perlin, gridSize, resolution, groundLayers, heightLimit) {
    if (resolution != 0) {
        let yoff = this.flying2;
        for (let y = 0; y < this.mapData.length; y++) {
            let xoff = this.flying;
            for (let x = 0; x < this.mapData[y].length; x++) {
                let v = parseInt((perlin.get(xoff, yoff) + groundLayers) * heightLimit);
                if (v <= 0) { v = 1; }
                let base = this.mapData[x][y][0]
                let yy = base.y
                for (let i = 1; i < v; i++) {
                    yy -= 25
                    this.mapData[x][y][i] = this[this.action](base.x, yy, "808080A9A9A9909090")
                    // this.mapData[x][y][i].dontRender = false
                }
                xoff += gridSize / resolution;
            };
            yoff += gridSize / resolution;
        };
    };
}