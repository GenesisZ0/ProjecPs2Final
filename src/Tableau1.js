class Tableau1 extends Phaser.Scene {

    constructor() {
        super("mainGame");
    }

    preload() {
        this.load.image('bg2', 'assets/bg2.png');
        this.load.image('smoke', 'assets/smoke.png')

        // Je preload les images autres que Tiled
        this.load.image('circle', 'assets/circle.png');
        this.load.image('circleG', 'assets/circleG.png');
        this.load.image('circleB', 'assets/circleB.png');

        this.load.image('caisse', 'assets/caisse.png');

        this.load.image('grenouille', 'assets/vf2.png');


        this.load.image('Arme1', 'assets/square.png');
        this.load.image('Arme2', 'assets/squareY.png');



        // chargement tilemap
        this.load.image("tilemap", "assets/tiles_packed.png");
        this.load.image("tilemap2", "assets/tilesets/TilSet.png");
        this.load.image("tilemap2", "assets/tilesets/background.jpg");
        this.load.image("demi",'assets/demi.png');
        this.load.image("laser",'assets/laser.png');
        this.load.image("herbeA",'assets/herbeA/herbe1.png');
        this.load.image("basse","assets/basse.png");

        // chargement de la map en json
        this.load.tilemapTiledJSON("map", "assets/MapBasique.json");
        this.load.image('HauteHerbe', 'assets/herbe.png');
        this.load.image('solD', 'assets/solD.png');
        this.load.image('detec', 'assets/detec.png');
        this.load.image('bg1', 'assets/bg1.png');
        this.load.image('vide', 'assets/vide.png');
        this.loadFrames("idle", 7,"assets/player/idle")
        this.loadFrames("run", 10,"assets/run/run")
        this.loadFrames("crouch",3,"assets/crouch/crouch")
        this.loadFrames("volant",6,"assets/Ai/volant")
        this.loadFrames("machine", 3,"assets/machine/machine")
        this.loadFrames("dash", 4,"assets/tuto/dash/dash")
        this.loadFrames("jump", 2,"assets/tuto/jump/jump")
        this.loadFrames("c", 2,"assets/tuto/c/c")

    }

    loadFrames(prefix,length,baseUrl){
        for (let i=1;i<=length;i++){
            this.load.image(prefix+i,baseUrl+i+'.png')
        }
    }

    create() {


        this.smoke = this.add.particles('smoke')


        this.cameras.main.setRoundPixels(true);

        this.scale.resize(1920, 1060);

        this.changementAI = false;
        let me = this;
        this.gauche = true;
        this.CD = true;
        this.tireD = false;
        this.crouch = false;
        this.hide = false;
        this.spot = false;
        this.PersoVX = 520;
        this.start = true;
        this.kan = false
        this.destroy = 2


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

        this.bg1 = this.add.sprite(6260, 1480, 'bg1').setOrigin(0, 0);///144   110
        this.bg2 = this.add.sprite(6260 +1250, 0, 'bg2').setOrigin(0, 0);///144   110
        this.bg3 = this.add.sprite(144 , 1480, 'bg2').setOrigin(0,0)
        this.bg2.setDisplaySize(60000,9000)
        this.bg1.setDepth(-1)
        this.bg2.setDepth(-1)
        this.bg3.setDepth(-1)


        this.machine = this.physics.add.sprite(27864, 1656 - 288, 'machine1').setOrigin(0, 0)
        this.machine.setDisplaySize(288,288)
        this.machine.body.setAllowGravity(false)
        this.machine.setImmovable(true)

        this.perso = this.physics.add.sprite(5616, 110, 'idle1').setOrigin(0, 0);///144   110;;;; 19440      25200   410
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
        //
        // this.herbeA = this.add.sprite(0, 0, 'herbeA').setOrigin(0, 0);
        // //animation de 3 images
        // this.anims.create({
        //     key: 'herbeA',
        //     frames: [
        //         {key: 'herbe1'},
        //         {key: 'herbe3'},
        //         {key: 'herbe3'},
        //     ],
        //     frameRate: 4,
        //     repeat: -1
        // });

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




        this.initKeyboard();

        this.physics.add.overlap(this.persoC, this.HauteHerbe)


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
                    this.ai2.ai.y = y - 76
                    break;
                }
                case 'Spawn3': {
                    this.ai3 = new ai(this)
                    this.ai3.ai.x = x
                    this.ai3.ai.y = y -76
                    break;


                }
                case 'Spawn4': {
                    this.ai4 = new ai(this)
                    this.ai4.ai.x = x
                    this.ai4.ai.y = y -76
                    this.ai4.ai.body.setAllowGravity(false)

                    break;


                }
                case 'Spawn5': {
                    this.ai5 = new ai(this)
                    this.ai5.ai.x = x
                    this.ai5.ai.y = y -76
                    this.ai5.ai.body.setAllowGravity(false)


                    break;


                }
                case 'Spawn6': {
                    this.ai6= new ai(this)
                    this.ai6.ai.x = x
                    this.ai6.ai.y = y -76
                    this.ai6.ai.body.setAllowGravity(false)


                    break;


                }
            }
        })

        const DobjectsLayer = map.getObjectLayer('solD')
        DobjectsLayer.objects.forEach(objData=> {
            const {x = 0, y = 0,    name} = objData

            switch (name) {
                case 'sol1': {
                    this.sol1 = this.physics.add.sprite(x, y-72, 'solD').setOrigin(0, 0)
                    this.sol1.body.setAllowGravity(false)
                    this.sol1.body.setImmovable(true)
                    break;
                }
                case 'sol2': {
                    this.sol2 = this.physics.add.sprite(x, y-72, 'solD').setOrigin(0, 0)
                    this.sol2.body.setAllowGravity(false)
                    this.sol2.body.setImmovable(true)
                    break;
                }
                case 'sol3': {
                    this.sol3 = this.physics.add.sprite(x, y-72, 'solD').setOrigin(0, 0)
                    this.sol3.body.setAllowGravity(false)
                    this.sol3.body.setImmovable(true)
                    break;
                }
            }
        })





        this.caisse = new Caisse(this)
        this.caisse2 = new Caisse(this)
        this.caisse3 = new Caisse(this)
        this.caisse4 = new Caisse(this)
        this.caisse2.caisse.x = 21600
        this.caisse2.caisse.y = 1728 - 76
        this.caisse3.caisse.x = 25344
        this.caisse3.caisse.y = 504 - 76
        this.caisse4.caisse.x = 30816
        this.caisse4.caisse.y = 864 - 76






        this.basse = new basse(this)
        this.basse2 = new basse(this)
        this.basse2.basse.x = 30816
        this.basse2.basse.y = 1224 -72

        this.physics.add.collider(this.caisse3.caisse, this.basse.basse, function () {
            me.cameras.main.shake(1500,0.004);
            me.basse.basse.disableBody()
            me.basse.basse.setVisible(false);
            me.destroy = me.destroy - 1
            me.smoke.createEmitter({
                speed:200,
                gravityY:-350,
                lifespan:3000,
                scale:{start:1, end:0.1, min:.1, max:.5},
                follow:{x:me.basse.x, y:me.basse.y},
                maxParticles:20,
                angle:{max:180, min:360},
            })

        })

        this.physics.add.collider(this.caisse4.caisse, this.basse2.basse, function () {
            me.cameras.main.shake(1500,0.004);
            me.basse2.basse.disableBody()
            me.destroy = me.destroy - 1
            me.basse2.basse.setVisible(false);
            me.smoke.createEmitter({
                speed:200,
                gravityY:-350,
                lifespan:3000,
                scale:{start:1, end:0.1, min:.1, max:.5},
                follow:{x:me.basse2.basse.x, y:me.basse2.basse.y},
                maxParticles:20,
                angle:{max:180, min:360},
            })

        })


        this.physics.add.overlap(this.perso, this.caisse.caisse)
        this.physics.add.collider(this.caisse.caisse, this.platforms2);
        this.physics.add.collider(this.caisse2.caisse, this.platforms2);
        this.physics.add.collider(this.caisse3.caisse, this.platforms2);
        this.physics.add.collider(this.caisse4.caisse, this.platforms2);
        this.physics.add.collider(this.sol1, this.perso);
        this.physics.add.collider(this.sol2, this.perso);
        this.physics.add.collider(this.sol3, this.perso);
        this.physics.add.collider(this.sol1, this.ai2.ai);
        this.physics.add.collider(this.sol2, this.ai2.ai);
        this.physics.add.collider(this.sol3, this.ai2.ai);




        this.spawn1X = this.ai.ai.x
        this.spawn1Y = this.ai.ai.y
        this.spawn2X = this.ai2.ai.x
        this.spawn2Y = this.ai2.ai.y
        this.spawn3X = this.ai3.ai.x
        this.spawn3Y = this.ai3.ai.y
        this.spawn4X = this.ai4.ai.x
        this.spawn4Y = this.ai4.ai.y
        this.spawn5X = this.ai5.ai.x
        this.spawn5Y = this.ai5.ai.y
        this.spawn6X = this.ai6.ai.x
        this.spawn6Y = this.ai6.ai.y

        this.distPatterne = 50
        this.distPatterne5 = 500




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

        this.DashTuto = this.add.sprite(11520-100, 1872 - 300, 'dash').setOrigin(0, 0);
        //animation de 3 images
        this.anims.create({
            key: 'dash',
            frames: [
                {key: 'dash1'},
                {key: 'dash2'},
                {key: 'dash3'},
                {key: 'dash4'},
            ],
            frameRate: 3,
            repeat: -1
        });

        this.JumpTuto = this.add.sprite(144-150, 144 - 190, 'jump').setOrigin(0, 0);
        //animation de 3 images
        this.anims.create({
            key: 'jump',
            frames: [
                {key: 'jump1'},
                {key: 'jump2'},
            ],
            frameRate: 3,
            repeat: -1
        });

        this.CTuto = this.add.sprite(5616 -200, 2016 - 300, 'c').setOrigin(0, 0);
        //animation de 3 images
        this.anims.create({
            key: 'c',
            frames: [
                {key: 'c1'},
                {key: 'c2'},
            ],
            frameRate: 3,
            repeat: -1
        });

        this.CTuto.play('c')
        this.JumpTuto.play('jump')
        this.DashTuto.play('dash')

        //animation de 3 images
        this.anims.create({
            key: 'machine',
            frames: [
                {key: 'machine1'},
                {key: 'machine2'},
                {key: 'machine3'},
            ],
            frameRate: 4,
            repeat: -1
        });


        this.machine.play('machine')

        this.checkpoint=this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('checkpoint').objects.forEach((point)=>{
            this. checkpoint_boup = this.checkpoint.create(point.x, point.y, "vide").setOrigin(0).setDisplaySize(point.width, point.height);
        });
        this.physics.add.overlap(this.perso, this.checkpoint, function()
        {
            me.checkpointX = me.perso.x;
            me.checkpointY = me.perso.y -50;
        });


        this.deathzone=this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('deathzone').objects.forEach((point)=>{
            this.deathzone_boup = this.deathzone.create(point.x, point.y, "vide").setOrigin(0).setDisplaySize(point.width, point.height);
        });
        this.physics.add.overlap(this.perso, this.deathzone, function()
        {
           me.respawn()
        });




        this.cameras.main.startFollow(this.perso,true)



    }


    respawn() {

        this.perso.setPosition(this.checkpointX,this.checkpointY);
        this.ai.ai.x = this.spawn1X;
        this.ai2.ai.x = this.spawn2X;
        this.ai3.ai.x = this.spawn3X;
        this.ai4.ai.x = this.spawn4X;
        this.ai.ai.y = this.spawn1Y;
        this.ai2.ai.y = this.spawn2Y;
        this.ai3.ai.y = this.spawn3Y;
        this.ai4.ai.y = this.spawn4Y;
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

    crouchR(){
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
    crouchD(){
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
    crouchF(){


console.log(this.persoC.anims.key === "crouch" )

        if (this.crouch === true ){
            this.crouchR()
        }
        else {
            this.crouchD()
        }
    }
    update() {

        this.dist1 = Phaser.Math.Distance.BetweenPoints(this.perso, this.ai.ai);
        this.dist3 = Phaser.Math.Distance.BetweenPoints(this.perso, this.ai3.ai);
        this.dist4 = Phaser.Math.Distance.BetweenPoints(this.perso, this.ai4.ai);
        this.dist5 = Phaser.Math.Distance.BetweenPoints(this.perso, this.ai5.ai);
        this.dist6 = Phaser.Math.Distance.BetweenPoints(this.perso, this.ai5.ai);
       if (this.ai2.dead === false){
           this.dist2 = Phaser.Math.Distance.BetweenPoints(this.perso, this.ai2.ai);
       }
       else{
           this.dist2 = 50000;
       }



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
        this.ai.IaGesttion(this.ai.ai,this.spawn1X,this.spawn1Y,this.ai.detectionBox,this.ai.detection,this.dist1,this.distPatterne);
        this.ai.IaGesttion(this.ai2.ai,this.spawn2X,this.spawn2Y,this.ai2.detectionBox,this.ai2.detection,this.dist2,this.distPatterne)
        this.ai.IaGesttion(this.ai3.ai,this.spawn3X,this.spawn3Y,this.ai3.detectionBox,this.ai3.detection,this.dist3,this.distPatterne)
        this.ai.IaGesttion(this.ai4.ai,this.spawn4X,this.spawn4Y,this.ai4.detectionBox,this.ai4.detection,this.dist4,this.distPatterne)
        this.ai.IaGesttion(this.ai5.ai,this.spawn5X,this.spawn5Y,this.ai5.detectionBox,this.ai5.detection,this.dist5,this.distPatterne5)
        this.ai.IaGesttion(this.ai6.ai,this.spawn6X,this.spawn6Y,this.ai6.detectionBox,this.ai6.detection,this.dist6,this.distPatterne)
        this.ai.followBox(this.ai.ai,this.ai.detectionBox,this.ai.detection);
        this.ai.followBox(this.ai2.ai,this.ai2.detectionBox,this.ai2.detection);
        this.ai.followBox(this.ai3.ai,this.ai3.detectionBox,this.ai3.detection);
        this.ai.followBox(this.ai4.ai,this.ai4.detectionBox,this.ai4.detection);
        this.ai.followBox(this.ai5.ai,this.ai5.detectionBox,this.ai5.detection);
        this.ai.followBox(this.ai6.ai,this.ai6.detectionBox,this.ai6.detection);
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


        this.caisse2.caisseC.x = this.caisse2.caisse.x
        this.caisse2.caisseC.y = this.caisse2.caisse.y
        this.caisse3.caisseC.x = this.caisse3.caisse.x
        this.caisse3.caisseC.y = this.caisse3.caisse.y
        this.caisse4.caisseC.x = this.caisse4.caisse.x
        this.caisse4.caisseC.y = this.caisse4.caisse.y
        this.caisse3.caisseC.setOffset(0 ,0)






    }

    initKeyboard() {
        let me = this;

        this.input.keyboard.on('keyup', function (kevent) {
            switch (kevent.keyCode) {

                case Phaser.Input.Keyboard.KeyCodes.SHIFT:
                    me.shiftDown=false;

                    break;
                case Phaser.Input.Keyboard.KeyCodes.SPACE:
                    me.kan = false
                    me.shiftDown=false;

                    break;

                case Phaser.Input.Keyboard.KeyCodes.Q:
                    me.start = true
                    me.perso.play('idle')
                    me.leftDown=false;
                    if(me.crouch === true){
                        me.persoC.setVelocityX(0);
                    }
                    me.perso.setVelocityX(0);

                    break;
                case Phaser.Input.Keyboard.KeyCodes.D:
                    me.start = true
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
                        me.persoC.setVelocityX(-150);
                    }
                    me.gauche = true;
                    if (me.gauche === true){
                        me.perso.setFlipX(true)

                    }
                    me.perso.setVelocityX(me.PersoVX * -1);


                    if (me.start === true ){
                        me.smoke.createEmitter({
                            speed:25,
                            gravityY:-25,
                            lifespan:500,
                            scale:{start:.5, end:0.1, min:.1, max:.5},
                            follow:{x:me.perso.x+45, y:me.perso.y+60},
                            maxParticles:10,
                            angle:{max:360, min:250}
                        })
                        me.start = false;
                    }


                    break;

                case Phaser.Input.Keyboard.KeyCodes.D:

                    me.perso.play('run',true)
                    me.rightDown=true;
                    if(me.crouch === true){
                        me.persoC.setFlipX(false)
                        me.persoC.setVelocityX(150);
                    }
                        me.gauche = false;
                    if (me.gauche === false){
                        me.perso.setFlipX(false)
                    }
                        me.perso.setVelocityX(me.PersoVX);

                    if (me.start === true ){
                        me.smoke.createEmitter({
                            speed:25,
                            gravityY:-25,
                            lifespan:1000,
                            scale:{start:0.5, end:0.1, min:.1, max:.5},
                            follow:{x:me.perso.x, y:me.perso.y+60},
                            maxParticles:10,
                            angle:{max:250, min:180},

                        })
                        me.start = false;
                    }


                    break;


                case Phaser.Input.Keyboard.KeyCodes.S:

                  me.crouchF();

                break;



                case Phaser.Input.Keyboard.KeyCodes.SPACE:
                    if (me.crouch === true){
                        me.crouchR()
                        me.perso.setVelocityY(-550)
                    }
                    else{
                        if (me.perso.body.onFloor(true)){
                            if (me.kan === false){
                                me.smoke.createEmitter({
                                    speed:25,
                                    gravityY:-25,
                                    lifespan:1000,
                                    scale:{start:0.2, end:0.1, min:.1, max:.5},
                                    follow:{x:me.perso.x+30, y:me.perso.y+60},
                                    maxParticles:10,
                                    angle:{max:180, min:360},

                                })
                                me.perso.setVelocityY(-550)
                                me.kan = true

                            }
                            else{
                                console.log("tesyt")
                            }

                        }
                    }

                    if(!me.perso.body.onFloor()){
                        me.shiftDown=true;
                    }


                    break;
                case Phaser.Input.Keyboard.KeyCodes.SHIFT:
                    me.shiftDown=true;

                    break;
                case Phaser.Input.Keyboard.KeyCodes.E:
                    me.caisse.coupe(me.caisse.caisseC);
                    me.caisse2.coupe(me.caisse2.caisseC)
                    me.caisse3.coupe(me.caisse3.caisseC)
                    me.caisse4.coupe(me.caisse4.caisseC)
                    if (me.physics.overlap(me.machine,me.perso) && me.destroy ===0 ){
                        console.log(me.destroy)
                    }

                    break;

                default :
                    me.stop();



            }
        })
    }


    // fin du programme
}