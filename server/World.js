const PlayerServ = require('./PlayerServ');
const BossServ = require('./BossServ.js')



class World {
    constructor(io) {
        // resolution de reference
        this.WIDTH = 1920;
        this.HEIGHT = 1080;
        this.io = io;
        this.players = {};
        this.bosses = [
            {
                spritesheet: 'media/Necro.png', totalFrames: 8, width: 1960, height: 245, health: 10, patterns: ['boss1', 'boss1p2'],
                bulletImagePath: "media/boss2_bullet.png", name: 'Necromancer', healthchange: 250
            },
            {
                spritesheet: 'media/Demon.png', totalFrames: 6, width: 1629, height: 278, health: 10, patterns: ['boss2', 'boss2p2'],
                bulletImagePath: "media/boss3_bullet.png", name: 'Hell Guardian', healthchange: 500
            },
            {
                spritesheet: 'media/Agis.png', totalFrames: 15, width: 3360, height: 240, health: 10, patterns: ['boss2', 'boss2p2'],
                bulletImagePath: "media/boss_bullet.png", name: 'Void Entity', healthchange: 1000
            },
            {
                spritesheet: 'media/Death.png', totalFrames: 8, width: 2052, height: 248, health: 10, patterns: ['boss2', 'boss2p2'],
                bulletImagePath: "media/boss4_bullet.png", name: 'Death', healthchange: 1000
            }
        ];
<<<<<<< HEAD
        this.playerUpgrades = { // ameliorations possible dans le jeu
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
                { description: "L’attaque spéciale se charge 33% plus vite", buffs: { specialChargeSpeed: 1.33 } },
                { description: "Tous les 200 tirs, le joueur gagne un shield qui le protège des dégâts une fois", buffs: { shieldEveryXTirs: 200 } },
                { description: "+33% atk tant que le joueur est immobile", buffs: { atkWhenImmobile: 1.33 } },
                { description: "+33% atk tant que vous êtes proche de votre allié", buffs: { atkNearAlly: 1.33 } },
                { description: "+10% atk speed, +10% atk. Ce buff s’applique également aux alliés proches", buffs: { atkSpeed: 1.1, atk: 1.1, buffAllies: true } },
                { description: "Une fois par combat, vous pouvez réanimer ou être réanimé instantanément", buffs: { reviveOncePerFight: true } },
                { description: "Permet de choisir instantanément entre 3 upgrades gris", buffs: { chooseFromThreeGris: true } },
                { description: "Tous les cinquièmes coups infligent +250% dmg", buffs: { bonusOnFifthHit: 2.5 } }
            ],
            rouge: [
                { description: "L’attaque spéciale se charge 33% plus vite", buffs: { specialChargeSpeed: 1.33 } },
                { description: "Tous les 200 tirs, le joueur gagne un shield qui le protège des dégâts une fois", buffs: { shieldEveryXTirs: 200 } },
                { description: "+33% atk tant que le joueur est immobile", buffs: { atkWhenImmobile: 1.33 } },
                { description: "+33% atk tant que vous êtes proche de votre allié", buffs: { atkNearAlly: 1.33 } },
                { description: "+10% atk speed, +10% atk. Ce buff s’applique également aux alliés proches", buffs: { atkSpeed: 1.1, atk: 1.1, buffAllies: true } },
                { description: "Une fois par combat, vous pouvez réanimer ou être réanimé instantanément", buffs: { reviveOncePerFight: true } },
                { description: "Permet de choisir instantanément entre 3 upgrades gris", buffs: { chooseFromThreeGris: true } },
                { description: "Tous les cinquièmes coups infligent +250% dmg", buffs: { bonusOnFifthHit: 2.5 } }
            ]
        };
        this.upgradesChosen = {};
=======
>>>>>>> 3a832835646b665a2511d5ca2b97f4963570259e
        this.boss = null;
        this.currentBossIndex = 0;
        this.canvasWidth = null;
        this.canvasHeight = null;
<<<<<<< HEAD
        this.paused = true;
=======
>>>>>>> 3a832835646b665a2511d5ca2b97f4963570259e
    }

    addPlayer(playerId) {
        this.players[playerId] = new PlayerServ(playerId, this.WIDTH, this.HEIGHT);
    }

    removePlayer(playerId) {
        delete this.players[playerId];
    }

    updatePlayerKeys(playerId, keys) {
        let player = this.players[playerId];
        player.keys = keys;
    }

<<<<<<< HEAD
    updatePlayerUpgrades(playerId, buffs) {
        let player = this.players[playerId];
        if (this.upgradesChosen[playerId]) {
            console.log("This player already chose his upgrades");
            return;
        } else {
            for (let buff in buffs) {
                switch (typeof buffs[buff]) {
                    case 'number':
                        player[buff] *= buffs[buff];
                        console.log(buff + ' is now = ' + player[buff]);
                        break;
                    case 'boolean':
                        player[buff] = buffs[buff];
                        console.log(buff + 'is now ' + player[buff]);
                        break;
                    default:
                        console.log('erreur au niveau des upgrades');
                }
            }
            this.upgradesChosen[playerId] = true;
        }
    }

=======
>>>>>>> 3a832835646b665a2511d5ca2b97f4963570259e
    killPlayer(playerId) {
        let player = this.players[playerId];
        if (player) {
            player.isDead = true;
            this.io.emit('playerDeath', playerId); // Notify the client
        }
    }

    loadBoss() {
<<<<<<< HEAD
        this.togglePause();
=======
>>>>>>> 3a832835646b665a2511d5ca2b97f4963570259e
        const bossData = this.bosses[this.currentBossIndex];
        if (bossData) {
            this.boss = new BossServ(bossData.health,
                bossData.patterns, bossData.name, bossData.healthchange, bossData.width, bossData.height, bossData.totalFrames,
                this.WIDTH, this.HEIGHT
            );
            // le reste des infos du tableau non utilisé sur le serveur vont vers le client
            this.io.emit('loadBoss', bossData);
            this.currentBossIndex++;
<<<<<<< HEAD
=======
            console.log(this.currentBossIndex);
>>>>>>> 3a832835646b665a2511d5ca2b97f4963570259e
        } else {
            console.log('no boss left to fight') // afficher ecran de victoire coté client
            this.io.emit('victory');
        }

    }

    gameStart() {
<<<<<<< HEAD
        this.gameInterval = setInterval(() => this.updateGame(), 1000 / 120); // ajuster ici la vitesse de jeu
    }

    trackGameOver(){
        let allPlayersDead = true;
            for (let playerId in this.players) {
                const player = this.players[playerId];
                if (!player.isDead) {
                    allPlayersDead = false;
                }
            }
            if (allPlayersDead) {
                this.io.emit("gameOver");
                this.togglePause();
            }
        return allPlayersDead ;
    }

    togglePause() {
        if (this.paused) {
            this.paused = false;
        } else {
            this.paused = true;
            console.log('game is paused');
        }
    }

    updateGame() {
        if (this.paused) {
            return;
        }

        const playersDead = this.trackGameOver() ;
        if(playersDead){
            return ;
        }

        if(this.boss){
            if (this.boss.health == 0) {
                this.upgradesChosen = {};
                const upgradesData = this.getUpgradesData();
                this.io.emit('chooseUpgrades', upgradesData); // je peux egalement dire ici au joueur qu'il doit reinitialiser le canvas
                this.togglePause();
                return;
            }
            // le boss
            this.boss.patterns();
            this.boss.updateBossBullets(this.players);
            // concernant les joueurs
            const newPlayerData = {};
            for (let playerId in this.players) {
            // faire un truc si les DEUX JOUEURS sont morts
                const player = this.players[playerId];
                if (player.isDead) {
                    continue;
                }
                if (player.health <= 0) {
                    this.killPlayer(playerId);
                }
                player.move();
                player.shoot();
                player.activateSpecial();
                player.updateProjectiles();
                player.updateSpecialProjectiles();
                player.checkSpecialCollisions(this.boss.bullets);
                player.checkCollisions(this.boss);
                player.checkSpecialCollisionsWithBoss(this.boss);
                player.calcDmgMultiplyer();
                newPlayerData[playerId] = {
                    x: player.x,
                    y: player.y,
                    projectiles: player.projectiles,
                    angle: player.angle,
                    maxHp: player.maxHp,
                    health: player.health,
                    isOverheated: player.isOverheated,
                    messageTime: player.messageTime,
                    overheatMessage: player.overheatMessage,
                    isSpecialActive: player.isSpecialActive,
                    specialCharge: player.specialCharge,
                    specialMaxCharge: player.specialMaxCharge,
                    specialProjectiles: player.specialProjectiles
                }
            }
    
            const newBossData = {
                health: this.boss.health,
                positionh: this.boss.positionh,
                positionv: this.boss.positionv,
                bullets: this.boss.bullets,
                telegraphedZones: this.boss.telegraphedZones
            }
    
            // l'état des joueurs (morts ou en vie ?)
            this.io.emit('updateGame', { newBossData, newPlayerData });
        }
    }

    getUpgradesData() {
        const currentTier = Object.keys(this.playerUpgrades)[this.currentBossIndex];
        const currentUpgrades = this.playerUpgrades[currentTier];

        let upgradesByPlayer = {};

        Object.keys(this.players).forEach(playerId => {
            let randBuffs = new Set();
            while (randBuffs.size < 3) {
                let rand = Math.floor(Math.random() * 8);
                randBuffs.add(rand);
            }
            upgradesByPlayer[playerId] = [...randBuffs];
        });

        const upgradesData = {
            tier: currentTier,
            upgrades: currentUpgrades,
            upgradesByPlayer
        }
        return upgradesData;
=======
        console.log('Starting game');
        this.loadBoss();
        this.gameInterval = setInterval(() => this.updateGame(), 1000 / 60); // ajuster ici la vitesse de jeu
    }

    updateGame() {
        if (this.boss.health == 0) {
            this.loadBoss();
            return;
        }
        // le boss
        this.boss.patterns();
        // concernant les joueurs
        const newPlayerData = {};
        for (let playerId in this.players) {
            const player = this.players[playerId];
            if (player.isDead) {
                console.log('player is dead') ;
                // continue; 
            }
            if (player.health <= 0) {
                console.log('killing player') ;
                /* this.killPlayer(playerId);
                continue; */
            }
            this.boss.updateBossBullets(player);
            player.move();
            player.shoot();
            player.activateSpecial();
            player.updateProjectiles();
            player.updateSpecialProjectiles();
            player.checkSpecialCollisions(this.boss.bullets);
            player.checkCollisions(this.boss);
            player.checkSpecialCollisionsWithBoss(this.boss);
            player.calcDmgMultiplyer();
        }

        const newBossData = {
            health: this.boss.health,
            positionh: this.boss.positionh,
            positionv: this.boss.positionv,
            bullets: this.boss.bullets,
            telegraphedZones: this.boss.telegraphedZones
        }

        // l'état des joueurs (morts ou en vie ?)
        this.io.emit('updateGame', { newBossData, newPlayerData });
>>>>>>> 3a832835646b665a2511d5ca2b97f4963570259e
    }

}

module.exports = World;