import Phaser from 'phaser';
import { AppRouter } from '../router/AppRouter';

export class Grade9 extends Phaser.Scene {
    constructor() {
        super({ key: 'Grade9' });
    }

    init(data) {
        this.hoclieu = data.hoclieu || null;
    }

    preload() {
        this.load.image('background', '/assets/background.jpg');
        this.load.image('panel', '/assets/icon.png');
        this.load.image('button', '/assets/icon.png');
        this.load.image('chapter_icon', '/assets/icon.png');
        this.load.image('lesson_icon', '/assets/icon.png');
    }

    create() {
        this.router = new AppRouter(this.game);
        
        // Tạo nền
        this.bg = this.add.image(0, 0, 'background')
            .setOrigin(0)
            .setDisplaySize(this.scale.width, this.scale.height);
            
        // Tạo panel chứa nội dung
        const panel = this.add.image(this.scale.width/2, this.scale.height/2, 'panel')
            .setDisplaySize(this.scale.width * 0.9, this.scale.height * 0.85)
            .setAlpha(0.9);
            
        // Header
        const headerText = this.add.text(this.scale.width/2, 40, 'KHỐI 9 - THÔNG TIN HỌC LIỆU', {
            font: 'bold 32px Arial',
            color: '#0a5',
            align: 'center',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5, 0);
        
        // Container cho nội dung cuộn được
        const contentMask = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRect(80, 120, this.scale.width - 160, this.scale.height - 200);
            
        const content = this.add.container(0, 0);
        content.setMask(new Phaser.Display.Masks.GeometryMask(this, contentMask));
        
        if (this.hoclieu) {
            // Thông tin môn học
            const subjectText = this.add.text(this.scale.width/2, 90, `Môn học: ${this.hoclieu.subject}`, {
                font: 'bold 24px Arial',
                color: '#222',
                align: 'center'
            }).setOrigin(0.5, 0);
            
            let y = 150;
            const chapterSpacing = 60; // khoảng cách giữa các chương
            const lessonSpacing = 38;  // khoảng cách giữa các bài học
            const lessonDescSpacing = 8; // khoảng cách giữa tiêu đề và mô tả bài học

            this.hoclieu.chapters.forEach((chapter, idx) => {
                // Icon và tiêu đề chương
                const chapterIcon = this.add.image(100, y, 'chapter_icon')
                    .setDisplaySize(30, 30)
                    .setOrigin(0.5);
                content.add(chapterIcon);

                const chapterTitle = this.add.text(140, y - 10, `Chương ${idx + 1}: ${chapter.title}`, {
                    font: 'bold 22px Arial',
                    color: '#005',
                    wordWrap: { width: this.scale.width - 220 }
                }).setOrigin(0, 0);
                content.add(chapterTitle);

                y += 28;

                // Mô tả chương
                const chapterDesc = this.add.text(140, y, chapter.description, {
                    font: '18px Arial',
                    color: '#333',
                    wordWrap: { width: this.scale.width - 220 }
                });
                content.add(chapterDesc);

                y += chapterDesc.height + 12;

                // Tiêu đề bài học
                const lessonTitle = this.add.text(140, y, 'Bài học:', {
                    font: 'bold 20px Arial',
                    color: '#0a5'
                });
                content.add(lessonTitle);

                y += 28;

                // Danh sách bài học
                chapter.lessons.forEach((lesson, lidx) => {
                    const lessonText = this.add.text(170, y, lesson.title, {
                        font: '20px Arial',
                        color: '#007bff',
                        fontStyle: 'underline',
                        align: 'left'
                    })
                    .setInteractive({ useHandCursor: true })
                    .on('pointerdown', () => {
                        this.scene.start('IntroMathC1L1', { lesson });
                    });
                    content.add(lessonText);

                    y += lessonText.height + lessonDescSpacing;

                    const lessonDesc = this.add.text(190, y, lesson.description, {
                        font: '16px Arial',
                        color: '#444',
                        wordWrap: { width: this.scale.width - 240 }
                    });
                    content.add(lessonDesc);

                    y += lessonDesc.height + lessonSpacing;
                });

                y += chapterSpacing;
            });
            
            // Nút cuộn
            this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
                if (content.y - deltaY * 0.5 <= 0 && content.y - deltaY * 0.5 >= -(y - this.scale.height + 150)) {
                    content.y -= deltaY * 0.5;
                }
            });
            
            // Thanh cuộn (scrollbar)
            const scrollTrack = this.add.rectangle(this.scale.width - 30, this.scale.height/2, 10, this.scale.height - 200, 0xdddddd, 0.8)
                .setOrigin(0.5);
                
            const scrollHeight = Math.max(80, (this.scale.height - 200) * (this.scale.height - 200) / y);
            const scrollThumb = this.add.rectangle(this.scale.width - 30, 120, 10, scrollHeight, 0x0a5a0a, 1)
                .setOrigin(0.5, 0)
                .setInteractive({ draggable: true });
                
            scrollThumb.on('drag', (pointer, dragX, dragY) => {
                const minY = 120;
                const maxY = this.scale.height - 80 - scrollHeight;
                const newY = Phaser.Math.Clamp(dragY, minY, maxY);
                scrollThumb.y = newY;
                
                const scrollPercent = (newY - minY) / (maxY - minY);
                content.y = -scrollPercent * (y - (this.scale.height - 200));
            });
        } else {
            this.add.text(this.scale.width/2, this.scale.height/2, 'Không có dữ liệu!', {
                font: 'bold 24px Arial',
                color: '#f00',
                align: 'center'
            }).setOrigin(0.5);
        }

        // Tạo nút Back với hiệu ứng
        const backButton = this.add.image(80, this.scale.height - 60, 'button')
            .setDisplaySize(120, 40)
            .setInteractive({ useHandCursor: true });
            
        const backText = this.add.text(80, this.scale.height - 60, 'BACK', {
            font: 'bold 18px Arial',
            color: '#fff',
            align: 'center'
        }).setOrigin(0.5);
        
        // Hiệu ứng hover
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
        
        // Xử lý sự kiện quay lại
        backButton.on('pointerdown', () => {
            backButton.setTint(0x888888);
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.router.goTo('introduction', {});
                this.scene.stop();
            });
        });
    }
    
    update() {
        // Update logic nếu cần
    }
}