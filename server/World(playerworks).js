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
        this.boss = null;
        this.currentBossIndex = 0;
        this.canvasWidth = null;
        this.canvasHeight = null;
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

    loadBoss() {
        const bossData = this.bosses[this.currentBossIndex];
        if (bossData) {
            this.boss = new BossServ(bossData.health,
                bossData.patterns, bossData.name, bossData.healthchange, bossData.width, bossData.height, bossData.totalFrames,
                this.WIDTH, this.HEIGHT
            );
            // le reste des infos du tableau non utilisé sur le serveur vont vers le client
            this.io.emit('loadBoss', bossData);
            this.currentBossIndex++;
            console.log(this.currentBossIndex) ;
        }else{
            console.log('no boss left to fight') // afficher ecran de victoire coté client
            this.io.emit('victory');
        }

    }

    gameStart() {
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

module.exports = World;