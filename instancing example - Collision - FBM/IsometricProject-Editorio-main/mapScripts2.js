let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let gameObject = {
    key: undefined,
    eventToPut: undefined,
    isScrolling: undefined,
    mouseCoordinates: [],
    tileW: 20,
    tileZ: 20,
    x: window.innerWidth / 2,
    y: window.innerHeight / 4,
    oldX: 0,
    oldY: 0,
    button: false,
    isActive: false
};

function returnParameters() {
    return {
        flatCoords: Number(document.getElementById("quantity1").value),
        mapMode: document.getElementById("MapMode").innerText,
        fieldValueGridSize: Number(document.getElementById("gridSize").value),
        fieldValueResolution: Number(document.getElementById("resolution").value),
        fieldValueGroundLayers: Number(document.getElementById("groundLayers").value),
        fieldValueHeightLimit: Number(document.getElementById("heightLimit").value)
    };
};

let chunk = new Chunk(ctx);

let perlin = new Perlin();
perlin.seed();

function updateMap(comm) {
    let values = returnParameters();
    gameObject.isActive = true;
    if (values.mapMode == "Flat") {
        chunk.createFlatChunk(gameObject.tileW, gameObject.tileZ, gameObject.x, gameObject.y, values.flatCoords, values.flatCoords, "0,0");
        return;
    };
    if (comm == "edit") {
        chunk.createPerlinChunk(values.flatCoords, perlin, "0,0", values.fieldValueGridSize, values.fieldValueResolution, values.fieldValueGroundLayers, values.fieldValueHeightLimit);
        return;
    };
    if (comm == "make") {
        chunk.createFlatChunk(gameObject.tileW, gameObject.tileZ, gameObject.x, gameObject.y, values.flatCoords, values.flatCoords, "0,0").createPerlinChunk(values.flatCoords, perlin, "0,0", values.fieldValueGridSize, values.fieldValueResolution, values.fieldValueGroundLayers, values.fieldValueHeightLimit);
        return;
    };
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

setTimeout(function () {
    document.body.style.backgroundImage = "none";
    updateMap("make");
}, 1000);

function createGrid(x, y, z) {
    let grid = []
    let tileW = 20
    let tileZ = 20
    let xx = width/2
    let yy = height/3-z*tileW/3
    let oriX = xx
    let oriY = yy
    for (let i = 0; i < x; i++) {
        let row = [];
        for (let j = 0; j < y; j++) {
            let col = []
            for (let k = 0; k < z; k++) {
                col[k] = new Iso3d(xx, yy, tileW, tileZ).drawCube()
                yy += tileZ
            }
            xx += tileW;
            yy += tileW / 2;
            yy -= tileZ * z
            row[j] = col
        }
        xx = oriX -= tileW;
        yy = oriY += tileW / 2;
        grid[i] = row
    }
    chunk.mapData["0,1"] = grid
}
createGrid(15, 15, 10)

function loadGrid(chunk) {
    for (let i = 0; i < chunk.length; i++) {
        for (let j = 0; j < chunk[i].length; j++) {
            for (let k = chunk[i][j].length-1; k >= 0 ; k--) {
                chunk[i][j][k].fillStrokeCube(ctx)
            }
        }
    }
}


function draw(rule) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    view.apply();
    loadGrid(chunk.mapData["0,1"])
    // chunk.loadChunk(`0,0`, gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, rule, gameObject.key);

};

ctx.lineWidth = 0.2;

function render() {
    requestAnimationFrame(render);
    if (gameObject.isActive == true) {
        draw("fillCube");
        window.clearTimeout(gameObject.isScrolling);
        gameObject.isScrolling = setTimeout(function () { draw("fillStrokeCube") }, 500);
        gameObject.isActive = false;
    };
};

render();

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gameObject.isActive = true;
    ctx.lineWidth = 0.2;
});

window.addEventListener("keydown", function (e) {
    gameObject.key = e.code;
    if (document.getElementById("MapMode").innerText == "Perlin") {
        let action = {
            "KeyW": ["flying", "-", "flying2", "-"],
            "KeyS": ["flying", "+", "flying2", "+"],
            "KeyA": ["flying", "+", "flying2", "-"],
            "KeyD": ["flying", "-", "flying2", "+"]
        };
        if (action[e.code]) {
            let values = returnParameters();
            chunk.createPerlinChunk(values.flatCoords, perlin, "0,0", values.fieldValueGridSize, values.fieldValueResolution, values.fieldValueGroundLayers, values.fieldValueHeightLimit, ...action[e.code]);
            gameObject.isActive = true;
        };
    };
});
