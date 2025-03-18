const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const dialogBox = document.getElementById('DialogBox');
const dialogText = document.getElementById("dialogText");
const upgradesBox = document.getElementById('UpgradesBox');
const upgradesText = document.getElementById("upgradesText");
const connectingBox = document.getElementById("connectingToGame") ;
const createRoomButton = document.getElementById("createRoom") ;
const joinRoomButton = document.getElementById("joinRoom") ;

const joinModal = document.getElementById("joiningRoom");
const joiningText = document.getElementById("joiningText") ;
const roomCodeInput = document.getElementById("roomCodeInput");
const displayJoinButton = document.getElementById("displayJoinRoom") ;
const cancelJoin = document.getElementById("cancelJoin") ;

// Game over
const gameOverScreen = document.getElementById('gameOverScreen') ;
const playAgain = document.getElementById('playAgain') ;
const quit = document.getElementById('quit') ;

displayJoinButton.onclick = function () {
    displayJoining("Entrez un code: ") ;
};
cancelJoin.onclick = function () {
    hideModals() ;
    displayConnecting() ;
};

let scaleX = canvas.width / 1920;  // resolution de reference 1920 * 1080
let scaleY = canvas.height / 1080;
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let upgradesTier = null ;
let currentUpgrades = null ;
let randBuffs ;
let selectedUpgradeID;

const keys = {};
window.addEventListener("keydown", (e) => handleKeyChange(e.key, true));
window.addEventListener("keyup", (e) => handleKeyChange(e.key, false));

// à ajuster
const confirmButton = document.getElementById('confirmButton');
const upgradeButtons = document.querySelectorAll('.upgradeButton');

upgradeButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Désélectionner les autres boutons
        upgradeButtons.forEach(btn => btn.classList.remove('selected'));

        // Sélectionner l'upgrade actuelle
        button.classList.add('selected');
        selectedUpgradeID = button.id; // Garder une trace de l'upgrade choisie
        // Activer le bouton "Confirmer" si une upgrade a été choisie
        confirmButton.disabled = false;
        confirmButton.classList.add('active');
    });
});

confirmButton.onclick = function () {
    upgradeButtons.forEach(btn => btn.classList.remove('selected'));
    confirmButton.disabled = true;
    dialogBox.style.display = 'none';
    addUpgrade(currentUpgrades[selectedUpgradeID].buffs); // pour ajouter l'upgrade selectionnée
};


function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    scaleX = canvas.width / 1920;
    scaleY = canvas.height / 1080;
}

function displayUpgrades() {
    hideModals() ;
    upgradesBox.style.display = 'block';
    upgradesText.textContent = "Choisissez vos améliorations !";

    for (let i = 0; i < 3; i++) {
        upgradeButtons[i].textContent = currentUpgrades[randBuffs[i]].description;
        upgradeButtons[i].style.backgroundColor = upgradesTier;
        upgradeButtons[i].id = randBuffs[i];
    }
}

function displayDialog(text) {
    hideModals() ;
    dialogBox.style.display = 'block';
    dialogText.textContent = text;
}

function displayConnecting() {
    hideModals() ;
    connectingBox.style.display = 'block';
}

function displayJoining(text){
    hideModals() ;
    joiningText.textContent = text ;
    roomCodeInput.value = "";
    joinModal.style.display = "block";
}

function displayGameOver(){
    console.log("game over :D") ;
    hideModals() ;
    gameOverScreen.style.display = "block";
}

function hideModals(){
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function restartGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


function gameLoop() {
    if (!paused) {
        // Initialiser le contexte du canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const playerId in players) {
            const player = players[playerId];
                if (playerId == player1Id && player.isDead) {
                    continue;
                }
                if (playerId == player1Id && 
                    player.health <= 0 &&
                    players[player2Id].health > 0) {
                    player.isDead = true ;
                    displayDialog('you died TT') ;
                }
            player.draw(ctx);
            player.drawProjectiles(ctx);
            player.drawSpecialProjectiles(ctx);
            
        }
        const player = players[player1Id] ;
        player.drawPlayerHealth(ctx, canvas);
        player.drawChargeBar(ctx, canvas);
        // Mettre à jour et dessiner le boss 
        if (boss) {
            boss.drawHealthBar();
            boss.drawTelegraphedZones(ctx);
            boss.drawBossBullets(ctx);
            boss.drawBoss(ctx);
            boss.animate();
        }

    };

    requestAnimationFrame(gameLoop);
}


