let menu = document.getElementById("menu");
let mapOptionsWindow = document.getElementById("optionPartsMenu");

let operations = ["removeTile", "increaseSize", "colorise", "controlNoise"];

let mapOperations = {
    "MapMode": () => {
        let optionFragment = `<div class = "part" id ="MapMode">`;
        optionFragment += `<button id = "mode" onclick = "mapType(this)">Perlin</button>`;
        return optionFragment;
    }
};

window.onload = function () {
    menu.addEventListener("click", addCommand);
    function addCommand(e) {
        if (e.target.tagName == "BUTTON" && e.target.innerHTML != "colorise" && e.target.innerHTML != "controlNoise") {
            gameObject.eventToPut = e.target.innerHTML;
        };
        if (e.target.innerHTML == "colorise") {
            displayMenus(blocksMenu.container)
            displayMenus(picker.picker)
        }
        if (e.target.innerHTML == "controlNoise") {
            displayMenus(noiseControl.container)
        }
    };

    Object.keys(mapOperations).forEach(key => {
        mapOptionsWindow.innerHTML += mapOperations[key]();
    });
};

function addOptionButtons(operationGroup, menu) {
    for (let i = 0; i < operationGroup.length; i++) {
        let button = document.createElement("button");
        button.className = "mainMenuOptionButtons";
        button.innerHTML = operationGroup[i];
        menu.appendChild(button);
    };
};

addOptionButtons(operations, menu);

function showElement(button, el) {
    button.style.display = "none"
    el.style.display = "flex";
};

[menu, mapOptionsWindow].forEach(el => {
    el.addEventListener("mouseleave", function () {
        el.style.display = "none";
        document.getElementById('controlPanelButton').style.display = "block";
        document.getElementById('controlWindowButton').style.display = "block";
    });
})

function mapType(el) {
    //    let el1 = document.getElementById("gridSize")
    //    let el2 = document.getElementById("resolution")
    //    let el3 = document.getElementById("groundLayers")
    //    let el4 = document.getElementById("heightLimit")
    let el1 = document.getElementById("scale")
    let el2 = document.getElementById("octaves")
    let el3 = document.getElementById("persistance")
    let el4 = document.getElementById("lacunarity")
    let el5 = document.getElementById("exponantiation")
    let el6 = document.getElementById("height")

    if (el.innerText == "Flat") {
        el.innerText = "Perlin";
        el.style.backgroundColor = "#ffa000";
        el1.disabled = el2.disabled = el3.disabled = el4.disabled = el5.disabled = el6.disabled = false;
    } else {
        el.innerText = "Flat";
        el.style.backgroundColor = "gray";
        el1.disabled = el2.disabled = el3.disabled = el4.disabled = el5.disabled = el6.disabled = true;
    }
    updateMap();
};
