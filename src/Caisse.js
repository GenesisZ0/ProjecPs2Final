class Caisse {
    constructor(Tableau1) {


        this.scene = Tableau1
        this.caisse = this.scene.physics.add.sprite(7416, 540, 'Arme1').setOrigin(0, 0);
        this.caisse.setDisplaySize(100, 100);
        this.caisse.body.setAllowGravity(false);
        this.caisse.setVisible(true);
        this.caisse.setBodySize(1000, 500)


    }



}