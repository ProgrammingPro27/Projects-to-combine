function ChunkManager(ctx) {
    this.chunks = {}
    this.topLeftRef
    this.offsets = {}
    this.flying = 0;
    this.flying2 = 0;

    let chunkBase = new Chunk(ctx).createFlatChunk(25, 25, window.innerWidth / 2, window.innerHeight / 4, 20, 20, 1);
    chunkBase.flying = this.flying;
    chunkBase.flying2 = this.flying2
    chunkBase.createFilledPerlinChunk(perlin, noiseControl.values.gridSize, noiseControl.values.resolution, noiseControl.values.groundLayers, noiseControl.values.heightLimit);
    // chunkBase.cull()
    chunkBase.adjustsBaseChunkCam(25)
    chunkBase.loadChunk();
    this.chunks[`0,0`] = chunkBase
}
ChunkManager.prototype.addChunk = function (chunk, code) {
    if (!this.chunks[code]) {
        this.chunks[code] = chunk
    }
    return this;
}



let action = ["flying", '+']
let action2 = ["flying2", '+']

ChunkManager.prototype.createStaggeredGridExo = function (chunkSize, tileSize, x, y, rows, cols, ctx, gameObject) {
    let baseX = x
    let baseY = y
    let formula = chunkSize * tileSize


    let flying = this.flying
    let flying2 = this.flying2
    // this.topLeftRef = [x, y]
    let neighbours = neighboursOfCenterChunkCoords([x, y], tileSize, chunkSize)

    function createFormation(action, neighbour, chunks, sec) {

        if (!chunks[`${neighbours[neighbour][0]},${neighbours[neighbour][1]}`]) {
            flying = chunks[`${x},${y}`].flying;
            flying2 = chunks[`${x},${y}`].flying2
            eval(`${action[0]} ${action[1]}= noiseControl.values.chunkSize * (noiseControl.values.gridSize /  noiseControl.values.resolution)`)
            if (sec) {
                eval(`${action2[0]} ${action2[1]}= noiseControl.values.chunkSize * (noiseControl.values.gridSize /  noiseControl.values.resolution)`)
            }
            let chunk = new Chunk(ctx).createFlatChunk(25, 25, window.innerWidth / 2, window.innerHeight / 4, 20, 20, 1);
            chunk.flying = flying;
            chunk.flying2 = flying2
            chunk.createFilledPerlinChunk(perlin, noiseControl.values.gridSize, noiseControl.values.resolution, noiseControl.values.groundLayers, noiseControl.values.heightLimit);
            //  chunk.cull()
            chunk.adjustsBaseChunkCam(25)
            chunk.loadChunk();
            chunks[`${neighbours[neighbour][0]},${neighbours[neighbour][1]}`] = chunk

        }

    }

    createFormation(action, "main", this.chunks)
    action = ["flying2", '+']
    createFormation(action, "rightOfMain", this.chunks)
    action = ["flying", "-"]
    createFormation(action, "topOfMain", this.chunks)
    action = ["flying2", "-"]
    createFormation(action, "leftOfMain", this.chunks)
    action = ["flying", '+']
    createFormation(action, "botOfMain", this.chunks)

    action = ["flying", '-']
    action2 = ["flying2", '+']
    createFormation(action, "topRightOfMain", this.chunks, true)
    action = ["flying", '-']
    action2 = ["flying2", '-']
    createFormation(action, "topLeftOfMain", this.chunks, true)
    action = ["flying", '+']
    action2 = ["flying2", '+']
    createFormation(action, "botRightOfMain", this.chunks, true)
    action = ["flying", '+']
    action2 = ["flying2", '-']
    createFormation(action, "botLeftOfMain", this.chunks, true)


    //    this.chunks[`${neighbours.topLeftOfMain[0]},${neighbours.topLeftOfMain[1]}`].loadChunk(gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, gameObject.block)
    //    this.chunks[`${neighbours.topOfMain[0]},${neighbours.topOfMain[1]}`].loadChunk(gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, gameObject.block)
    //    this.chunks[`${neighbours.leftOfMain[0]},${neighbours.leftOfMain[1]}`].loadChunk(gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, gameObject.block)
    //    this.chunks[`${neighbours.botLeftOfMain[0]},${neighbours.botLeftOfMain[1]}`].loadChunk(gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, gameObject.block)
    //    this.chunks[`${neighbours.main[0]},${neighbours.main[1]}`].loadChunk(gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, gameObject.block)
    //    this.chunks[`${neighbours.topRightOfMain[0]},${neighbours.topRightOfMain[1]}`].loadChunk(gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, gameObject.block)
    //    this.chunks[`${neighbours.rightOfMain[0]},${neighbours.rightOfMain[1]}`].loadChunk(gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, gameObject.block)
    //    this.chunks[`${neighbours.botOfMain[0]},${neighbours.botOfMain[1]}`].loadChunk(gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, gameObject.block)
    //    this.chunks[`${neighbours.botRightOfMain[0]},${neighbours.botRightOfMain[1]}`].loadChunk(gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, gameObject.block)

    return this;
}



ChunkManager.prototype.createStaggeredGrid = function (chunkSize, tileSize, x, y, rows, cols, ctx, gameObject) {
    let baseX = x
    let baseY = y
    let formula = chunkSize * tileSize
    let basePicX = window.innerWidth / 2
    let basePicY = window.innerHeight / 4
    let basePicXC = basePicX
    let basePicYC = basePicY

    for (let i = 0; i < cols; i++) {
        let row = []
        let row2 = []
        for (let j = 0; j < rows; j++) {

            if (i == 0 && j == 0) {
                this.topLeftRef = [x, y]

            }
            this.createStaggeredGridExo(chunkSize, tileSize, x, y, rows, cols, ctx, gameObject)

            //  ctx.drawImage(this.chunks["500,250"].canvas,world.chunks["500,250"].canvas.width/2,height-world.chunks["500,250"].canvas.height+world.chunks["500,250"].canvas.width/4)

            if (j % 2 == 0) {
                //  this.chunks[`${x},${y}`].loadChunk(gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, gameObject.block)
                ctx.drawImage(this.chunks[`${x},${y}`].canvas, basePicX, basePicY)
                x += formula
                y += formula / 2
                basePicX += this.chunks[`${x},${y}`].canvas.width / 2
                basePicY += height - this.chunks[`${x},${y}`].canvas.height + this.chunks[`${x},${y}`].canvas.width / 4
            } else {
                row[j] = `${x},${y}`
                row2[j] = [basePicX, basePicY]
                x += formula
                y -= formula / 2
                basePicX += this.chunks[`${x},${y}`].canvas.width / 2
                basePicY -= height - this.chunks[`${x},${y}`].canvas.height + this.chunks[`${x},${y}`].canvas.width / 4
            }
        }
        for (let i = 0; i < row.length; i++) {
            if (row[i]) {
                ctx.drawImage(this.chunks[row[i]].canvas, row2[i][0], row2[i][1])
            }

            //  ctx.drawImage(this.chunks[row[i]].canvas, row2[i][0],row2[i][1])
        }
        //    row.forEach(el => {
        //      //  ctx.drawImage(this.chunks[el].canvas, basePicX,basePicY)
        //       // this.chunks[el].loadChunk(gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, gameObject.block)
        //    })
        x += formula
        baseY += formula
        x = baseX
        y = baseY


        basePicX += this.chunks[`${x},${y}`].canvas.width / 2
        basePicYC += this.chunks[`${x},${y}`].canvas.width / 2

        basePicX = basePicXC

        basePicY = basePicYC


    }
    return this;
}



// ChunkManager.prototype.createStaggeredGrid = function (chunkSize, tileSize, x, y, rows, cols, ctx, gameObject) {
//     let baseX = x
//     let baseY = y
//     let formula = chunkSize * tileSize
// 
//     for (let i = 0; i < cols; i++) {
// 
//         for (let j = 0; j < rows; j += 2) {
//             if (!this.chunks[`${x},${y}`]) {
//                 this.chunks[`${x},${y}`] = new Chunk(ctx).createFlatChunk(tileSize, tileSize, x, y, chunkSize, chunkSize, 1);
//             } else {
//                 this.chunks[`${x},${y}`].loadChunk(gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, gameObject.block)
//             }
//             x += formula
//             y += formula / 2
//         }
// 
//         for (let j = 0; j < rows; j++) {
//             if (j % 2 !== 0) {
//                 if (!this.chunks[`${x},${y}`]) {
//                     this.chunks[`${x},${y}`] = new Chunk(ctx).createFlatChunk(tileSize, tileSize, x, y, chunkSize, chunkSize, 1);
// 
//                 } else {
//                     this.chunks[`${x},${y}`].loadChunk(gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, gameObject.block)
//                 }
// 
// 
//                 x += formula
//                 y -= formula / 2
//             }
//         }
// 
//         x += formula
//         baseY += formula
//         x = baseX
//         y = baseY
//     }
//     return this;
// }