let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let blocksMenu = new BlockMenu()
blocksMenu.saveEl(["#808080", "#A9A9A9", "#909090"]).saveEl(["#FFFCFC", "#FFFBFB", "#FFFAFA"]).saveEl(["#2389da", "#2389da", "#2389da"]).saveEl(["#4D525B", "#787F8E", "#606672"]).saveEl(["#cabc91", "#dbd1b4", "#d3c7a2"]).saveEl(["#8B4513", "#A0522D", "#6B8E23"])

let noiseControl = new NoiseControl()//values to be reworked
    .createComponent("chunkSize", 2, 50, 20, 1, updateMap)
    .createComponent("gridSize", 1, 1000, 3, 1, updateMap)
    .createComponent("resolution", 1, 1000, 100, 1, updateMap)
    .createComponent("groundLayers", 0.1, 100, 0.3, 0.1, updateMap)
    .createComponent("heightLimit", 1, 1000, 50, 1, updateMap)

function pickerElement() {
    displayMenus(blocksMenu.container)
    displayMenus(picker.picker)
}


function noiseControlElement() {
    displayMenus(noiseControl.container)
}
function blockOption(button) {
    gameObject.eventToPut = button.id;

}

function mapType() {
    let el1 = document.getElementById("gridSize")
    let el2 = document.getElementById("resolution")
    let el3 = document.getElementById("groundLayers")
    let el4 = document.getElementById("heightLimit")
    if (gameObject.mapType == "Flat") {
        gameObject.mapType = "Perlin";
        el1.disabled = el2.disabled = el3.disabled = el4.disabled = false;
    } else {
        gameObject.mapType = "Flat";
        el1.disabled = el2.disabled = el3.disabled = el4.disabled = true;
    }
    updateMap();
};

let optionMenu = new OptionMenu().addOption("Color", "colorise", pickerElement).addOption("Noise Settings", "controlNoise", noiseControlElement)
let buttonPicOptions = new ButtonPicOptions().addPicOption(mapType, "gridType", "images/grid type perlin.png", "images/grid type.png").addPicOption(blockOption, "increaseSize", "images/add block.png").addPicOption(blockOption, "removeTile", "images/broken block icon.png")





let gameObject = {
    key: "KeyW",
    eventToPut: "increaseSize",
    mouseCoordinates: [],
    tileW: 25,
    tileZ: 25,
    x: window.innerWidth / 2,
    y: window.innerHeight / 4,
    h: 1,
    oldX: 0,
    oldY: 0,
    button: false,
    isActive: false,
    action: {
        "KeyW": ["flying", "-", "flying2", "-"],
        "KeyS": ["flying", "+", "flying2", "+"],
        "KeyA": ["flying", "+", "flying2", "-"],
        "KeyD": ["flying", "-", "flying2", "+"]
    },
    move: false,
    mapType: "Perlin",
    block: blocksMenu.container.name
};

let chunk = new Chunk(ctx);

let perlin = new Perlin();
perlin.seed();

//=======================================================


let picker = new BlockColorPicker(blocksMenu).draggable()

function displayMenus(element) {
    if (element.style.display == "flex") {
        element.style.display = "none"
    } else {
        element.style.display = "flex"
    }
}

//=======================================================

function updateMap() {
    gameObject.isActive = true;
    chunk.createFlatChunk(gameObject.tileW, gameObject.tileZ, gameObject.x, gameObject.y, noiseControl.values.chunkSize, noiseControl.values.chunkSize, gameObject.h);
    if (gameObject.mapType == "Perlin") {
        if (gameObject.move == true) {
            let direction = gameObject.action[gameObject.key]
            chunk.setDirection(direction[0], direction[1], direction[2], direction[3], noiseControl.values.gridSize, noiseControl.values.resolution)
            gameObject.move = false
        };
        chunk.createFilledPerlinChunk(perlin, noiseControl.values.gridSize, noiseControl.values.resolution, noiseControl.values.groundLayers, noiseControl.values.heightLimit);
    };
    //   chunk.cull()
};

canvas.addEventListener("mousemove", mouseEvent, { passive: true });
canvas.addEventListener("mousedown", mouseEvent, { passive: true });
canvas.addEventListener("mouseup", mouseEvent, { passive: true });
canvas.addEventListener("mouseout", mouseEvent, { passive: true });
canvas.addEventListener("mousewheel", onmousewheel, false);
canvas.addEventListener("click", function () {
    if (gameObject.eventToPut) {
        gameObject.isActive = true;
    };
});

function mouseEvent(event) {
    if (event.type === "mousedown") { gameObject.button = true };
    if (event.type === "mouseup" || event.type === "mouseout") { gameObject.button = false };
    gameObject.oldX = gameObject.mouseCoordinates[0];
    gameObject.oldY = gameObject.mouseCoordinates[1];
    gameObject.mouseCoordinates[0] = event.offsetX;
    gameObject.mouseCoordinates[1] = event.offsetY;
    if (gameObject.button) { // pan
        view.pan({ x: gameObject.mouseCoordinates[0] - gameObject.oldX, y: gameObject.mouseCoordinates[1] - gameObject.oldY });
        gameObject.isActive = true;
    };
};
view.setContext(ctx);

function onmousewheel(event) {
    let e = window.event || event;
    let x = e.offsetX;
    let y = e.offsetY;
    const delta = e.type === "mousewheel" ? e.wheelDelta : -e.detail;
    if (delta > 0) {
        view.scaleAt({ x, y }, 1.1);
    }
    else {
        view.scaleAt({ x, y }, 1 / 1.1);
    };
    gameObject.isActive = true;
    e.preventDefault();
};

document.body.style.backgroundImage = "url(images/logo.png)";

setTimeout(function () {
    document.body.style.backgroundImage = "none";
    updateMap();
}, 1000);

function neighboursOfCenterChunkCoords(mainChunk, size, chunkSize) {
    return {
        main: [mainChunk[0], mainChunk[1]],
        leftOfMain: [mainChunk[0] - chunkSize * size, mainChunk[1] - chunkSize * size / 2],
        rightOfMain: [mainChunk[0] + chunkSize * size, mainChunk[1] + chunkSize * size / 2],
        botOfMain: [mainChunk[0] - chunkSize * size, mainChunk[1] + chunkSize * size / 2],
        topOfMain: [mainChunk[0] + chunkSize * size, mainChunk[1] - chunkSize * size / 2],
        botLeftOfMain: [mainChunk[0] - (chunkSize) * size * 2, mainChunk[1]],
        topLeftOfMain: [mainChunk[0], mainChunk[1] - chunkSize * size],
        topRightOfMain: [mainChunk[0] + chunkSize * size * 2, mainChunk[1]],
        botRightOfMain: [mainChunk[0], mainChunk[1] + chunkSize * size]
    }
}

function getWindowToCanvas(canvas, x, y) {
    let rect = canvas.getBoundingClientRect();
    let screenX = (x - rect.left) * (canvas.width / rect.width);
    let screenY = (y - rect.top) * (canvas.height / rect.height);
    const ctx = canvas.getContext("2d");
    let transform = ctx.getTransform();
    if (transform.isIdentity) {
        return {
            x: screenX,
            y: screenY
        };
    } else {
        const invMat = transform.invertSelf();
        return {
            x: Math.round(screenX * invMat.a + screenY * invMat.c + invMat.e),
            y: Math.round(screenX * invMat.b + screenY * invMat.d + invMat.f)
        };
    }
}


let chunks = {}
let world = {
    topLeftRef:[0,0],
    chunks
}
let flying = 0;
let flying2 = 0
let x =0
let y =0

let centerBlockIndex = [0, 0]//add math library to parse to whole number
let globalOffset = [0, 0]



let chunkBase = new Chunk(ctx).createFlatChunk(25, 25, x, y, 20, 20, 1);
chunkBase.flying = flying;
chunkBase.flying2 = flying2
chunkBase.createFilledPerlinChunk(perlin, noiseControl.values.gridSize, noiseControl.values.resolution, noiseControl.values.groundLayers, noiseControl.values.heightLimit);
chunkBase.cull()

chunks[`${x},${y}`] = chunkBase

let action = ["flying", '+']
let action2 = ["flying2", '+']


function defineSide(data) {
    let topBlock = data[0][0][0]
    let leftBlock = data[0][data.length - 1][0]
    let rightBlock = data[data.length - 1][0][0]
    let botBlock = data[data.length - 1][data.length - 1][0]

    return { topBlock, leftBlock, rightBlock, botBlock }
}
function drawRegion(topBlock, rightBlock, botBlock, leftBlock) {
    ctx.beginPath()
    ctx.moveTo(topBlock.x, topBlock.y - 50)
    ctx.lineTo(rightBlock.x - 25, rightBlock.y - 25 - 25 / 2)
    ctx.lineTo(botBlock.x, botBlock.y - 25)
    ctx.lineTo(leftBlock.x + 25, leftBlock.y - 25 - 25 / 2)
    ctx.lineTo(topBlock.x, topBlock.y - 50)
    ctx.stroke()
}
function defineHitRegion(center) {
    //ако има hit detection bug - тук е
    let globalCornerTop = getWindowToCanvas(canvas, center.topBlock.x, center.topBlock.y - 50)
    let globalCornerLeft = getWindowToCanvas(canvas, center.leftBlock.x + 25, center.leftBlock.y - 25 - 25 / 2)
    let globalCornerRight = getWindowToCanvas(canvas, center.rightBlock.x - 25, center.rightBlock.y - 25 - 25 / 2)
    let globalCornerBot = getWindowToCanvas(canvas, center.botBlock.x, center.botBlock.y - 25)

    ctx.beginPath()
    ctx.moveTo(globalCornerTop.x, globalCornerTop.y)
    ctx.lineTo(globalCornerRight.x, globalCornerRight.y)
    ctx.lineTo(globalCornerBot.x, globalCornerBot.y)
    ctx.lineTo(globalCornerLeft.x, globalCornerLeft.y)
    ctx.lineTo(globalCornerTop.x, globalCornerTop.y)
    ctx.closePath();
}

function drawNeighbours(center, centerTopLeft, centerTop, centerLeft, centerTopRight, centerRight, centerBotLeft, centerBot, centerBotRight) {
    drawRegion(center.topBlock, center.rightBlock, center.botBlock, center.leftBlock)
    drawRegion(centerLeft.topBlock, centerLeft.rightBlock, centerLeft.botBlock, centerLeft.leftBlock)
    drawRegion(centerTopRight.topBlock, centerTopRight.rightBlock, centerTopRight.botBlock, centerTopRight.leftBlock)
    drawRegion(centerRight.topBlock, centerRight.rightBlock, centerRight.botBlock, centerRight.leftBlock)
    drawRegion(centerBotLeft.topBlock, centerBotLeft.rightBlock, centerBotLeft.botBlock, centerBotLeft.leftBlock)
    drawRegion(centerBot.topBlock, centerBot.rightBlock, centerBot.botBlock, centerBot.leftBlock)
    drawRegion(centerBotRight.topBlock, centerBotRight.rightBlock, centerBotRight.botBlock, centerBotRight.leftBlock)
    drawRegion(centerTopLeft.topBlock, centerTopLeft.rightBlock, centerTopLeft.botBlock, centerTopLeft.leftBlock)
    drawRegion(centerTop.topBlock, centerTop.rightBlock, centerTop.botBlock, centerTop.leftBlock)
}



function visualize(neighbours) {


    function createFormation(action, neighbour, chunks,sec) {

        if (!chunks[`${neighbours[neighbour][0]},${neighbours[neighbour][1]}`]) {
            flying = chunks[`${x},${y}`].flying;
            flying2 = chunks[`${x},${y}`].flying2
            eval(`${action[0]} ${action[1]}= noiseControl.values.chunkSize * (noiseControl.values.gridSize /  noiseControl.values.resolution)`)
            if(sec){
             eval(`${action2[0]} ${action2[1]}= noiseControl.values.chunkSize * (noiseControl.values.gridSize /  noiseControl.values.resolution)`)
            }
            let chunk = new Chunk(ctx).createFlatChunk(25, 25, neighbours[neighbour][0], neighbours[neighbour][1], 20, 20, 1);
            chunk.flying = flying;
            chunk.flying2 = flying2
            chunk.createFilledPerlinChunk(perlin, noiseControl.values.gridSize, noiseControl.values.resolution, noiseControl.values.groundLayers, noiseControl.values.heightLimit);
            chunk.cull()
            chunks[`${neighbours[neighbour][0]},${neighbours[neighbour][1]}`] = chunk

        }

    }

    createFormation(action, "main", chunks)
    action = ["flying2", '+']
    createFormation(action, "rightOfMain", chunks)
    action = ["flying", "-"]
    createFormation(action, "topOfMain", chunks)
    action = ["flying2", "-"]
    createFormation(action, "leftOfMain", chunks)
    action = ["flying", '+']
    createFormation(action, "botOfMain", chunks)
    
    action = ["flying", '-']
    action2 = ["flying2", '+']
    createFormation(action, "topRightOfMain", chunks,true)
    action = ["flying", '-']
    action2 = ["flying2", '-']
    createFormation(action, "topLeftOfMain", chunks,true)
    action = ["flying", '+']
    action2 = ["flying2", '+']
    createFormation(action, "botRightOfMain", chunks,true)
    action = ["flying", '+']
    action2 = ["flying2", '-']
    createFormation(action, "botLeftOfMain", chunks,true)


    chunks[`${neighbours.topLeftOfMain[0]},${neighbours.topLeftOfMain[1]}`].loadChunk(gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, gameObject.block)
    chunks[`${neighbours.topOfMain[0]},${neighbours.topOfMain[1]}`].loadChunk(gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, gameObject.block)
    chunks[`${neighbours.leftOfMain[0]},${neighbours.leftOfMain[1]}`].loadChunk(gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, gameObject.block)
    chunks[`${neighbours.botLeftOfMain[0]},${neighbours.botLeftOfMain[1]}`].loadChunk(gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, gameObject.block)
    chunks[`${neighbours.main[0]},${neighbours.main[1]}`].loadChunk(gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, gameObject.block)
    chunks[`${neighbours.topRightOfMain[0]},${neighbours.topRightOfMain[1]}`].loadChunk(gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, gameObject.block)
    chunks[`${neighbours.rightOfMain[0]},${neighbours.rightOfMain[1]}`].loadChunk(gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, gameObject.block)
    chunks[`${neighbours.botOfMain[0]},${neighbours.botOfMain[1]}`].loadChunk(gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, gameObject.block)
    chunks[`${neighbours.botRightOfMain[0]},${neighbours.botRightOfMain[1]}`].loadChunk(gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, gameObject.block)
}
function render() {
    requestAnimationFrame(render);
    if (gameObject.isActive == true) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        view.apply();
        //   chunk.loadChunk(gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, blocksMenu.container.name);
        let neighbours = neighboursOfCenterChunkCoords([x, y], 25, 20)

        visualize(neighbours)
      
        let midPoint = getWindowToCanvas(canvas, width / 2, height / 2)


        ctx.beginPath();
        ctx.moveTo(midPoint.x, midPoint.y - 40)
        ctx.lineTo(midPoint.x, midPoint.y + 40)
        ctx.moveTo(midPoint.x - 40, midPoint.y)
        ctx.lineTo(midPoint.x + 40, midPoint.y)
        ctx.closePath();
        ctx.stroke()


        let center = defineSide(world.chunks[neighbours.main.join(",")].mapData);//2,5
        let leftOfMain = defineSide(world.chunks[neighbours.leftOfMain.join(",")].mapData);
        let rightOfMain = defineSide(world.chunks[neighbours.rightOfMain.join(",")].mapData);
        let botOfMain = defineSide(world.chunks[neighbours.botOfMain.join(",")].mapData);
        let topOfMain = defineSide(world.chunks[neighbours.topOfMain.join(",")].mapData);
        let botLeftOfMain = defineSide(world.chunks[neighbours.botLeftOfMain.join(",")].mapData);
        let topLeftOfMain = defineSide(world.chunks[neighbours.topLeftOfMain.join(",")].mapData);
        let topRightOfMain = defineSide(world.chunks[neighbours.topRightOfMain.join(",")].mapData);
        let botRightOfMain = defineSide(world.chunks[neighbours.botRightOfMain.join(",")].mapData);
 
        drawNeighbours(center, leftOfMain, rightOfMain, botOfMain, topOfMain, botLeftOfMain, topLeftOfMain, topRightOfMain, botRightOfMain)

        
     //   drawNeighbours(center, leftOfMain, rightOfMain, botOfMain, topOfMain, botLeftOfMain, topLeftOfMain, topRightOfMain, botRightOfMain)


        function collide(region, part) {
            defineHitRegion(region)
 
            if (ctx.isPointInPath(midPoint.x, midPoint.y)) {
 
                if (part == "topLeftOfMain") {
                    //трябва да смяташ правилно, ти реално взимаш топ корнер, но не можеш само чрез него да определиш къде да почне реда/колоната              
                    globalOffset[1] = world.topLeftRef[1] - noiseControl.values.chunkSize * gameObject.tileW
                }
                if (part == "botRightOfMain") {
                    globalOffset[1] = world.topLeftRef[1] + noiseControl.values.chunkSize * gameObject.tileW
                }
                if (part == "botLeftOfMain") {
                    globalOffset[0] = world.topLeftRef[0] - (noiseControl.values.chunkSize * gameObject.tileW) * 2
                }
                if (part == "topRightOfMain") {
                    globalOffset[0] = world.topLeftRef[0] + (noiseControl.values.chunkSize * gameObject.tileW) * 2
                }
                if (part == "leftOfMain") {
                    globalOffset[1] = world.topLeftRef[1] - (noiseControl.values.chunkSize * gameObject.tileW) / 2
                    globalOffset[0] = world.topLeftRef[0] - noiseControl.values.chunkSize * gameObject.tileW
                }
                if (part == "rightOfMain") {
                    globalOffset[1] = world.topLeftRef[1] + (noiseControl.values.chunkSize * gameObject.tileW) / 2
                    globalOffset[0] = world.topLeftRef[0] + noiseControl.values.chunkSize * gameObject.tileW
                }
                if (part == "topOfMain") {
                    globalOffset[1] = world.topLeftRef[1] - (noiseControl.values.chunkSize * gameObject.tileW) / 2
                    globalOffset[0] = world.topLeftRef[0] + noiseControl.values.chunkSize * gameObject.tileW
                }
                if (part == "botOfMain") {
                    globalOffset[1] = world.topLeftRef[1] + (noiseControl.values.chunkSize * gameObject.tileW) / 2
                    globalOffset[0] = world.topLeftRef[0] - noiseControl.values.chunkSize * gameObject.tileW
                }
 
 
                centerBlockIndex[1] = neighbours[part][1]
                centerBlockIndex[0] = neighbours[part][0]
                x = centerBlockIndex[0] 
                y = centerBlockIndex[1] 
                
            }
        }
 
 
        collide(leftOfMain, "leftOfMain")//topLeft
        collide(rightOfMain, "rightOfMain")//botRight
        collide(botOfMain, "botOfMain")//botLeft
        collide(topOfMain, "topOfMain")//topRight
        collide(botLeftOfMain, "botLeftOfMain")//left
        collide(topLeftOfMain, "topLeftOfMain")//top
        collide(topRightOfMain, "topRightOfMain")//right
        collide(botRightOfMain, "botRightOfMain")//bot
 
 


     

        gameObject.isActive = false;
    };
};

render();

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gameObject.isActive = true;
});

window.addEventListener("keydown", function (e) {
    if (gameObject.action[e.code]) {
        gameObject.key = e.code;
        gameObject.move = true
        updateMap()
    };
//    let neighbour = neighboursOfCenterChunkCoords([x, y], 25, 20)
//
//    if (e.code == "KeyW") {
//        action = ["flying", '-']
//        action2 = ["flying2", '-']
//        x = neighbour.topLeftOfMain[0]
//        y = neighbour.topLeftOfMain[1]
//    }
//    if (e.code == "KeyS") {
//        action = ["flying", '+']
//        action2 = ["flying2", '+']
//        x = neighbour.botRightOfMain[0]
//        y = neighbour.botRightOfMain[1]
//    }
//    if (e.code == "KeyA") {
//        action = ["flying", '+']
//        action2 = ["flying2", '-']
//        x = neighbour.botLeftOfMain[0]
//        y = neighbour.botLeftOfMain[1]
//    }
//    if (e.code == "KeyD") {
//        action = ["flying", '-']
//        action2 = ["flying2", '+']
//        x = neighbour.topRightOfMain[0]
//        y = neighbour.topRightOfMain[1]
//    }
});