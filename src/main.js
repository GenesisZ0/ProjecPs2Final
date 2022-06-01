let gameConfig = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    backgroundColor: '#ffffff',
    parent: 'game',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug : false,
            gravity: { y: 2000},
            fps : 120

        }
    },
    scene: new Tableau1()
};
let game = new Phaser.Game(gameConfig);
