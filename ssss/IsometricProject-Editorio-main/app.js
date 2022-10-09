//include http, fs and url module
const http = require('http');
const fs = require('fs');

//create http server listening on port 8080
http.createServer(function (req, res) {
    let path = "";
    switch (req.url) {
        case "/":
            path = "./index.html";
            ; break;
        case "/Chunk.js":
            path = "Chunk.js";
            ; break;
        case "/contentMethods.js":
            path = "contentMethods.js";
            ; break;
        case "/IsometricTile.js":
            path = "IsometricTile.js";
            ; break;
        case "/mapScripts.js":
            path = "mapScripts.js";
            ; break;
        case "/Perlin.js":
            path = "Perlin.js";
            ; break;
        case "/ZoomAndPan.js":
            path = "ZoomAndPan.js";
            ; break;
        case "/style.css":
            path = "style.css";
            ; break;
    }
    fs.readFile(path, (err, data) => {
        if (err) {
            res.end();
        } else {
            if (path.includes("html")) {
                res.setHeader('Content-Type', 'text/html');
                res.end(data);
            } else if (path.includes("css")) {
                res.setHeader('Content-Type', 'text/css');
                res.end(data);
            } else {
                res.setHeader('Content-Type', 'text/javascript');
                res.end(data);
            }
        }
    })
}).listen(8080);
console.log("Server running at http://localhost:8080/");