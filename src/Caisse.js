class Caisse {
    constructor(Tableau1) {
        let me = this;

        this.scene = Tableau1
        this.caisse = this.scene.physics.add.sprite(12384, 1800, 'Arme1').setOrigin(0, 0);
        this.caisse.setDisplaySize(100, 100);
        this.caisse.body.setAllowGravity(false);
        this.caisse.setVisible(true);
        this.caisse.setBodySize(1000, 500)


        this.scene.physics.add.overlap(this.caisse, this.scene.ai2.ai, function () {
            me.scene.ai2.ai.disableBody();
            me.scene.ai2.ai.setVisible(false);
            me.scene.ai2.detectionBox.setVisible(false);
        })


        this.scene.physics.add.overlap(this.caisse, this.scene.sol2, function () {
            me.scene.sol2.setVisible(false)
            me.scene.sol1.setVisible(false)
            me.scene.sol3.setVisible(false)
            me.scene.sol2.disableBody()
            me.scene.sol1.disableBody()
            me.scene.sol3.disableBody()
        })


    }



}