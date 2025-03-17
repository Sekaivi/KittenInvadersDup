const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let scaleX = canvas.width / 1920;  // resolution de reference 1920 * 1080
let scaleY = canvas.height / 1080;
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const keys = {};
window.addEventListener("keydown", (e) => handleKeyChange(e.key, true));
window.addEventListener("keyup", (e) => handleKeyChange(e.key, false));

// à ajuster
const dialogBox = document.getElementById('BossDefeatDialog');
const dialogText = document.getElementById("dialogText");
const confirmButton = document.getElementById('confirmButton');
confirmButton.onclick = function () {
    upgradeButtons.forEach(btn => btn.classList.remove('selected'));
    confirmButton.disabled = true;
    dialogBox.style.display = 'none';
    addUpgrade(currentUpgradesTier[selectedUpgradeID].buffs); // pour ajouter l'upgrade selectionnée
    togglePause(); // on reprend le jeu
};

let paused = false;
let currentUpgradesTier;
let selectedUpgradeID;

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

const upgrades = { // ameliorations possible dans le jeu
    gris: [
        { description: "+10% atk, +10% atk speed", buffs: { atk: 1.1, atkSpeed: 1.1 } },
        { description: "+15% atk speed", buffs: { atkSpeed: 1.15 } },
        { description: "Tous les troisièmes coups infligent +60% dmg", buffs: { thirdHitBonus: 1.6 } },
        { description: "+33% atk quand les pv sont au max", buffs: { FullHPDmg: 1.33 } },
        { description: "+50% atk quand à 1 pv", buffs: { lowHPDmg: 1.5 } },
        { description: "Quand vous prenez des dégâts, tous les projectiles à l’écran sont détruits", buffs: { destroyAllBullets: true } },
        { description: "+33% atk spéciale dmg", buffs: { specialDmg: 1.33 } },
        { description: "+15% atk spéciale dmg et +15% atk", buffs: { atk: 1.1, specialDmg: 1.33 } },
    ],
    bleu: [ // à corriger !!
        { description: "L’attaque spéciale se charge 33% plus vite", buffs: { specialChargeSpeed: 1.33 } },
        { description: "Tous les 200 tirs, le joueur gagne un shield qui le protège des dégâts une fois", buffs: { shieldEveryXTirs: 200 } },
        { description: "+33% atk tant que le joueur est immobile", buffs: { atkWhenImmobile: 1.33 } },
        { description: "+33% atk tant que vous êtes proche de votre allié", buffs: { atkNearAlly: 1.33 } },
        { description: "+10% atk speed, +10% atk. Ce buff s’applique également aux alliés proches", buffs: { atkSpeed: 1.1, atk: 1.1, buffAllies: true } },
        { description: "Une fois par combat, vous pouvez réanimer ou être réanimé instantanément", buffs: { reviveOncePerFight: true } },
        { description: "Permet de choisir instantanément entre 3 upgrades gris", buffs: { chooseFromThreeGris: true } },
        { description: "Tous les cinquièmes coups infligent +250% dmg", buffs: { bonusOnFifthHit: 2.5 } }
    ],
    or: [
    ],
    rouge: [
    ]
};

function displayUpgrades() {
    let color;
    let randBuffs = new Set(); // on utilise Set() pour éviterd des duplicata
    while (randBuffs.size < 3) {
        let rand = Math.floor(Math.random() * 8);
        randBuffs.add(rand);
    }
    randBuffs = [...randBuffs];

    for (let i = 0; i < 3; i++) {

        currentUpgradesTier = upgrades.gris;
        color = 'gray';
        upgradeButtons[i].textContent = currentUpgradesTier[randBuffs[i]].description;
        upgradeButtons[i].style.backgroundColor = color;
        upgradeButtons[i].id = randBuffs[i];
    }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    scaleX = canvas.width / 1920;
    scaleY = canvas.height / 1080;
}


function showDialog(text) {
    displayUpgrades();
    dialogBox.style.display = 'block';
    dialogText.textContent = text;
}



function restartGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    togglePause();
    currentBossIndex = 0;
    player = null;
    player = new Player(canvas.width / 2, canvas.height / 2, "media/player.png");
    const dialogs = document.querySelectorAll('.modal');
    dialogs.forEach(dialog => {
        dialog.style.display = 'none';
    });
    showDialog('Choisissez une amélioration !');
}

function togglePause() {
    paused = !paused;
    // Optionally show a pause screen or overlay
    if (paused) {
        console.log('pause');
    } else {
        console.log('not paused');
    }
}

function initGame() { // le serveur lui dit quand lancer ça
    // showDialog("initalizing the game");
    gameLoop();
}
// fin des trucs à gerer dans le serveur



function addUpgrade(buffs) {
    for (buff in buffs) {
        switch (typeof buffs[buff]) {
            case 'number':
                player[buff] *= buffs[buff];
                console.log(buff + ' is now = ' + player[buff]);
                break;
            case 'boolean':
                player[buff] = buffs[buff];
                console.log(buff + 'is now ' + player[buff]);
            default:
                console.log('erreur au niveau des upgrades');
        }

    }
}


function gameLoop() {
    if (!paused) {
        // Initialiser le contexte du canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const playerId in players) {
            const player = players[playerId];
            // dessiner le tout
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


