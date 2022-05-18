class ai {
    constructor(Tableau1) {
        this.scene= Tableau1
        // Création du personnage de base
        this.ai = this.scene.physics.add.sprite(900, 225, 'grenouille').setOrigin(0, 0);
        this.ai.setDisplaySize(50, 75);
        this.ai.body.setAllowGravity(true);
        this.ai.setVisible(true);
        this.spawn1X = this.ai.x
        this.spawn1Y = this.ai.y

        this.detectionBox = this.scene.physics.add.sprite(900, 200, 'Arme1').setOrigin(0, 0);
        this.detectionBox.setDisplaySize(200, 75);
        this.detectionBox.body.setAllowGravity(false);
        this.detectionBox.setVisible(false);

        this.stop = this.ai.x

        const iax = this.ai.x;
        const iay = this.ai.y;


        this.scene.physics.add.collider(this.ai, this.scene.platforms);

    }
    IaGesttion(ai) {
        this.gauche = false;
        this.stop = ai.x;
        if (!this.scene.hide) {
            this.dist = Phaser.Math.Distance.BetweenPoints(this.scene.perso, ai);

            if (this.dist <= 300) {
                this.scene.time.addEvent({delay: 1000});
                this.spot = false;
                if (this.scene.perso.x <= ai.x) {
                   ai.setVelocityX(-200)
                    this.gauche = true;
                } else if (this.scene.perso.x >=  ai.x) {
                   ai.setVelocityX(200)


                }


                this.scene.time.addEvent({delay: 50, callback: this.Jump, callbackScope: this});

                if (this.dist <= 100) {
                    this.attackAi()
                }
            } else {
                if ( ai.x === this.spawn1X) {
                    console.log( ai.x)
                    console.log(this.spawn1X)
                    this.spot = true;
                    console.log(this.spot);
                    if ( ai.x >= this.spawn1X - 10 && this.spot === true) {
                        this.scene.physics.moveTo( ai, this.spawn1X + 20, this.spawn1Y, 50);
                    } else if (ai.x <= this.spawn1X + 10 && this.spot === true) {
                        this.scene.physics.moveTo( ai, this.spawn1X - 20, this.spawn1Y, 50);
                    } else {
                        if (this.spot === false) {
                            this.scene.physics.moveTo( ai, this.spawn1X + 10, this.spawn1Y, 50);

                        }


                    }

                } else {
                    if (this.spot === false) {
                        console.log(this.spot)
                        console.log( ai.x)
                        console.log(this.spawn1X)
                        this.scene.physics.moveTo( ai, this.spawn1X, this.spawn1Y, 200);
                        if( ai.x === this.spawn1X){
                            this.spot = true;
                        }


                    } else if ( ai.x >= this.spawn1X + 50) {
                        this.scene.physics.moveTo( ai, this.spawn1X - 20, this.spawn1Y, 50);
                        this.spot = true

                    } else if ( ai.x <= this.spawn1X - 50) {
                        console.log("zeub")
                        this.scene.physics.moveTo( ai, this.spawn1X + 20, this.spawn1Y, 50);
                        this.spot = true
                    }

                }

            }
        } else {
            if (ai.x === this.spawn1X) {
                console.log("test")
            } else {
                this.scene.physics.moveTo( ai, this.spawn1X, this.spawn1Y, 200);
            }

        }


    }
    attackAi() {
        this.ai.setVelocityX(0);

        if (this.scene.CD === true) {
            this.scene.sword.y = this.ai.y + 47;

            if (this.gauche === true) {
                this.scene.sword.x = this.ai.x - 10;
                this.scene.sword.flipX = true;
            } else {
                this.scene.sword.x = this.ai.x + 60;
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
    Jump() {
        if (this.stop === this.ai.x && this.dist >= 100) {
            console.log(this.stop);
            this.ai.set
            this.ai.setVelocityY(-100);
        }
    }
    followBox(){
        if(this.ai.body.velocity.x < 0){

            this.detectionBox.x = this.ai.x -200;
            this.detectionBox.y = this.ai.y -15;
        }
        else{
            this.detectionBox.y = this.ai.y -15;
            this.detectionBox.x = this.ai.x +50;
        }

    }
}