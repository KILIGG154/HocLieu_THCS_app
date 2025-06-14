import Phaser from 'phaser';
import { AppRouter } from '../router/AppRouter';

export class History1 extends Phaser.Scene {
    constructor() {
        super({ key: 'history1' });
    }

    preload() {
        // Load video từ public/video/history.mp4
        this.load.video('historyVideo', 'video/history.mp4', 'loadeddata', false, true);
        this.load.image('button', '/assets/icon.png');
    }

    create(data) {
        this.router = new AppRouter(this.game);
        // Lưu lại dữ liệu lichsu nếu có
        this.lichsu = (this.scene.settings.data && this.scene.settings.data.lichsu) ? this.scene.settings.data.lichsu : null;
        // Thêm video vào giữa màn hình, chỉnh vừa khung hình
        const videoWidth = this.scale.width * 0.3;
        const videoHeight = this.scale.height * 0.35;
        const video = this.add.video(this.scale.width/2, this.scale.height/2, 'historyVideo');
        video.setDisplaySize(videoWidth, videoHeight);
        video.setInteractive();
        video.play(true);
        // Cho phép play/pause khi click vào video
        video.on('pointerdown', () => {
            if (video.isPlaying()) {
                video.pause();
            } else {
                video.resume();
            }
        });
        // Nút Back
        const backButton = this.add.image(80, this.scale.height - 60, 'button')
            .setDisplaySize(120, 40)
            .setInteractive({ useHandCursor: true });
        const backText = this.add.text(80, this.scale.height - 60, 'BACK', {
            font: 'bold 18px Arial',
            color: '#fff',
            align: 'center'
        }).setOrigin(0.5);
        backButton.on('pointerover', () => {
            backButton.setTint(0xffaa00);
            this.tweens.add({
                targets: backButton,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 100
            });
        });
        backButton.on('pointerout', () => {
            backButton.clearTint();
            this.tweens.add({
                targets: backButton,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
        });
        backButton.on('pointerdown', () => {
            backButton.setTint(0x888888);
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.router.goTo('Grade8', { lichsu: this.lichsu });
                this.scene.stop();
            });
        });
    }
}
