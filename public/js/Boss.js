class Boss {
    constructor(spritesheeturl, totalFrames, health, attackPatterns, bulletImagePath , name) {
        this.name = name ;
        this.spritesheet = new Image();
        this.spritesheet.src = spritesheeturl;
        this.health = health;
        this.maxHealth = health;
        this.attackPatterns = attackPatterns;
        this.currentFrame = 0;
        this.positionh = 0;
        this.positionv = 0;
        this.goesright = true;
        this.goesbottom = true;
        this.attackPattern = 0;
        this.rorl = Math.random();
        this.width = 0; // À calculer
        this.height = 0; // À calculer
        this.bossBulletImage = new Image();
        this.bossBulletImage.src = bulletImagePath;
        this.bullets = []; // Projectiles du boss
        this.totalFrames = totalFrames;
        this.spritesheet.onload = () => {
            this.width = this.spritesheet.width / totalFrames; // Calcul de la largeur d'une frame
            this.height = this.spritesheet.height; // Prend la hauteur totale de l'image
        };

    }

    // Méthode pour choisir le pattern d'attaque en fonction de l'index
    patterns() {
        // Récupère le pattern actuel à partir de attackPatterns
        const currentPattern = this.attackPatterns[this.attackPattern];
    
        switch (currentPattern) {
            case 'horizontal':
                this.handleHorizontalMovementAndShooting();
                console.log('horizontal') ;
                break;
    
            case 'vertical':
                this.handleVerticalMovementAndShooting();
                console.log('vertical') ;
                break;
    
            default:
                console.log("Pattern d'attaque inconnu. ");
        }
    
        // Conditions pour changer de pattern en fonction de la santé ou autres critères
        if (this.health <= 250 && this.attackPattern === 0) {
            this.attackPattern = 1;  // Change le pattern quand la santé est inférieure à 250
        }
    }
    
    handleHorizontalMovementAndShooting() {
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
            if (Math.random() < 0.5) {
                this.shootCrossPattern();
            } else {
                this.shootSpiralPattern();
            }
        }
    }
    
    handleVerticalMovementAndShooting() {
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
        if (Math.random() < 0.1) {
            if (Math.random() < 0.5) {
                this.shootSpiralPattern();
            } else {
                this.shootNoosePattern();
            }
        }
    }

    // Méthodes de tir des différents patterns
    shootCrossPattern() {
        const bulletSpeed = 5;
        const bulletSize = 64;
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

    shootNoosePattern() {
        const bulletSpeed = 5;
        const bulletSize = 64;
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


    updateBossBullets(canvas) {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.x += bullet.dx;
            bullet.y += bullet.dy;

            // Retirer les projectiles qui sortent de l'écran
            if (bullet.y > canvas.height || bullet.y < 0 || bullet.x < 0 || bullet.x > canvas.width) {
                this.bullets.splice(i, 1);
            }

            // Détection de collision avec le joueur
            if (
                bullet.x > player.x - player.size / 2 &&
                bullet.x < player.x + player.size / 2 &&
                bullet.y > player.y - player.size / 2 &&
                bullet.y < player.y + player.size / 2
            ) {
                player.takeDamage(1)
                if (player.destroyAllBullets){
                    this.bullets = [];
                    break ; // sinon y a des erreurs
                }else{
                    this.bullets.splice(i, 1); // si on ne veut enlever qu'un seul projectile   
                }
            }
        }
    }

    drawBossBullets(ctx) {
        this.bullets.forEach(bullet => {
            ctx.drawImage(
                this.bossBulletImage,
                bullet.x - bullet.size / 2,
                bullet.y - bullet.size / 2,
                bullet.size,
                bullet.size
            );
        });
    }


    drawHealthBar() {
        const barWidth = 300;
        const barHeight = 10;
        const x = canvas.width / 2 - barWidth / 2;
        const y = 35;

        ctx.fillStyle = "white";
        ctx.font = "38px 'Vermin Vibes'";
        ctx.textAlign = "center";
        ctx.fillText(this.name, canvas.width / 2, y - 3);

        ctx.fillStyle = "gray";
        ctx.fillRect(x, y, barWidth, barHeight);

        ctx.fillStyle = "green";
        ctx.fillRect(x, y, (barWidth * this.health) / this.maxHealth, barHeight);

        ctx.fillStyle = "white";
        ctx.font = "12px 'Vermin Vibes'";
        ctx.fillText(`${this.health} / ${this.maxHealth}`, canvas.width / 2, y + barHeight + 5);
    }



    drawBoss(ctx) {
        ctx.drawImage(
            this.spritesheet,
            this.currentFrame * this.width, 0,
            this.width, this.height,
            this.positionh, this.positionv,
            this.width, this.height
        );
    }

    animate() {
        this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0 ;
            this.defeated();
        }
    }


    // Method called when boss is defeated
    defeated() {
        togglePause() ;
        showDialog("EZ TU AS BATTU LE BOSS !");
    }

}
