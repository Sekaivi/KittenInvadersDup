const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const World = require('./server/World');
const path = require("path");

const PORT = 80;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Gestion du jeu virtuel
const world = new World(io);

app.use(express.static(path.join(__dirname, "client")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "html/Testgame.html"));
});

// instructions sockets

io.on("connection", (socket) => {

    console.log("A user connected");

    if (Object.keys(world.players).length >= 2) {
        console.log(world.players) ;
        socket.emit("server-full");
        socket.disconnect();
        console.log(`Connexion refusée pour ${socket.id}, partie pleine.`);
        return;
    }
    
    world.addPlayer(socket.id);

    if (Object.keys(world.players).length == 2) {
        io.emit('startGame');
        world.gameStart();
    }

    io.emit("currentPlayers", world.players);

    socket.on('updatePlayerKeys', (keys) => {
        world.updatePlayerKeys(socket.id , keys) ;
    })


    socket.on("disconnect", () => {
        console.log("Un joueur s'est déconnecté : " + socket.id);
        world.removePlayer(socket.id)
        io.emit("playerDisconnected", socket.id);
    });



});



server.listen(PORT, () => {
    console.log("Server running on http://localhost:" + PORT);
});
