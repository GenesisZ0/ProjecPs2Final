class Intro extends Phaser.Scene{

    constructor() {
        super("menuGame");
    }

    preload(){
        this.load.image("bouton1", "assets/bouton3.png");
        this.load.image("bouton2", "assets/bouton4.png");
        this.load.image("menu", "assets/menu.png");
        this.load.image("particles", "assets/menu/particles.png");
        this.load.image("particles2", "assets/menu/particles2.png");

    }

    create(){
        this.scale.resize(1920, 1060);
        const menu= this.add.image(0, 0, 'menu').setOrigin(0, 0);
        let bouton1 = this.add.image(950,880,'bouton1');
        //button.setScale(1);
        bouton1.setInteractive();
        bouton1.on("pointerover",()=>{
            console.log("over")
            bouton1.setTexture('bouton2')
        })
        bouton1.on("pointerout",()=>{
            console.log("out")
            bouton1.setTexture('bouton1')
        })
        bouton1.on("pointerup",()=>{
            console.log("up")
            bouton1.setTexture('bouton2')
            this.scene.start("mainGame")

        })

        this.part = this.add.particles('particles');

        this.emitter = this.part.createEmitter({
            x: { min: -800, max: 1920 },
            y: { min: 1060, max: 1060 },
            lifespan: { min: 500, max: 4000},
            speedY: { min: -50, max: -10 },
            scale: { start: 0.1, end: 0 },
            quantity: { min: 0.9, max: 0.5 },
            blendMode: 'ADD'

        });
        this.emitter.start(0,0);





    }

}