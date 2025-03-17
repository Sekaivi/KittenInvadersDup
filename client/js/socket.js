const socket = io();
let boss;
let players = {}; // faut faire en sorte d'ajouter le joueur 2 en tant qu'objet !!!! Par contre il ne faut pas pouvoir le controler >:(
let player1Id = null;
let player2Id = null;


socket.on("connect", () => {
    player1Id = socket.id;
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    players[player1Id] = new Player(x, y, "media/player.png", scaleX, scaleY);
});

socket.on("currentPlayers", (serverPlayers) => {
    console.log('A user has connected ! current players in the game:');
    Object.keys(serverPlayers).forEach((newPlayer) => {
        if (newPlayer != player1Id) {
            player2Id = newPlayer;
            let x = canvas.width / 2 - 200;
            let y = canvas.height / 2 - 200;
            players[player2Id] = new Player(x, y, "media/player.png", scaleX, scaleY);
        }
    });
});

socket.on('startGame', () => {
    console.log("Starting game :D");
    initGame();
});

socket.on("updateBullets", (updatedBullets) => {
    player.projectiles = updatedBullets;
});

socket.on("updateSpecial", (updatedSpecial) => {
    player.specialProjectiles = updatedSpecial;
});

socket.on("updateGame", (newGameData) => {
    // mettre à jour le boss
    const newBossData = newGameData.newBossData;
    boss.health = newBossData.health,
        boss.positionh = newBossData.positionh,
        boss.positionv = newBossData.positionv,
        boss.bullets = newBossData.bullets,
        boss.telegraphedZones = newBossData.telegraphedZones
    // mettre à jour les joueurs
    let newPlayer1Data = newGameData.newPlayerData[player1Id];
    let newPlayer2Data = newGameData.newPlayerData[player2Id];
    let player1 = players[player1Id];
    let player2 = players[player2Id];
    if (player1 && newPlayer1Data) {
        for (data in newPlayer1Data) {
            player1[data] = newPlayer1Data[data];
        }
    }
    if (player2 && newPlayer2Data) {
        for (data in newPlayer2Data) {
            player2[data] = newPlayer2Data[data];
        }
    }

});



socket.on("loadBoss", (bossInfo) => {
    boss = new Boss(bossInfo.spritesheet, bossInfo.totalFrames, bossInfo.health, bossInfo.bulletImagePath,
        bossInfo.name, scaleX, scaleY);
});

function handleKeyChange(key, isPressed) {
    let player = players[player1Id];
    // s'il bouge
    if (["z", "s", "q", "d"].includes(key)) {
        keys[key] = isPressed;
    }

    // s'il tire
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key) && !player.isOverheated) {
        keys[key] = isPressed;
    }

    // s'il tire son SPECIAL
    if (["e"].includes(key) && player.specialCharge >= player.specialMaxCharge && !player.isSpecialActive) {
        keys[key] = isPressed;
    }

    socket.emit("updatePlayerKeys", keys);
}



// CE QUE LE CLIENT RECOIT:
// etats du jeu (en route ou pas ?), les joueurs où ils sont et comment, le boss il marche comment
// mettre à jour le boss actuel et ne plus stocker la liste des boss
// boss battu
// joueur mort (se fait revive auto à la manche suivante full health avec ses upgrades)\ il est juste temporairement désactivé
// partie perdue
// degats recus
// jeu mis en pause

// CE QUE LE CLIENT ENVOIT:
// upgrades joueurs
// degat infligés