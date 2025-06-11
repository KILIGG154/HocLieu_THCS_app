import Phaser from 'phaser';

export class IntroMathC1L1 extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroMathC1L1' });
    }

    init(data) {
        this.lesson = data.lesson || {};
    }

    create() {
        this.add.text(100, 100, this.lesson.title || 'Căn bậc hai', { font: '32px Arial', color: '#333' });
        this.add.text(100, 150, this.lesson.description || '', { font: '20px Arial', color: '#555' });
        this.add.text(100, 220, 'ax^2 + bx + c', { font: '28px Arial', color: '#000000' });
    }
} 