const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { readFile } = require("fs/promises");
const path = require("path");
const PORT = 80;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html/index.html"));
});

app.get("/game", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html/Testgame.html"));
});


/* DEMARRAGE DU SERVEUR */
server.listen(PORT, () => {
    console.log("Server running on http://localhost:" + PORT);
});

/* DEBUG */

io.on("connection", (socket) => {
    console.log("Un utilisateur s'est connecté");

    socket.on("message", (msg) => {
        console.log("Message reçu :", msg);
        io.emit("message", msg); // Répète le message à tous les clients
    });

    socket.on("disconnect", () => {
        console.log("Un utilisateur s'est déconnecté");
    });
});