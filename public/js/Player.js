class Player {
    constructor(x, y, imagePath) {
        this.x = x;
        this.y = y;
        this.speed = 6;
        this.size = 32;
        this.projectiles = [];
        this.atk = 10;
        this.atkSpeed = 10; // Nombre de tirs par seconde
        this.thirdHitBonus = 1 ;
        this.dmgMultiplyer = 1 ;
        this.angle = 0;
        this.maxHp = 5;
        this.health = 5;

        // Gestion de la surcharge du tir
        this.fireRate = 1000 / this.atkSpeed;
        this.lastShot = 0;
        this.shotCount = 0; // Compteur de tirs
        this.shootDuration = 0; // Temps total de tir en continu
        this.overheatLimit = 5000; // 5 secondes max de tir
        this.cooldownTime = 2000; // 2 secondes de cooldown
        this.isOverheated = false;
        this.overheatTime = 0;
        this.overheatMessage = '';  // Message affiché pendant la surcharge ou cooldown
        this.messageTime = 2000;

        // Special ability
        this.specialCharge = 0;
        this.specialMaxCharge = 30;
        this.isSpecialActive = false;
        this.specialProjectiles = [];
        this.specialDmg = 30 ;
        this.specialAtkSpeed = 50;
        this.specialFireRate = 1000 / this.specialAtkSpeed;
        this.lastSpecialShot = 0;
        this.specialMaxProjectiles = 50; // Maximum de projectiles pouvant etre tirés
        this.specialProjectileCount = 0;

        // Image pour le sprite
        this.image = new Image();
        this.image.src = imagePath;

        // Image du projectile
        this.projectileImage = new Image();
        this.projectileImage.src = "media/projectile.png";

        // upgrades possibles
        this.destroyAllBullets = false ; // detruire tous les projectiles du boss si collision
        this.FullHPDmg = 1 ;
        this.lowHPDmg = 1 ; 

    }

    move(keys, canvas) {
        if (keys["z"]) this.y -= this.speed;
        if (keys["s"]) this.y += this.speed;
        if (keys["q"]) this.x -= this.speed;
        if (keys["d"]) this.x += this.speed;

        this.x = Math.max(0, Math.min(canvas.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height, this.y));
    }

    shoot(keys) {
        const directions = {
            ArrowUp: { x: 0, y: -1, angle: 270 },
            ArrowDown: { x: 0, y: 1, angle: 90 },
            ArrowLeft: { x: -1, y: 0, angle: 180 },
            ArrowRight: { x: 1, y: 0, angle: 0 }
        };

        const now = Date.now();
        let direction = null;

        if (keys["ArrowUp"]) direction = "ArrowUp";
        if (keys["ArrowDown"]) direction = "ArrowDown";
        if (keys["ArrowLeft"]) direction = "ArrowLeft";
        if (keys["ArrowRight"]) direction = "ArrowRight";

        // Vérification de l'état de surchauffe et cooldown
        if (this.isOverheated) {
            // Vérifier si le cooldown est terminé
            if (now - this.overheatTime >= this.cooldownTime) {
                this.isOverheated = false;
                this.shootDuration = 0; // Réinitialiser le temps de tir
                this.messageTime = now + 2000; // Afficher "Tir prêt !" pendant 2 secondes
                this.overheatMessage = 'Tir prêt !'; // Afficher "Tir prêt !"
            } else {
                return; // Ne pas tirer pendant le cooldown
            }
        }

        // Si la touche est appuyée et que le tir est possible
        if (direction && now - this.lastShot >= this.fireRate) {
            this.shotCount++; // Incrémentation du compteur de tirs
            let damage = this.atk * this.dmgMultiplyer;
            if (this.shotCount % 3 === 0) {
                damage *= this.thirdHitBonus; //
            }

            this.projectiles.push({
                x: this.x,
                y: this.y,
                dx: directions[direction].x * 6,
                dy: directions[direction].y * 6,
                angle: directions[direction].angle,
                speed: this.atkSpeed / 5,
                size: 16,
                damage: damage
            });

            this.angle = directions[direction].angle;
            this.lastShot = now;
            this.shootDuration += this.fireRate; // Ajouter le temps de tir

            // Vérifier si on atteint la limite de surcharge
            if (this.shootDuration >= this.overheatLimit && !this.isOverheated) {
                this.isOverheated = true;
                this.overheatTime = now; // Démarrer le cooldown
                this.overheatMessage = 'Tir surchargé !'; // Afficher "Tir surchargé"
                this.messageTime = now + 2000; // Maintenir le message affiché pendant 2 secondes
            }
        }
    }



    drawMessages(ctx) {
        if (this.overheatMessage) {
            // Changer la couleur en fonction de l'état de surcharge
            ctx.fillStyle = this.overheatMessage === 'Tir prêt !' ? "green" : "red"; // Vert si "Tir prêt", rouge si surchauffe
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.fillText(this.overheatMessage, this.x, this.y - this.size - 10);
        }

        // Effacer le message après le délai
        if (this.messageTime > 0 && Date.now() >= this.messageTime) {
            this.overheatMessage = ''; // Effacer le message après 2 secondes
        }
    }






    checkSpecialCollisions(bossBullets) {
        this.specialProjectiles.forEach((sp) => {
            bossBullets.forEach((bb, index) => {
                if (
                    sp.x > bb.x - bb.size / 2 &&
                    sp.x < bb.x + bb.size / 2 &&
                    sp.y > bb.y - bb.size / 2 &&
                    sp.y < bb.y + bb.size / 2
                ) {
                    bossBullets.splice(index, 1); // Détruire le projectile du boss
                }
            });
        });
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.angle * Math.PI) / 180);

        ctx.drawImage(
            this.image,
            -this.size / 2,
            -this.size / 2,
            this.size,
            this.size
        );

        ctx.restore();

        // Dessiner les messages
        this.drawMessages(ctx);
    }


    drawProjectiles(ctx) {
        this.projectiles.forEach((p) => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.angle * Math.PI) / 180);

            ctx.drawImage(
                this.projectileImage,
                -p.size / 2,
                -p.size / 2,
                p.size,
                p.size
            );

            ctx.restore();
        });
    }

    activateSpecial(keys) {
        if (keys["e"] && this.specialCharge >= this.specialMaxCharge && !this.isSpecialActive) {
            this.isSpecialActive = true;
            this.specialCharge = 0; // Réinitialiser la charge
            this.specialProjectileCount = 0; // Réinitialiser le compteur de projectiles
        }
    }

    updateSpecialProjectiles(canvas) {
        if (this.isSpecialActive) {
            const now = Date.now();
            if (now - this.lastSpecialShot >= this.specialFireRate && this.specialProjectileCount < 50) {
                // Tirer plusieurs projectiles avec un effet "shotgun"
                const numProjectiles = 3; // Nombre de projectiles par salve
                const spreadAngle = 30; // Angle de dispersion en degrés

                for (let i = 0; i < numProjectiles; i++) {
                    // Calculer un angle aléatoire dans la plage de dispersion
                    const angleOffset = (Math.random() - 0.5) * spreadAngle; // Variation aléatoire
                    const angle = this.angle + angleOffset; // Angle final du projectile

                    // Calculer une vitesse légèrement aléatoire
                    const speedVariation = Math.random() * 0.5 + 0.75; // Entre 75% et 125% de la vitesse de base
                    const speed = 2 * speedVariation;

                    // Ajouter le projectile
                    this.specialProjectiles.push({
                        x: this.x,
                        y: this.y,
                        dx: Math.cos((angle * Math.PI) / 180) * 6,
                        dy: Math.sin((angle * Math.PI) / 180) * 6,
                        angle: angle,
                        speed: speed,
                        size: 16,
                        damage: this.specialDmg * this.dmgMultiplyer
                    });
                }

                this.lastSpecialShot = now;
                this.specialProjectileCount += numProjectiles; // Incrémenter le compteur de projectiles
            }

            // Mettre à jour la position des projectiles
            this.specialProjectiles = this.specialProjectiles.filter((p) => {
                p.x += p.dx * p.speed;
                p.y += p.dy * p.speed;

                return p.x >= 0 && p.x <= canvas.width && p.y >= 0 && p.y <= canvas.height;
            });

            // Arrêter la capacité spéciale après le maximum projectiles
            if (this.specialProjectileCount >= this.specialMaxProjectiles) {
                this.isSpecialActive = false;
                this.specialProjectiles = []; // Vider les projectiles spéciaux
                this.specialProjectileCount = 0; // Réinitialiser le compteur de projectiles
            }
        }
    }

    drawSpecialProjectiles(ctx) {
        this.specialProjectiles.forEach((p) => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.angle * Math.PI) / 180);

            ctx.drawImage(
                this.projectileImage,
                -p.size / 2,
                -p.size / 2,
                p.size,
                p.size
            );

            ctx.restore();
        });
    }

    updateProjectiles(canvas) {
        this.projectiles = this.projectiles.filter((p) => {
            p.x += p.dx * p.speed;
            p.y += p.dy * p.speed;

            return p.x >= 0 && p.x <= canvas.width && p.y >= 0 && p.y <= canvas.height;
        });
    }

    checkCollisions(boss) {
        this.projectiles.forEach((p) => {
            if (
                p.x > boss.positionh &&
                p.x < boss.positionh + boss.width &&
                p.y > boss.positionv &&
                p.y < boss.positionv + boss.height
            ) {
                boss.takeDamage(p.damage); // Infliger des dégâts au boss
                this.projectiles = this.projectiles.filter((proj) => proj !== p); // Supprimer le projectile normal

                // Augmenter la charge de la capacité spéciale (uniquement pour les projectiles normaux)
                if (!this.isSpecialActive) {
                    this.specialCharge += 1;
                    if (this.specialCharge >= this.specialMaxCharge) {
                        this.specialCharge = this.specialMaxCharge;
                    }
                }
            }
        });
    }

    drawChargeBar(ctx, canvas) {
        const barWidth = 200; // Largeur de la barre
        const barHeight = 20; // Hauteur de la barre
        const barX = (canvas.width - barWidth) / 2; // Centrer la barre horizontalement
        const barY = canvas.height - 40; // Position verticale de la barre

        // Dessiner le fond de la barre
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Dessiner la barre de chargement
        const chargeWidth = (this.specialCharge / this.specialMaxCharge) * barWidth;
        ctx.fillStyle = this.specialCharge >= this.specialMaxCharge ? "green" : "blue"; // Changer la couleur si la capacité est prête
        ctx.fillRect(barX, barY, chargeWidth, barHeight);

        // Dessiner le contour de la barre
        ctx.strokeStyle = "white";
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        // Ajouter un texte pour indiquer l'état de la capacité
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
            this.specialCharge >= this.specialMaxCharge ? "Capacité prête (Appuyez sur E)" : "Chargement...",
            canvas.width / 2,
            barY - 10
        );
    }

    checkSpecialCollisionsWithBoss(boss) {
        this.specialProjectiles.forEach((sp) => {
            if (
                sp.x > boss.positionh &&
                sp.x < boss.positionh + boss.width &&
                sp.y > boss.positionv &&
                sp.y < boss.positionv + boss.height
            ) {
                boss.takeDamage(sp.damage);
                this.specialProjectiles = this.specialProjectiles.filter((proj) => proj !== sp); // Supprimer le projectile spécial
            }
        });
    }

    drawPlayerHealth(ctx, canvas) {
        const circleRadius = 10;
        const spacing = 5;
        const totalWidth = this.maxHp * (circleRadius * 2 + spacing) - spacing;
        let startX = canvas.width - totalWidth - 10; // 10px padding from the right edge
        const y = canvas.height - 20; // 20px from the bottom edge

        for (let i = 0; i < this.maxHp; i++) {
            ctx.beginPath();
            ctx.arc(startX + circleRadius, y, circleRadius, 0, Math.PI * 2);
            ctx.fillStyle = i < this.health ? 'green' : 'red'; // Filled for current HP, empty for lost HP
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.stroke();
            startX += circleRadius * 2 + spacing;
        }
    }

    calcDmgMultiplyer(){
        this.dmgMultiplyer = 1;
        if(this.health==this.maxHp){
            this.dmgMultiplyer*=this.FullHPDmg ;
        }
        if(this.health==1){
            this.dmgMultiplyer*=this.lowHPDmg ;
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.defeated();
        }
    }

    defeated() {
        const dialog = document.getElementById('PlayerDefeatDialog');
        dialog.style.display = 'block';
    }

}
