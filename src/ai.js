class ai {
    constructor(Tableau1) {
        this.scene= Tableau1
        // Création du personnage de base
        this.ai = this.scene.physics.add.sprite(900, 225, 'grenouille').setOrigin(0, 0);
        this.ai.setDisplaySize(50, 75);
        this.ai.body.setAllowGravity(true);
        this.ai.setVisible(true);


        this.detectionBox = this.scene.physics.add.sprite(900, 200, 'Arme1').setOrigin(0, 0);
        this.detectionBox.setDisplaySize(200, 75);
        this.detectionBox.body.setAllowGravity(false);
        this.detectionBox.setVisible(false);

        this.stop = this.ai.x

        this.scene.physics.add.collider(this.ai, this.scene.platforms);

    }
    IaGesttion(ai,spawnX,spawnY,detectionBox) {
        this.gauche = false;
        this.stop = ai.x;
        if (!this.scene.hide) {
            this.dist = Phaser.Math.Distance.BetweenPoints(this.scene.perso, ai);

            if (this.scene.physics.overlap(this.scene.perso,detectionBox)) {
            this.iaDetection(ai)
            }
            else {
                if ( Math.round(ai.x) === spawnX) {
                    console.log( ai.x)
                    console.log(spawnX)
                    this.spot = true;
                    console.log(this.spot);
                    if ( ai.x >= spawnX - 10 && this.spot === true) {
                        this.scene.physics.moveTo( ai, spawnX + 20, spawnY, 50);
                    } else if (ai.x <= spawnX + 10 && this.spot === true) {
                        this.scene.physics.moveTo( ai, spawnX - 20, spawnY, 50);
                    } else {
                        if (this.spot === false) {
                            this.scene.physics.moveTo( ai, spawnX + 10, spawnY, 50);

                        }

                    }

                } else {
                    if (this.spot === false) {
                        console.log(this.spot)
                        console.log( ai.x)
                        console.log(spawnX)
                        this.scene.physics.moveTo( ai, spawnX, spawnY, 200);
                        if( ai.x === spawnX){
                            this.spot = true;
                        }


                    } else if ( ai.x >= spawnX + 50) {
                        this.scene.physics.moveTo( ai, spawnX - 20, spawnY, 50);
                        this.spot = true

                    } else if ( ai.x <= spawnX - 50) {
                        console.log("zeub")
                        this.scene.physics.moveTo( ai, spawnX + 20, spawnY, 50);
                        this.spot = true
                    }

                }

            }
        } else {
            if (ai.x === spawnX) {
                console.log("test")
            } else {
                this.scene.physics.moveTo( ai, spawnX, spawnY, 200);
            }

        }


    }

    iaDetection(ai){
        this.scene.time.addEvent({delay: 1000});
        this.spot = false;
        if (this.scene.perso.x <= ai.x) {
            ai.setVelocityX(-200)
            this.gauche = true;
        } else if (this.scene.perso.x >=  ai.x) {
            ai.setVelocityX(200)


        }


        this.scene.time.addEvent({delay: 50, callback: this.Jump(ai), callbackScope: this});

        if (this.dist <= 100) {
            this.attackAi(ai)
        }

    }

    attackAi(ai) {
        ai.setVelocityX(0);

        if (this.scene.CD === true) {
            this.scene.sword.y = ai.y + 47;

            if (this.gauche === true) {
                this.scene.sword.x = ai.x - 10;
                this.scene.sword.flipX = true;
            } else {
                this.scene.sword.x = ai.x + 60;
                this.scene.sword.flipX = false;
            }

            //On rend l'épée visible
            this.scene.sword.setVisible(true);
            //On active le body de l'épée
            this.scene.sword.enableBody()
            //On ajoute un event avec un delay qui fera disparaitre l'épée dans 50 ms
            this.scene.time.addEvent({delay: 50, callback: this.scene.onEvent, callbackScope: this});

        } else {
            this.scene.time.addEvent({delay: 1000, callback: this.scene.cd, callbackScope: this});
        }
    }
    Jump(ai) {
        if (Math.round(this.stop) === ai.x && this.dist >= 100) {
            console.log(this.stop);
            ai.set
            ai.setVelocityY(-100);
        }
    }
    followBox(ai,detectionBox){
        if(ai.body.velocity.x < 0){

            detectionBox.x = ai.x -200;
            detectionBox.y = ai.y -15;
        }
        else{
            detectionBox.y = ai.y -15;
            detectionBox.x = ai.x +50;
        }

    }

}