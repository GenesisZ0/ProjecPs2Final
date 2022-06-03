class basse {
    constructor(Tableau1) {
        let me = this;

        this.scene = Tableau1
        this.basse = this.scene.physics.add.sprite(25344, 792-72, 'basse').setOrigin(0, 0);
        this.basse.body.setAllowGravity(false);
        this.basse.setVisible(true);
        this.basse.setImmovable(true)
        this.basse.setBodySize(72, 72)


}}