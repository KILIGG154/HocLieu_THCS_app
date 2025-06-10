import Phaser from 'phaser';
import { AppRouter } from '../router/AppRouter';

export class Grade9 extends Phaser.Scene {
    constructor() {
        super({ key: 'Grade9' });
    }

    init(data) {
        this.hoclieu = data.hoclieu || null;
    }

    create() {
        this.router = new AppRouter(this.game);
        this.add.text(50, 30, 'Khối 9 - Thông tin học liệu', { font: '28px Arial', color: '#0a0', fontStyle: 'bold' });
        if (this.hoclieu) {
            this.add.text(50, 80, `Môn học: ${this.hoclieu.subject}`, { font: '22px Arial', color: '#222' });
            this.add.text(50, 110, `Khối: ${this.hoclieu.grade}`, { font: '20px Arial', color: '#222' });
            this.add.text(50, 140, 'Danh sách chương:', { font: '20px Arial', color: '#0a0', fontStyle: 'bold' });

            let y = 170;
            this.hoclieu.chapters.forEach((chapter, idx) => {
                this.add.text(70, y, `${idx + 1}. ${chapter.title}`, { font: '18px Arial', color: '#005' });
                y += 26;
                this.add.text(90, y, `Mô tả: ${chapter.description}`, { font: '16px Arial', color: '#333', wordWrap: { width: this.scale.width - 120 } });
                y += 22;
                this.add.text(90, y, 'Bài học:', { font: '16px Arial', color: '#0a0' });
                y += 22;
                chapter.lessons.forEach((lesson, lidx) => {
                    this.add.text(110, y, `- ${lesson.title}: ${lesson.description}`, { font: '15px Arial', color: '#222', wordWrap: { width: this.scale.width - 140 } });
                    y += 20;
                });
                y += 10;
            });

            // Thêm nút "Back" để quay lại Introduction
            const backButton = this.add.text(50, this.scale.height - 50, 'Back', {
                font: '20px Arial',
                color: '#fff',
                backgroundColor: '#0a0',
                padding: { x: 10, y: 5 }
            }).setInteractive({ useHandCursor: true });

            backButton.on('pointerdown', () => {
                this.router.goTo('introduction', {});
                this.scene.stop(); // Dừng scene hiện tại khi back
            });
        } else {
            this.add.text(50, 100, 'Không có dữ liệu!', { font: '18px Arial', color: '#f00' });
        }
    }
}