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
        this.load.image("tilemap2", "assets/tilesets/TilSet.png");
        this.load.image("demi",'assets/demi.png');
        this.load.image("laser",'assets/laser.png');


        // chargement de la map en json
        this.load.tilemapTiledJSON("map", "assets/MapBasique.json");
        this.load.image('HauteHerbe', 'assets/herbe.png');

        this.loadFrames("idle", 7,"assets/player/idle")
        this.loadFrames("run", 10,"assets/run/run")
        this.loadFrames("crouch",3,"assets/crouch/crouch")
        this.loadFrames("volant",6,"assets/Ai/volant")

    }

    loadFrames(prefix,length,baseUrl){
        for (let i=1;i<=length;i++){
            this.load.image(prefix+i,baseUrl+i+'.png')
        }
    }

    create() {




        this.cameras.main.setRoundPixels(true);

        this.scale.resize(1920, 1000);

        this.changementAI = false;
        let me = this;
        this.gauche = true;
        this.CD = true;
        this.tireD = false;
        this.crouch = false;
        this.hide = false;
        this.spot = false;
        this.PersoVX = 520;



        this.speed = {
            speedDash: 1.5,
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
        this.perso = this.physics.add.sprite(144, 110, 'idle1').setOrigin(0, 0);///144   110
        this.perso.setDisplaySize(52, 68);
        this.perso.body.setAllowGravity(true);
        this.perso.setVisible(true);
        this.perso.hp = 300;

        // Création du personnage de base
        this.persoC = this.physics.add.sprite(500, 0, 'crouch1').setOrigin(0, 0);
        this.persoC.setDisplaySize(52, 54);
        this.persoC.body.setAllowGravity(true);
        this.persoC.setVisible(false);
        this.persoC.hp = 300;


        this.sword = this.physics.add.sprite(200, 100, "sword").setScale(0.1, 0.1);
        this.sword.body.setAllowGravity(false);
        this.sword.setDepth(1);
        this.sword.setVisible(false);
        this.sword.attack = 100
        this.sword.disableBody()

        this.demi = this.physics.add.sprite(5760, 2010, 'demi').setOrigin(0, 0)
        this.demi.setDisplaySize(500, 24);
        this.demi.body.setAllowGravity(false)
        this.demi.setImmovable(true)

        // chargement de la map
        const map = this.add.tilemap("map");
        // chargement du tileset
        const tileset = map.addTilesetImage(
            "game_tile",
            "tilemap"
        );

        const tileset2 = map.addTilesetImage(
            "TilSet",
            "tilemap2"
        );

        // chargement du calque plateformes
        this.platforms = map.createLayer(
            "calque_plateformes",
            tileset
        );

        // chargement du calque plateformes
        this.platforms2 = map.createLayer(
            "calque_plateformes2",
            tileset2
        );
        // chargement du calque plateformes
        this.platforms3 = map.createLayer(
            "calque_plateformes3",
            tileset2
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
        this.platforms2.setCollisionByExclusion(-1, true);


        // target or player's x, y
        const tx = this.perso.x
        const ty = this.perso.y


        // Creation des collision

        this.physics.add.collider(this.persoC, this.platforms);
        this.physics.add.collider(this.perso, this.platforms);
        this.physics.add.collider(this.persoC, this.platforms2);
        this.physics.add.collider(this.perso, this.platforms2);
        this.physics.add.collider(this.perso, this.demi);
        this.physics.add.collider(this.sword, this.perso);


        this.initKeyboard();

        this.physics.add.overlap(this.persoC, this.HauteHerbe)
        this.physics.add.overlap(this.sword, this.perso, function () {
            me.perso.hp -= me.sword.attack;
        })

        this.projectiles = this.add.group();

        this.time.addEvent({delay: 500, callback: this.tir, callbackScope: this, loop: true});



        const objectsLayer = map.getObjectLayer('AI')
        objectsLayer.objects.forEach(objData=> {
            const {x = 0, y = 0, name} = objData

            switch (name) {
                case 'Spawn1': {
                    this.ai = new ai(this)
                    this.ai.ai.x = x
                    this.ai.ai.y = y -76
                    break;
                }
                case 'Spawn2': {
                    this.ai2 = new ai(this)
                    this.ai2.ai.x = x
                    this.ai2.ai.y = y -76
                    break;

                }
            }
        })


        this.caisse = new Caisse(this)


        this.physics.add.overlap(this.perso, this.caisse.caisse)
        this.physics.add.collider(this.caisse.caisse, this.platforms2);

    this.spawn1X = this.ai.ai.x
    this.spawn1Y = this.ai.ai.y
    this.spawn2X = this.ai2.ai.x
    this.spawn2Y = this.ai2.ai.y

        this.idle = this.add.sprite(0, 0, 'idle').setOrigin(0, 0);
        this.anims.create({
            key: 'idle',
            frames: [
                {key: 'idle1'},
                {key: 'idle2'},
                {key: 'idle3'},
                {key: 'idle4'},
                {key: 'idle5'},
                {key: 'idle6'},
                {key: 'idle7'},
            ],
            frameRate: 7,
            repeat: -1
        });
        this.perso.play("idle")


        this.run = this.add.sprite(0, 0, 'run').setOrigin(0, 0);
        this.anims.create({
            key: 'run',
            frames: [
                {key: 'run1'},
                {key: 'run2'},
                {key: 'run3'},
                {key: 'run4'},
                {key: 'run5'},
                {key: 'run6'},
                {key: 'run7'},
                {key: 'run8'},
                {key: 'run9'},
                {key: 'run10'},
            ],
            frameRate: 10,
            repeat: -1
        });


        this.crouch = this.add.sprite(0, 0, 'crouch').setOrigin(0, 0);
        //animation de 3 images
        this.anims.create({
            key: 'crouch',
            frames: [
                {key: 'crouch1'},
                {key: 'crouch2'},
                {key: 'crouch3'},
            ],
            frameRate: 4,
            repeat: -1
        });



        this.cameras.main.startFollow(this.perso,true)
    }




    cameraZoom(){
        let cam = this.cameras.main;
        let me = this;

        if(me.hide === true){
            cam.zoomTo(0.8, 500);
        }
        else {
            cam.zoomTo(1, 1000);
        }
    }


    tir() {
        let me = this;


        if (this.hide == false) {
            if (this.tireD === true) {
                this.balle = new Balle(this);
                this.physics.add.collider(this.perso, this.balle, function () {
                })
            }

        }


    }

    IaGestion2(ai) {
        if (this.hide == false) {
            this.dist2 = Phaser.Math.Distance.BetweenPoints(this.perso, ai);

            if (this.dist2 <= 400) {
                this.tireD = true

            } else {
                this.tireD = false;
            }

        }

    }

    cd() {
        this.CD = true;
    }

    onEvent() {

        this.CD = false;
    }


    tp() {
        this.persoC.x = this.perso.x - 10
        this.persoC.y = this.perso.y
    }


    test() {
        if (this.physics.overlap(this.persoC, this.HauteHerbe) === false) {
            this.hide = false;
        } else {
            this.hide = true;
        }
    }
    stop(){
        this.perso.setVelocityX(0);
        if (this.perso.body.onFloor()) {
            this.perso.play('idle',true)
        }
    }
    crouchF(){


console.log(this.persoC.anims.key === "crouch" )

        if (this.crouch === true ){

            this.crouch = false;
            this.hide = false;
            this.perso.x = this.persoC.x
            this.perso.y = this.persoC.y-15
            this.perso.enableBody()
            this.persoC.disableBody()
            this.cameras.main.startFollow(this.perso,true)
            this.persoC.setVisible(false)
            this.perso.setVisible(true)

        }
        else {


            this.persoC.x = this.perso.x
            this.persoC.y = this.perso.y+15
            this.perso.disableBody()
            this.persoC.enableBody()
            this.cameras.main.startFollow(this.persoC,true  )
            this.persoC.setVisible(true)
            this.perso.setVisible(false)
            this.persoC.play("crouch")
            this.crouch = true;



        }
    }
    update() {


        this.test()
        this.cameraZoom()

        //this.balle.updateBalle()
        if (this.shiftDown && this.rightDown) {
            if (this.flag) {

            } else {
                this.dash.play();
                this.flag = true;
            }
            this.perso.setVelocityX(1000 * this.speed.speedDash);
        }

        if (this.shiftDown && this.leftDown) {
            if (this.flag) {

            } else {
                this.dash.play();
                this.flag = true;
            }
            this.perso.setVelocityX(-1000 * this.speed.speedDash);
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

        this.ai2.detectionBox.x = 100;
        this.ai.IaGesttion(this.ai.ai,this.spawn1X,this.spawn1Y,this.ai.detectionBox);
        this.ai.IaGesttion(this.ai2.ai,this.spawn2X,this.spawn2Y,this.ai2.detectionBox)
        this.ai.followBox(this.ai.ai,this.ai.detectionBox);
        this.ai.followBox(this.ai2.ai,this.ai2.detectionBox);
        this.cameraZoom()

        if (this.physics.overlap(this.demi,this.perso)){
            this.persoC.x = this.perso.x
            this.persoC.y = this.perso.y+15
            this.perso.disableBody()
            this.persoC.enableBody()
            this.cameras.main.startFollow(this.persoC,true  )
            this.persoC.setVisible(true)
            this.perso.setVisible(false)
            this.persoC.play("crouch")
            this.crouch = true;
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
                    me.perso.play('idle')
                    me.leftDown=false;
                    if(me.crouch === true){
                        me.persoC.setVelocityX(0);
                    }
                    me.perso.setVelocityX(0);
                    break;
                case Phaser.Input.Keyboard.KeyCodes.D:
                    me.perso.play('idle')
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
                    me.perso.play('run',true)
                    me.leftDown=true;




                    if(me.crouch === true){
                        me.persoC.setFlipX(true)
                        me.persoC.setVelocityX(-100);
                    }
                    me.gauche = true;
                    if (me.gauche === true){
                        me.perso.setFlipX(true)

                    }
                    me.perso.setVelocityX(me.PersoVX * -1);


                    break;

                case Phaser.Input.Keyboard.KeyCodes.D:
                    me.perso.play('run',true)
                    me.rightDown=true;
                    if(me.crouch === true){
                        me.persoC.setFlipX(false)
                        me.persoC.setVelocityX(100);
                    }
                        me.gauche = false;
                    if (me.gauche === false){
                        me.perso.setFlipX(false)
                    }
                        me.perso.setVelocityX(me.PersoVX);

                    break;


                case Phaser.Input.Keyboard.KeyCodes.C:

                  me.crouchF();

                break;



                case Phaser.Input.Keyboard.KeyCodes.SPACE:

                    if (me.perso.body.onFloor(true)){
                        me.perso.setVelocityY(-450)
                    }
                    break;
                case Phaser.Input.Keyboard.KeyCodes.SHIFT:
                    me.shiftDown=true;

                    break;
                case Phaser.Input.Keyboard.KeyCodes.E:
              if (me.physics.overlap(me.perso,me.caisse.caisse)){
                 me.caisse.caisse.body.setAllowGravity(true);
              }

                    break;

                default :
                    me.stop();



            }
        })
    }


    // fin du programme
}