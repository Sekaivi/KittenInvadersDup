

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
const dialogBox = document.getElementById('BossDefeatDialog');
const dialogText = document.getElementById("dialogText");
const confirmButton = document.getElementById('confirmButton');
confirmButton.onclick = function () {
    upgradeButtons.forEach(btn => btn.classList.remove('selected'));
    confirmButton.disabled = true ;
    dialogBox.style.display = 'none';
    addUpgrade(currentUpgradesTier[selectedUpgradeID].buffs) ; // pour ajouter l'upgrade selectionnée
    togglePause(); // on reprend le jeu
    loadNextBoss(); // chargement du boss
};

let paused = true;
let currentUpgradesTier ;
let selectedUpgradeID ;

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



let boss;
let currentBossIndex = 0;
const bosses = [
    {
        spritesheet: 'media/Agis.png', totalFrames: 15, health: 500, patterns: ['vertical'],
        bulletImagePath: "media/boss_bullet.png", name: 'Soul Hunter'
    },
    {
        spritesheet: 'media/Agis.png', totalFrames: 15, health: 1000, patterns: ['vertical','horizontal'],
        bulletImagePath: "media/boss_bullet.png", name: 'Boss 2'
    },
    { health: 200, name: 'Boss 3' },
    { health: 250, name: 'Final Boss' }
];

// création du joueur
let player = new Player(canvas.width / 2, canvas.height / 2, "media/player.png");

const keys = {};
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

initGame() ;


function displayUpgrades() {
    let color;

    for (let i = 0; i < 3; i++) {
        switch (currentBossIndex) {
            case 0:
                currentUpgradesTier = upgrades.gris;
                color = 'gray';
                break;
            case 1:
                currentUpgradesTier = upgrades.bleu;
                color = 'lightblue';
                break;
            case 2:
                currentUpgradesTier = upgrades.or;
                color = 'yellow';
                break;
            case 3:
                currentUpgradesTier = upgrades.rouge;
                color = 'red';
                break;
            default:
                console.log("Erreur au niveau des upgrades");
        }
        upgradeButtons[i].textContent = currentUpgradesTier[i].description;
        upgradeButtons[i].style.backgroundColor = color;
        upgradeButtons[i].id = i ;
    }
}

function addUpgrade(buffs){
    console.log(buffs) ;
    // reussir à apply les buffs
}


function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}


function showDialog(text) {
    displayUpgrades();
    dialogBox.style.display = 'block';
    dialogText.textContent = text;
}

function loadNextBoss() {
    if (currentBossIndex < bosses.length) {
        const bossData = bosses[currentBossIndex];
        boss = new Boss(bossData.spritesheet, bossData.totalFrames, bossData.health,
            bossData.patterns, bossData.bulletImagePath, bossData.name);
        currentBossIndex++;
        // Initialize boss in the game...
    } else {
        console.log('All bosses defeated! Congratulations!');
        // Handle end of game...
    }
}

function restartGame() {
    currentBossIndex = 0;
    loadNextBoss();
    player = new Player(canvas.width / 2, canvas.height / 2, "media/player.png");
    const dialogs = document.querySelectorAll('.modal');
    dialogs.forEach(dialog => {
        dialog.style.display = 'none';
    })
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

function initGame() {
    showDialog("initalizing the game") ;
    gameLoop();
}

function gameLoop() {
    if (!paused) {
        // Initialiser le contexte du canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Mettre à jour et dessiner le joueur
        player.move(keys, canvas);
        player.shoot(keys);
        player.updateProjectiles(canvas);
        player.activateSpecial(keys);
        player.updateSpecialProjectiles(canvas);
        player.draw(ctx);
        player.drawPlayerHealth(ctx, canvas);
        player.drawProjectiles(ctx);
        player.calcDmgMultiplyer() ;

        // Vérifier les collisions
        player.drawSpecialProjectiles(ctx) ;
        player.checkCollisions(boss); // Collisions des projectiles normaux avec le boss
        player.checkSpecialCollisionsWithBoss(boss); // Collisions des projectiles spéciaux avec le boss
        player.checkSpecialCollisions(boss.bullets); // Collisions des projectiles spéciaux avec les projectiles ennemis

        // Dessiner la jauge de chargement
        player.drawChargeBar(ctx, canvas);

        // Mettre à jour et dessiner le boss
        boss.drawHealthBar();
        boss.patterns();
        boss.updateBossBullets(canvas);
        boss.drawBossBullets(ctx);
        boss.drawBoss(ctx);
        boss.animate();
    };

    requestAnimationFrame(gameLoop);
}


