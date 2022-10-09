let canvas = document.createElement("canvas");
document.body.prepend(canvas)
let canvas2 = document.createElement("canvas");
document.body.prepend(canvas2)
let ctx = canvas.getContext("2d");
let ctx2 = canvas2.getContext("2d");
let width = canvas.width = canvas2.width = window.innerWidth;
let height = canvas.height = canvas2.height = window.innerHeight;


let gameObject = {
    key: undefined,
    eventToPut: undefined,
    isScrolling: undefined,
    mouseCoordinates: [],
    tileW: 50,
    tileZ: 20,
    x: window.innerWidth / 2,
    y: window.innerHeight / 4,
    oldX: 0,
    oldY: 0,
    button: false,
    flatChunk: false,
    isActive: false
};

function returnParameters() {
    return {
        flatCoords: Number(document.getElementById("quantity1").value),
        perlinCoords: Number(document.getElementById("quantity3").value),
        fieldValueGridSize: Number(document.getElementById("gridSize").value),
        fieldValueResolution: Number(document.getElementById("resolution").value),
        fieldValueGroundLayers: Number(document.getElementById("groundLayers").value),
        fieldValueHeightLimit: Number(document.getElementById("heightLimit").value)
    };
};

let chunk = new Chunk();

let perlin = new Perlin();
perlin.seed();

function updateMap(command) {
    try {
        let values = returnParameters();
        if (command == "c1") {
            gameObject.flatChunk = false
            chunk.createFlatChunk(canvas, ctx, gameObject.tileW, gameObject.tileZ, window.innerWidth / 2, window.innerHeight / 4, values.flatCoords, values.flatCoords)
        };
        if (command == "c2") {
            if (gameObject.flatChunk == true) {
                chunk.createPerlinChunk(values.perlinCoords, perlin, "0,0", values.fieldValueGridSize, values.fieldValueResolution, values.fieldValueGroundLayers, values.fieldValueHeightLimit);
            }
        };
        if (command == "c3") {
            gameObject.flatChunk = true
            chunk.createFlatChunk(canvas, ctx, gameObject.tileW, gameObject.tileZ, window.innerWidth / 2, window.innerHeight / 4, values.perlinCoords, values.perlinCoords).createPerlinChunk(values.perlinCoords, perlin, "0,0", values.fieldValueGridSize, values.fieldValueResolution, values.fieldValueGroundLayers, values.fieldValueHeightLimit)
        };
        gameObject.isActive = true
    } catch (err) {
        alert(err);
    };
};

canvas.addEventListener("mousemove", mouseEvent, { passive: true });
canvas.addEventListener("mousedown", mouseEvent, { passive: true });
canvas.addEventListener("mouseup", mouseEvent, { passive: true });
canvas.addEventListener("mouseout", mouseEvent, { passive: true });
canvas.addEventListener("mousewheel", onmousewheel, false);
canvas.addEventListener("click", function () {
    if (gameObject.eventToPut) {
        gameObject.isActive = true
    }
});

function mouseEvent(event) {
    if (event.type === "mousedown") { gameObject.button = true }
    if (event.type === "mouseup" || event.type === "mouseout") { gameObject.button = false }
    gameObject.oldX = gameObject.mouseCoordinates[0];
    gameObject.oldY = gameObject.mouseCoordinates[1];
    gameObject.mouseCoordinates[0] = event.offsetX;
    gameObject.mouseCoordinates[1] = event.offsetY;
    if (gameObject.button) { // pan
        view.pan({ x: gameObject.mouseCoordinates[0] - gameObject.oldX, y: gameObject.mouseCoordinates[1] - gameObject.oldY });
        gameObject.isActive = true
    }
}

//TODO - TO BE SWITCHABLE
view.setContext(ctx);

function onmousewheel(event) {
    let e = window.event || event;
    let x = e.offsetX;
    let y = e.offsetY;
    const delta = e.type === "mousewheel" ? e.wheelDelta : -e.detail;
    if (delta > 0) {
        view.scaleAt({ x, y }, 1.1)
    }
    else {
        view.scaleAt({ x, y }, 1 / 1.1)
    }
    gameObject.isActive = true
    e.preventDefault();
}

setTimeout(function () {
    document.body.style.backgroundImage = "none";
    document.getElementById("quantity3").dispatchEvent(new Event("input"));
}, 1000);

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
function saveRegionAsImage(matrix) {
    let f3 = (el) => { return { dx: el.x - el.width + el.width, dy: el.y - el.h - (el.width * 0.5 + el.width * 0.5) } };//top
    let maxx = f3(matrix[0][0]);
    let otCurr = matrix[0][0];
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            let curr = f3(matrix[i][j]);
            if (curr.dy < maxx.dy) {
                maxx = curr
                otCurr = matrix[i][j]
            }

        }
    }


    let pA = getWindowToCanvas(canvas, 0, 0);
    let pC = getWindowToCanvas(canvas, width, height);

    let p1 = matrix[matrix.length - 1][matrix[matrix.length - 1].length - 1]
    let p2 = matrix[0][matrix[matrix.length - 1].length - 1]

    let cX = (p1.x + (p2.x + p2.width)) - p1.x

    let botRight = [cX, p1.y]
    let topLeft = [width - cX, (otCurr.y - otCurr.h) - otCurr.width];

    let botXmoment = Math.abs(pC.x - pA.x)
    let botYmoment = Math.abs(pC.y - pA.y)

    let topXmoment2 = Math.min(topLeft[0], botRight[0])
    let topYmoment2 = Math.min(topLeft[1], botRight[1])
    let botXmoment2 = Math.abs(botRight[0] - topLeft[0])
    let botYmoment2 = Math.abs(botRight[1] - topLeft[1])

    canvas.width = botXmoment2
    canvas.height = botYmoment2

    ctx.translate(-topXmoment2, -topYmoment2)



    //    ctx.beginPath()
    //    ctx.rect(topXmoment2, topYmoment2, botXmoment2, botYmoment2);
    //    ctx.stroke()

}
//формула за определяне на необходимия офсет -> това може да спести ненужни итерации и операции
// this.flying2+ size*(gridSize / resolution)//yoff
// this.flying+ size*(gridSize / resolution)//xoff

function draw(val) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    view.apply();
    chunk.loadChunk(gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, val, gameObject.key);
};//BUG -> ако кликнеш твърде бързо бутона за генериране на свят, ще се тригърне второто рисуване на екрана и няма да се махне
//тоест, задачата трябва да се изпълнява или след 500мс, или точно след изпълнение на второто рендърване


function showStaggeredGrid(rows, cols) {
    let chunkSize = Number(document.getElementById("quantity3").value)
    let tileSize = gameObject.tileW
    let img = new Image()
    img.src = chunk.imgs["0,0"];

    let x = 250;
    let y = 250;
    let baseX = 250
    let baseY = 250
    let formula = (chunkSize * tileSize);

    for (let i = 0; i < cols; i++) {
        let tempRow = []
        for (let j = 0; j < rows; j++) {
            let img2 = new Image()
            img2.src = chunk.imgs[`${i},${j}`];
            let imgData = [img2, x, img.height - img2.height + y, img2.width, img2.height];
            if (j % 2 == 0) {

                ctx2.beginPath()
                ctx2.drawImage(...imgData)
                x += formula
                y += formula / 2
            } else {

                let el = imgData
                tempRow[j] = el
                x += formula
                y -= formula / 2
            }

        }
        tempRow.forEach(el => {
            ctx2.beginPath()
            ctx2.drawImage(...el)
        })
        x += formula
        baseY += formula
        x = baseX
        y = baseY
    }
}

function secDraw() {
    ctx2.setTransform(1, 0, 0, 1, 0, 0);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    view.apply();

    showStaggeredGrid(10, 5)

}
function dynamicUpdate() {
    if (gameObject.isActive == true) {
        draw(false);
        window.clearTimeout(gameObject.isScrolling);
        gameObject.isScrolling = setTimeout(draw, 500);
        gameObject.isActive = false
    };
}

let code = "0,0";

let drawCall = dynamicUpdate


function changeBaseChunk(code) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveRegionAsImage(chunk.chunk)
    chunk.loadChunk(gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, gameObject.key);
    if (!chunk.imgs[code]) {
        chunk.imgs[code] = canvas.toDataURL();
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

}


function staggeredGrid(rows, cols) {

    let action = ["flying2", '+']
    let values = returnParameters();

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            //create magic
            if (i > 0 && j == 0) {
                chunk.flying = chunk.offsets[`${i - 1},1`][0]
                chunk.flying2 = chunk.offsets[`${i - 1},1`][1]
                action = ["flying", '+']
            }
            eval(`chunk.${action[0]} ${action[1]}= values.perlinCoords * (values.fieldValueGridSize / values.fieldValueResolution)`)
            if (action[2], action[3]) {
                eval(`chunk.${action[2]} ${action[3]}= values.perlinCoords * (values.fieldValueGridSize / values.fieldValueResolution)`)
            }

            chunk.offsets[`${i},${j}`] = [chunk.flying, chunk.flying2]
            chunk.createPerlinChunk(values.perlinCoords, perlin, `${i},${j}`, values.fieldValueGridSize, values.fieldValueResolution, values.fieldValueGroundLayers, values.fieldValueHeightLimit, ...action);

            changeBaseChunk(`${i},${j}`)
            if (j % 2 == 0) {

                action = ["flying2", '+']
            } else {

                action = ["flying", '-']
            }
        }
    }
}

document.getElementById("generateButton").addEventListener("click", function () {

    staggeredGrid(10, 5)

    view.setContext(ctx2);
    drawCall = secDraw
})

function render() {
    requestAnimationFrame(render);
    drawCall()
};
render();

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas2.width = window.innerWidth;
    canvas2.height = window.innerHeight;
    gameObject.isActive = true
});

window.addEventListener("keydown", function (e) {
    if (gameObject.flatChunk == true) {
        gameObject.key = e.code;
        let action = {
            "KeyW": ["flying", "-", "flying2", "-"],
            "KeyS": ["flying", "+", "flying2", "+"],
            "KeyA": ["flying", "+", "flying2", "-"],
            "KeyD": ["flying", "-", "flying2", "+"]
        };
        if (action[e.code]) {
            let values = returnParameters();
            chunk.createPerlinChunk(values.perlinCoords, perlin, "0,0", values.fieldValueGridSize, values.fieldValueResolution, values.fieldValueGroundLayers, values.fieldValueHeightLimit, ...action[e.code]);
            gameObject.isActive = true
        };
    };
});