class Caisse {
    constructor(Tableau1) {
        let me = this;

        this.scene = Tableau1
        this.caisse = this.scene.physics.add.sprite(12384, 1728, 'caisse').setOrigin(0, 0);
        this.caisse.body.setAllowGravity(false);
        this.caisse.setVisible(true);
        this.caisse.setImmovable(true)
        this.caisse.setBodySize(76, 76)



        this.scene.physics.add.collider(this.caisse,this.scene.perso)
        this.scene.physics.add.overlap(this.caisse, this.scene.ai2.ai, function () {
            console.log("test")
            me.scene.ai2.ai.disableBody();
            me.scene.ai2.ai.setVisible(false);
            me.scene.ai2.detectionBox.setVisible(false);
        })


        this.scene.physics.add.overlap(this.caisse, this.scene.sol2, function () {
            me.scene.cameras.main.shake(1500,0.004);
            me.scene.smoke.createEmitter({
                speed:200,
                gravityY:-350,
                lifespan:3000,
                scale:{start:1, end:0.1, min:.1, max:.5},
                follow:{x:me.scene.sol1.x+36, y:me.scene.sol1.y},
                maxParticles:20,
                angle:{max:180, min:360},


            })


            me.scene.sol2.setVisible(false)
            me.scene.sol1.setVisible(false)
            me.scene.sol3.setVisible(false)
            me.scene.sol2.disableBody()
            me.scene.sol1.disableBody()
            me.scene.sol3.disableBody()

        })


    }



}