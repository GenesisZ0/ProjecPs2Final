class Tableau1 extends Phaser.Scene {


    preload() {
        // Je preload les images autres que Tiled
        this.load.image('circle', 'assets/circle.png');
        this.load.image('circleG', 'assets/circleG.png');
        this.load.image('circleB', 'assets/circleB.png');

        this.load.image('sword', 'assets/sword.png');

        this.load.image('grenouille', 'assets/vf2.png');

        this.load.image('Arme1', 'assets/square.png');
        this.load.image('Arme2', 'assets/squareY.png');

        // chargement tilemap
        this.load.image("tilemap", "assets/tiles_packed.png");

        // chargement de la map en json
        this.load.tilemapTiledJSON("map", "assets/MapBasique.json");
        this.load.image('HauteHerbe', 'assets/herbe.png');

    }


    create() {

        this.changementAI = false;
        let me = this;
        this.gauche = true;
        this.CD = true;
        this.tireD = false;
        this.crouch = false;
        this.hide = false;
        this.spot = false;
        this.PersoVX = 220;
        let cam = this.cameras.main;


        this.speed = {
            speedDash: 1,
        }

        this.dash = this.tweens.add({
            targets: this.speed,
            speedDash: 0,
            // alpha: { start: 0, to: 1 },
            // alpha: 1,
            // alpha: '+=1',
            ease: "Circ.easeInOut", // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 300,
            //repeat: -1, // -1: infinity
            //yoyo: true
        });

        // Création du personnage de base
        this.perso = this.physics.add.sprite(500, 0, 'circle').setOrigin(0, 0);
        this.perso.setDisplaySize(30, 60);
        this.perso.body.setAllowGravity(true);
        this.perso.setVisible(true);
        this.perso.hp = 300;

        // Création du personnage de base
        this.persoC = this.physics.add.sprite(500, 0, 'circle').setOrigin(0, 0);
        this.persoC.setDisplaySize(30, 30);
        this.persoC.body.setAllowGravity(true);
        this.persoC.setVisible(true);
        this.persoC.hp = 300;


        // Création Ia qui snipe
        this.ai2 = this.physics.add.sprite(50, 0, 'grenouille').setOrigin(0, 0);
        this.ai2.setDisplaySize(50, 75);
        this.ai2.body.setAllowGravity(true);
        this.ai2.setVisible(true);


        this.sword = this.physics.add.sprite(200, 100, "sword").setScale(0.1, 0.1);
        this.sword.body.setAllowGravity(false);
        this.sword.setDepth(1);
        this.sword.setVisible(false);
        this.sword.attack = 100
        this.sword.disableBody()


        // chargement de la map
        const map = this.add.tilemap("map");
        // chargement du tileset
        const tileset = map.addTilesetImage(
            "game_tile",
            "tilemap"
        );

        // chargement du calque plateformes
        this.platforms = map.createLayer(
            "calque_plateformes",
            tileset
        );

        // chargement du calque plateformes
        this.HauteHerbe = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('hauteHerbe').objects.forEach((HauteHerbe) => {
            // Add new spikes to our sprite group
            const HauteHerbeSprite = this.HauteHerbe.create(HauteHerbe.x, HauteHerbe.y - HauteHerbe.height, 'HauteHerbe').setOrigin(0);

        });

        this.platforms.setCollisionByExclusion(-1, true);


        // target or player's x, y
        const tx = this.perso.x
        const ty = this.perso.y


        // Creation des collision

        this.physics.add.collider(this.persoC, this.platforms);
        this.physics.add.collider(this.perso, this.platforms);
        this.physics.add.collider(this.sword, this.perso);
        this.physics.add.collider(this.ai2, this.platforms);


        this.initKeyboard();

        this.physics.add.overlap(this.persoC, this.HauteHerbe)
        this.physics.add.overlap(this.sword, this.perso, function () {
            me.perso.hp -= me.sword.attack;
        })

        this.projectiles = this.add.group();

        this.time.addEvent({delay: 500, callback: this.tir, callbackScope: this, loop: true});

        this.physics.add.overlap(this.persoC, this.HauteHerbe, function () {
            if(me.hide === true){
                cam.zoomTo(0.9, 500);
            }
            else {
                cam.zoomTo(1, 1000);
            }


        })

this.ai = new ai(this)
this.ai2 = new ai(this)

this.ai2.ai.x = 250
    }


    rouch() {
        if (this.crouch === true) {
            this.cameras.main.startFollow(this.persoC, false);
            this.persoC.enableBody()
            this.persoC.setVisible(true)
            this.perso.setVisible(false)
            this.perso.disableBody(true);
            this.perso.y = this.persoC.y - 30;
            this.perso.x = this.persoC.x


        } else {
            this.cameras.main.startFollow(this.perso, false);
            this.persoC.disableBody()
            this.persoC.y = this.perso.y + 30;
            this.persoC.x = this.perso.x
            this.persoC.setVisible(false)
            this.perso.setVisible(true)
            this.perso.enableBody();


        }
    }

    tir() {
        let me = this;


        if (this.hide == false) {
            if (this.tireD === true) {
                this.balle = new Balle(this);
                this.physics.add.collider(this.perso, this.balle, function () {
                    console.log("ok")
                })
            }

        }


    }

    IaGestion2() {
        if (this.hide == false) {
            this.dist2 = Phaser.Math.Distance.BetweenPoints(this.perso, this.ai2);

            if (this.dist2 <= 400) {
                this.tireD = true
                console.log("tire")

            } else {
                this.tireD = false;
            }

        }

    }

    cd() {
        this.CD = true;
        console.log("neuneu")
    }

    onEvent() {
        this.sword.disableBody()
        this.sword.setVisible(false);
        this.CD = false;
        console.log("on se retire")
    }


    tp() {
        this.persoC.x = this.perso.x - 10
        this.persoC.y = this.perso.y
    }


    test() {
        if (this.physics.overlap(this.persoC, this.HauteHerbe) === false) {
            this.hide = false;
            console.log(this.hide);
        } else {
            this.hide = true
            console.log(this.hide);
        }
    }

    update() {
        if (this.shiftDown && this.rightDown) {
            if (this.flag) {

            } else {
                this.dash.play();
                this.flag = true;
            }
            this.perso.setVelocityX(1000 * this.speed.speedDash);
            console.log(this.speed.speedDash);
        }

        if (this.shiftDown && this.leftDown) {
            if (this.flag) {

            } else {
                this.dash.play();
                this.flag = true;
            }
            this.perso.setVelocityX(-1000 * this.speed.speedDash);
            console.log(this.speed.speedDash);
        }


        if (!this.shiftDown) {
            if (this.flag) {
                this.flag = false;
            }
        }

        if (!this.shiftDown && this.rightDown) {
            this.perso.setVelocityX(this.PersoVX);
        } else if (!this.shiftDown && this.leftDown) {
            this.perso.setVelocityX(this.PersoVX * -1);
        }


        /////////////////////////////////////////////////////////////////
        for (var i = 0; i < this.projectiles.getChildren().length; i++) {
            var tir = this.projectiles.getChildren()[i];
            tir.update();
        }

        this.ai.IaGesttion(this.ai.ai);
        this.ai.IaGesttion(this.ai2.ai)
        this.ai.followBox();

        this.rouch();
        if (this.crouch === true) {
            this.test()
        } else {

        }

    }
    initKeyboard() {
        let me = this;

        this.input.keyboard.on('keyup', function (kevent) {
            switch (kevent.keyCode) {

                case Phaser.Input.Keyboard.KeyCodes.SHIFT:
                    me.shiftDown=false;

                    break;

                case Phaser.Input.Keyboard.KeyCodes.Q:
                    me.leftDown=false;
                    if(me.crouch === true){
                        me.persoC.setVelocityX(0);
                    }
                    me.perso.setVelocityX(0);
                    break;
                case Phaser.Input.Keyboard.KeyCodes.D:
                    me.rightDown=false;
                    if(me.crouch === true){
                        me.persoC.setVelocityX(0);
                    }
                    me.perso.setVelocityX(0);
                    break;
            }
        })
        this.input.keyboard.on('keydown', function (kevent) {
            switch (kevent.keyCode) {

                case Phaser.Input.Keyboard.KeyCodes.Q:
                    me.leftDown=true;
                        if(me.crouch === true){
                            me.persoC.setVelocityX(-100);
                        }
                        me.gauche = true;
                        me.perso.setVelocityX(me.PersoVX * -1);

                    break;

                case Phaser.Input.Keyboard.KeyCodes.D:
                    me.rightDown=true;
                    if(me.crouch === true){
                        me.persoC.setVelocityX(100);
                    }
                        me.gauche = false;
                        me.perso.setVelocityX(me.PersoVX);

                    break;


                case Phaser.Input.Keyboard.KeyCodes.C:

                    if (me.crouch === true){
                        me.crouch = false;
                        me.hide = false;
                        console.log(me.hide);


                    }
                    else {
                        me.crouch = true;

                        break;

                    }
                break;


                case Phaser.Input.Keyboard.KeyCodes.SPACE:

                    if (me.perso.body.onFloor(true)){
                        me.perso.setVelocityY(-350)
                    }
                    break;
                case Phaser.Input.Keyboard.KeyCodes.SHIFT:
                    me.shiftDown=true;

                    break;


            }
        })
    }


    // fin du programme
}