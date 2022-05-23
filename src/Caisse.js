class Caisse {
    constructor(Tableau1) {
        let me = this;

        this.scene = Tableau1
        this.caisse = this.scene.physics.add.sprite(7416, 540, 'Arme1').setOrigin(0, 0);
        this.caisse.setDisplaySize(100, 100);
        this.caisse.body.setAllowGravity(false);
        this.caisse.setVisible(true);
        this.caisse.setBodySize(1000, 500)


        this.scene.physics.add.overlap(this.caisse, this.scene.ai2.ai, function () {
            console.log("test")
            me.scene.ai2.ai.disableBody();
            me.scene.ai2.ai.setVisible(false);;
        })


    }



}