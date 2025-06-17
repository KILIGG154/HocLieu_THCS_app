import Phaser from 'phaser';

export class PracticeQuadratic extends Phaser.Scene {
    constructor() {
        super({ key: 'PracticeQuadratic' });
    }

    preload() {
        this.load.image('background', '/assets/background.jpg');
    }

    create() {
        this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(this.scale.width, this.scale.height);
        // ...Bạn có thể thêm nội dung khác ở đây...
    }
}