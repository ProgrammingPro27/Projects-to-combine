let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let blocksMenu = new BlockMenu()
blocksMenu.saveEl(["#808080", "#A9A9A9", "#909090"]).saveEl(["#FFFCFC", "#FFFBFB", "#FFFAFA"]).saveEl(["#2389da", "#2389da", "#2389da"]).saveEl(["#4D525B", "#787F8E", "#606672"]).saveEl(["#cabc91", "#dbd1b4", "#d3c7a2"]).saveEl(["#8B4513", "#A0522D", "#6B8E23"])

let noiseControl = new NoiseControl()//values to be reworked
    .createComponent("chunkSize", 2, 250, 50, 1,updateMap)//150
    .createComponent("scale", 1, 1000, 14, 1,updateMap)
    .createComponent("octaves", 1, 1000, 6, 1,updateMap)
    .createComponent("persistance", 0.1, 100, 34, 0.1,updateMap)
    .createComponent("lacunarity", 0.1, 1000, 114, 0.1,updateMap)
    .createComponent("exponantiation", 0.1, 1000, 3.5, 0.1,updateMap)
    .createComponent("height", 1, 1000, 132, 1,updateMap)


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
        "KeyW": ["flying", "--", "flying2", "--"],
        "KeyS": ["flying", "++", "flying2", "++"],
        "KeyA": ["flying", "++", "flying2", "--"],
        "KeyD": ["flying", "--", "flying2", "++"]
    },
    move: false
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
    if (document.getElementById("MapMode").innerText == "Perlin") {
        if (gameObject.move == true) {
            let direction = gameObject.action[gameObject.key]
            chunk.setDirection(direction[0], direction[1], direction[2], direction[3], noiseControl.values.octaves, noiseControl.values.scale)
            gameObject.move = false
        };

        chunk.createPerlinChunk(perlin, noiseControl.values.scale, noiseControl.values.octaves, noiseControl.values.persistance, noiseControl.values.lacunarity, noiseControl.values.exponantiation, noiseControl.values.height );
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

setTimeout(function () {
    document.body.style.backgroundImage = "none";
    updateMap();
}, 1000);

function render() {
    requestAnimationFrame(render);
    if (gameObject.isActive == true) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        view.apply();
        chunk.loadChunk(gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, blocksMenu.container.name);
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
});