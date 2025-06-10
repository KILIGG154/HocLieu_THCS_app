import Phaser from 'phaser';
import { AppRouter } from '../router/AppRouter';

export class Introduction extends Phaser.Scene {
    constructor() {
        super({ key: 'Introduction' });
    }

    preload() {
        this.load.image('background', 'public/assets/background.jpg');
        this.load.image('board', 'public/assets/icon.png'); // Tải hình ảnh bảng
        this.scale.on('resize', this.resize, this);
    }

    create() {
        this.router = new AppRouter(this.game);
        this.bg = this.add.image(0, 0, 'background').setOrigin(0);
        this.icons = [];
        this.labels = [];
        this.t = 0;
        this.sceneCreated = true;
        this.resize();
    }

    resize() {
        if (!this.sceneCreated || !this.bg) return;
        const width = this.scale.width;
        const height = this.scale.height;
        this.bg.setDisplaySize(width, height);
        this.bg.setPosition(0, 0);

        this.icons.forEach(icon => icon.destroy());
        this.labels.forEach(label => label.destroy());
        this.icons = [];
        this.labels = [];

        const iconY = height * 0.5;
        const iconSize = Math.min(width, height) * 0.1;
        const iconStep = width / 5;
        const iconData = [
            { label: 'Khối 6', x: iconStep * 1, y: iconY },
            { label: 'Khối 7', x: iconStep * 2, y: iconY },
            { label: 'Khối 8', x: iconStep * 3, y: iconY },
            { label: 'Khối 9', x: iconStep * 4, y: iconY },
        ];

        iconData.forEach((data, i) => {
            const icon = this.add.image(data.x, data.y, 'board')
                .setDisplaySize(iconSize, iconSize)
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true });
            const label = this.add.text(data.x, data.y - iconSize * 0.55, data.label, {
                font: `${Math.round(iconSize * 0.35)}px Arial`,
                color: '#000',
                fontStyle: 'bold',
                align: 'center',
            }).setOrigin(0.5);
            this.icons.push(icon);
            this.labels.push(label);

            if (data.label === 'Khối 9') {
                icon.on('pointerover', () => {
                    this.tweens.add({
                        targets: icon,
                        scale: 1.18,
                        duration: 180,
                        ease: 'Back.Out',
                        yoyo: true,
                        repeat: -1
                    });
                    icon.setTint(0xffe066);
                });
                icon.on('pointerout', () => {
                    this.tweens.killTweensOf(icon);
                    this.tweens.add({
                        targets: icon,
                        scale: 1,
                        duration: 180,
                        ease: 'Back.Out',
                    });
                    icon.clearTint();
                });
                icon.on('pointerdown', () => {
                    this.load.json('hoclieu', 'hoclieu.json');
                    this.load.once('complete', () => {
                        const hoclieuData = this.cache.json.get('hoclieu');
                        this.router.goTo('grade9', { hoclieu: hoclieuData });
                        this.scene.stop(); // Dừng scene hiện tại khi chuyển
                    });
                    this.load.start();
                });
            }
        });
        this.iconY = iconY;
        this.iconSize = iconSize;
    }

    update(time, delta) {
        this.icons.forEach((icon, i) => {
            icon.y = this.iconY;
            icon.scale = 1;
            this.labels[i].x = icon.x;
            this.labels[i].y = icon.y - this.iconSize * 0.55;
        });
    }
}