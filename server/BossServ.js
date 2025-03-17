class BossServ {
    constructor(health, attackPatterns, name, healthchange , width , height , totalFrames , canvasWidth , canvasHeight) {
        this.canvaswidth = canvasWidth ;
        this.canvasHeight = canvasHeight ;
        this.name = name;
        this.health = health;
        this.maxHealth = health;
        this.attackPatterns = attackPatterns;
        this.positionh = 0;
        this.positionv = 0;
        this.goesright = true;
        this.goesbottom = true;
        this.attackPattern = 0;
        this.healthchange = healthchange;
        this.rorl = Math.random();
        this.width = width / totalFrames; // À calculer
        this.height = height; // À calculer
        this.bullets = []; // Projectiles du boss
        this.telegraphedZones = [];
    }

    // Méthode pour choisir le pattern d'attaque en fonction de l'index
    patterns() {
        // Récupère le pattern actuel à partir de attackPatterns
        const currentPattern = this.attackPatterns[this.attackPattern];

        switch (currentPattern) {
            case 'boss1':
                this.Boss1P1();
                break;

            case 'boss1p2':
                this.Boss1P2();
                break;

            case 'boss2':
                this.Boss2P1();
                break;

            case 'boss2p2':
                this.Boss2P2();
                break;
            case 'boss3':
                this.Boss3P1();
                break;

            case 'boss3p2':
                this.Boss3P2();
                break;

            default:
                console.log("Pattern d'attaque inconnu. ");
        }

        // Conditions pour changer de pattern en fonction de la santé ou autres critères
        if (this.health <= this.healthchange && this.attackPattern === 0) {
            console.log("Changement de pattern");
            this.attackPattern = 1;
        }
    }


    Boss1P1() {
        // Déplacement horizontal
        if (this.positionh >= 1000) {
            this.goesright = false;
        }
        if (this.positionh <= 5) {
            this.goesright = true;
        }

        if (this.goesright) {
            this.positionh += 2;
        } else {
            this.positionh -= 2;
        }

        // Tirer selon une probabilité (croix ou spirale)
        if (Math.random() < 0.085) {
            if (Math.random() < 0.3) {
                this.shootCrossPattern(3, 32);
            } else {
                this.shootSpiralPattern(4, 64);
            }
        }
    }

    Boss1P2() {
        // Déplacement horizontal aléatoire
        if (this.rorl < 0.5) {
            if (this.positionh >= 5) {
                this.positionh -= 2;
            }
        } else {
            if (this.positionh <= 1050) {
                this.positionh += 2;
            }
        }

        // Déplacement vertical
        if (this.goesbottom) {
            this.positionv += 2;
            if (this.positionv >= 550) {
                this.goesbottom = false;
            }
        } else {
            this.positionv -= 2;
            if (this.positionv <= 10) {
                this.goesbottom = true;
            }
        }

        // Tirer selon une probabilité (spirale ou boucle)
        if (Math.random() < 0.085) {
            if (Math.random() < 0.3) {
                this.shootSpinPattern(5, 32);
            } else if (Math.random() < 0.5) {
                this.shootNoosePattern(3, 64);
            } else {
                this.shootSpiralPattern(4, 64);
            }

        }
    }


    Boss2P1() {
        // Déplacement horizontal
        if (this.positionh >= 1000) {
            this.goesright = false;
        }
        if (this.positionh <= 5) {
            this.goesright = true;
        }

        if (this.goesright) {
            this.positionh += 2;
        } else {
            this.positionh -= 2;
        }

        // Tirer selon une probabilité (croix ou spirale)
        if (Math.random() < 0.085) {
            if (Math.random() < 0.4) {
                this.shootSpinPattern(5, 32);
            } else if (Math.random() < 0.8) {
                this.shootCrossPattern(4, 64);
            } else {
                this.shootNoosePattern(3, 64);
            }

        }
    }

    Boss2P2() {
        // Déplacement horizontal aléatoire
        if (this.rorl < 0.5) {
            if (this.positionh >= 5) {
                this.positionh -= 2;
            }
        } else {
            if (this.positionh <= 1050) {
                this.positionh += 2;
            }
        }

        // Déplacement vertical
        if (this.goesbottom) {
            this.positionv += 2;
            if (this.positionv >= 550) {
                this.goesbottom = false;
            }
        } else {
            this.positionv -= 2;
            if (this.positionv <= 10) {
                this.goesbottom = true;
            }
        }

        // Tirer selon une probabilité (spirale ou boucle)
        if (Math.random() < 0.085) {
            if (Math.random() < 0.2) {
                this.shootRainPattern(5, 32);
            } else if (Math.random() < 0.6) {
                this.shootCrossPattern(4, 64);
            } else {
                this.shootSpiralPattern(4, 64);
            }

        }
    }

    Boss3P1() {
        // Déplacement horizontal
        if (this.positionh >= 1000) {
            this.goesright = false;
        }
        if (this.positionh <= 5) {
            this.goesright = true;
        }

        if (this.goesright) {
            this.positionh += 2;
        } else {
            this.positionh -= 2;
        }

        // Tirer selon une probabilité (croix ou spirale)
        if (Math.random() < 0.085) {
            if (Math.random() < 0.3) {
                this.shootExplodePattern(5, 32);
            } else if (Math.random() < 0.6) {
                this.shootCrossPattern(4, 64);
            } else {
                this.shootSpiralPattern(4, 64);
            }

        }
    }

    Boss3P2() {
        // Déplacement horizontal aléatoire
        if (this.rorl < 0.5) {
            if (this.positionh >= 5) {
                this.positionh -= 2;
            }
        } else {
            if (this.positionh <= 1050) {
                this.positionh += 2;
            }
        }

        // Déplacement vertical
        if (this.goesbottom) {
            this.positionv += 2;
            if (this.positionv >= 550) {
                this.goesbottom = false;
            }
        } else {
            this.positionv -= 2;
            if (this.positionv <= 10) {
                this.goesbottom = true;
            }
        }

        // Tirer selon une probabilité (spirale ou boucle)
        if (Math.random() < 0.085) {
            if (Math.random() < 0.1) {
                this.shootRainPattern(5, 32);
            } else if (Math.random() < 0.2) {
                this.shootExplodePattern(4, 64);
            } else if (Math.random() < 0.5) {
                this.shootCrossPattern(4, 64);
            }
            else {
                this.shootNoosePattern(3, 50);
            }

        }
    }


    // Méthodes de tir des différents patterns
    shootCrossPattern(speed, size) {
        const bulletSpeed = speed;
        const bulletSize = size;
        this.bullets.push({ x: this.positionh + this.width / 2, y: this.positionv + this.height / 2, dx: 0, dy: -bulletSpeed, size: bulletSize });
        this.bullets.push({ x: this.positionh + this.width / 2, y: this.positionv + this.height / 2, dx: 0, dy: bulletSpeed, size: bulletSize });
        this.bullets.push({ x: this.positionh + this.width / 2, y: this.positionv + this.height / 2, dx: -bulletSpeed, dy: 0, size: bulletSize });
        this.bullets.push({ x: this.positionh + this.width / 2, y: this.positionv + this.height / 2, dx: bulletSpeed, dy: 0, size: bulletSize });
    }

    shootSpiralPattern(speed, size) {
        const bulletSpeed = speed;
        const bulletSize = size;
        const angleIncrement = (2 * Math.PI) / 8;

        for (let i = 0; i < 8; i++) {
            const angle = i * angleIncrement;
            const dx = Math.cos(angle) * bulletSpeed;
            const dy = Math.sin(angle) * bulletSpeed;
            this.bullets.push({ x: this.positionh + this.width / 2, y: this.positionv + this.height / 2, dx: dx, dy: dy, size: bulletSize });
        }
    }

    shootNoosePattern(speed, size) {
        const bulletSpeed = speed;
        const bulletSize = size;
        const centerX = this.positionh + this.width / 2;
        const centerY = this.positionv + this.height / 2;

        for (let i = 0; i < 10; i++) {
            const angle = (i / 10) * Math.PI * 2;
            const radius = 50;
            const offsetX = Math.cos(angle) * radius;
            const offsetY = Math.sin(angle) * radius;

            this.bullets.push({
                x: centerX + offsetX,
                y: centerY + offsetY,
                dx: Math.cos(angle) * bulletSpeed,
                dy: Math.sin(angle) * bulletSpeed,
                size: bulletSize
            });
        }

        for (let i = 0; i < 5; i++) {
            this.bullets.push({
                x: centerX,
                y: centerY + 50 + i * 20,
                dx: 0,
                dy: bulletSpeed,
                size: bulletSize
            });
        }
    }

    shootSpinPattern() {
        const bulletSpeed = 4;
        const bulletSize = 16;
        const spacing = 30; // Distance entre chaque projectile dans une ligne

        if (!this.crossAngle) this.crossAngle = 0;

        const numBulletsPerLine = 6; // Longueur de chaque bras de la croix

        for (let i = 0; i < 4; i++) {
            // Angle pour chaque bras de la croix (90° entre chaque)
            const angle = this.crossAngle + (i * Math.PI / 2);

            for (let j = 1; j <= numBulletsPerLine; j++) {
                // Positionner les projectiles progressivement le long du bras
                const xOffset = Math.cos(angle) * spacing * j;
                const yOffset = Math.sin(angle) * spacing * j;

                this.bullets.push({
                    x: this.positionh + this.width / 2 + xOffset,
                    y: this.positionv + this.height / 2 + yOffset,
                    dx: Math.cos(angle) * bulletSpeed,
                    dy: Math.sin(angle) * bulletSpeed,
                    size: bulletSize
                });
            }
        }

        // Faire tourner lentement la croix
        this.crossAngle += Math.PI / 30;
    }

    shootRainPattern() {
        const telegraphDuration = 1000; // Temps avant la pluie (1 seconde)
        const numWaves = 3; // Nombre de vagues de pluie
        const minWaveInterval = 50; // Temps minimum entre vagues (ms)
        const maxWaveInterval = 300; // Temps maximum entre vagues (ms)
        const rainWidth = 200; // Largeur de la zone télégraphiée
        const rainHeight = 50; // Hauteur de la pluie
        const bulletSpeed = 6; // Vitesse de chute
        const bulletSize = 16;
        const numProjectiles = 12; // Nombre de projectiles par vague

        // Déterminer une position aléatoire pour la pluie
        const targetX = Math.random() * (this.canvaswidth - rainWidth);
        const targetY = Math.random() * (this.canvasHeight / 2);

        // Stocker la zone télégraphiée avec un délai d'expiration
        const expirationTime = Date.now() + telegraphDuration + (numWaves * (minWaveInterval + Math.random() * (maxWaveInterval - minWaveInterval)));

        this.telegraphedZones.push({ x: targetX, y: targetY, width: rainWidth, height: rainHeight, expirationTime });

        // Lancer la pluie après le délai
        setTimeout(() => {
            // Supprimer la zone télégraphiée après la pluie
            this.telegraphedZones = this.telegraphedZones.filter(zone => zone.x !== targetX);

            const launchWave = (wave = 0) => {
                if (wave >= numWaves) return; // Stopper après le bon nombre de vagues

                for (let i = 0; i < numProjectiles; i++) {
                    const offsetX = Math.random() * rainWidth; // Dispersion horizontale aléatoire
                    const angle = Math.PI / 2 + (Math.random() * 0.3 - 0.15); // Angle légèrement dévié

                    this.bullets.push({
                        x: targetX + offsetX,
                        y: targetY - 50, // Spawn légèrement au-dessus
                        dx: Math.cos(angle) * bulletSpeed,
                        dy: Math.sin(angle) * bulletSpeed,
                        size: bulletSize
                    });
                }

                // Planifier la vague suivante avec un délai aléatoire
                setTimeout(() => launchWave(wave + 1), minWaveInterval + Math.random() * (maxWaveInterval - minWaveInterval));
            };

            launchWave(); // Lancer la première vague
        }, telegraphDuration);
    }


    shootExplodePattern() {
        const bulletSize = 100; // Taille du projectile principal
        const bulletSpeed = 2; // Vitesse du projectile principal
        const explosionDelay = 2000; // Temps avant explosion (ms)
        const numFragments = 8; // Nombre de projectiles secondaires
        const fragmentSpeed = 5; // Vitesse des fragments
        const fragmentSize = 20; // Taille des fragments


        // Position de départ (centre du boss)
        const startX = this.positionh + this.width / 2;
        const startY = this.positionv + this.height / 2;

        // Déterminer un angle aléatoire pour le tir
        const angle = Math.random() * Math.PI * 2;

        // Création du projectile principal
        const explosiveBullet = {
            x: startX,
            y: startY,
            dx: Math.cos(angle) * bulletSpeed,
            dy: Math.sin(angle) * bulletSpeed,
            size: bulletSize,
            explode: false, // Indique si le projectile doit exploser
            createdAt: performance.now(), // Temps de création pour gérer le délai d'explosion
            isExplosive: true // Flag pour identifier que c'est un projectile explosif
        };

        this.bullets.push(explosiveBullet);
    }

    shootLinePattern(ctx) {
        if (!ctx) {
            console.error("ctx is not defined");
            return;
        }

        const bulletSpeed = 5;
        const bulletSize = 16;
        const length = 600;
        const lineAngle = Math.random() * Math.PI * 2;
        const startX = this.positionh + this.width / 2;
        const startY = this.positionv + this.height / 2;

        // Ajouter la zone télégraphée avec une expiration de 2000ms (2 secondes)
        this.telegraphedZones.push({
            x: startX,
            y: startY,
            width: length,
            height: 5, // Une petite hauteur pour simuler une ligne
            angle: lineAngle, // L'angle de la ligne
            expirationTime: Date.now() + 2000 // Moment où la zone doit disparaître
        });

        // Attendre un peu avant de tirer les projectiles
        setTimeout(() => {
            for (let i = 0; i < length; i += bulletSize) {
                const xOffset = Math.cos(lineAngle) * i;
                const yOffset = Math.sin(lineAngle) * i;

                this.bullets.push({
                    x: startX + xOffset,
                    y: startY + yOffset,
                    dx: Math.cos(lineAngle) * bulletSpeed,
                    dy: Math.sin(lineAngle) * bulletSpeed,
                    size: bulletSize
                });
            }
        }, 2000);
    }


    updateBossBullets(player) {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.x += bullet.dx;
            bullet.y += bullet.dy;

            // Retirer les projectiles qui sortent de l'écran
            if (bullet.y > this.canvasHeight || bullet.y < 0 || bullet.x < 0 || bullet.x > this.canvasWidth) {
                this.bullets.splice(i, 1);
            }

            // Détection de collision avec le joueur
            if (
                bullet.x > player.x - player.size / 2 &&
                bullet.x < player.x + player.size / 2 &&
                bullet.y > player.y - player.size / 2 &&
                bullet.y < player.y + player.size / 2
            ) {
                console.log("A player has taken some damage") ;
                player.takeDamage(1)
                if (player.destroyAllBullets) {
                    this.bullets = [];
                    break; // sinon y a des erreurs
                } else {
                    this.bullets.splice(i, 1); // si on ne veut enlever qu'un seul projectile   
                }
            }
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            console.log('Boss is dead') ; // puis dire au client d'appeler la fonction "defeated"
        }
    }

}

module.exports = BossServ;