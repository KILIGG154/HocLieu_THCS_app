import Phaser from 'phaser';
import { AppRouter } from '../router/AppRouter';

export class History3 extends Phaser.Scene {
    constructor() {
        super({ key: 'History3' });
    }

    preload() {
        // Đảm bảo load đúng đường dẫn background (tuyệt đối từ public)
        this.load.image('bgr', '/assets/background.jpg');
        this.load.image('aulang1', '/assets/aulang1.jpeg');
        this.load.image('aulang2', '/assets/aulang2.jpg');
    }

    create() {
        this.router = new AppRouter(this.game);
        // Câu hỏi 1
        const q1 = this.add.text(this.scale.width/2, 100, 'Theo các em, triều đại nào là triều đại đầu tiên của nước Việt Nam mình ?', {
            font: 'bold 28px Arial',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: this.scale.width - 120 }
        }).setOrigin(0.5);

        // Input cho câu 1
        const input1 = document.createElement('input');
        input1.type = 'text';
        input1.placeholder = 'Nhập đáp án bằng LaTeX...';
        input1.style.position = 'absolute';
        input1.style.left = (this.game.canvas.getBoundingClientRect().left + this.scale.width/2 - 240) + 'px';
        input1.style.top = (this.game.canvas.getBoundingClientRect().top + 150) + 'px';
        input1.style.width = '400px';
        input1.style.fontSize = '20px';
        input1.style.padding = '10px';
        input1.style.borderRadius = '8px';
        input1.style.border = '1px solid #1976d2';
        input1.style.zIndex = 1000;
        document.body.appendChild(input1);

        // Tóm tắt và hình ảnh cho câu 1 (ẩn ban đầu)
        const summary1 = this.add.text(this.scale.width/2, 300,
            'Văn Lang là quốc gia đầu tiên của người Việt cổ, hình thành khoảng thế kỷ 7 TCN. Đứng đầu là các vua Hùng, đất nước chia thành nhiều bộ lạc. Văn Lang nổi bật với nền văn hóa Đông Sơn, phát triển nghề trồng lúa nước, đúc đồng, làm trống đồng, và có tín ngưỡng thờ cúng tổ tiên. Đây là nền tảng cho sự phát triển lâu dài của dân tộc Việt Nam.',
            {
                font: '20px Arial',
                fill: '#ffe066',
                align: 'center',
                wordWrap: { width: 700 },
                lineSpacing: 8
            }
        ).setOrigin(0.5).setVisible(false);
        const img1 = this.add.image(this.scale.width/2 - 160, 500, 'aulang1').setDisplaySize(320, 220).setOrigin(0.5).setVisible(false);
        const img2 = this.add.image(this.scale.width/2 + 160, 500, 'aulang2').setDisplaySize(240, 220).setOrigin(0.5).setVisible(false);

        // Nút tiếp theo (ẩn ban đầu)
        const nextBtn = this.add.text(this.scale.width/2, 660, 'Tiếp theo', {
            font: 'bold 22px Arial',
            fill: '#1976d2',
            backgroundColor: '#fff',
            padding: { left: 24, right: 24, top: 10, bottom: 10 },
            borderRadius: 10
        }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setVisible(false);

        // Câu hỏi 2 (ẩn ban đầu)
        const q2 = this.add.text(this.scale.width/2, 100, 'Theo các em, ai là vua nước Văn Lang ?', {
            font: 'bold 28px Arial',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: 700 }
        }).setOrigin(0.5).setVisible(false);

        // Input cho câu 2 (ẩn ban đầu)
        const input2 = document.createElement('input');
        input2.type = 'text';
        input2.placeholder = 'Nhập đáp án bằng LaTeX...';
        input2.style.position = 'absolute';
        input2.style.left = (this.game.canvas.getBoundingClientRect().left + this.scale.width/2 - 260) + 'px';
        input2.style.top = (this.game.canvas.getBoundingClientRect().top + 150) + 'px';
        input2.style.width = '400px';
        input2.style.fontSize = '20px';
        input2.style.padding = '10px';
        input2.style.borderRadius = '8px';
        input2.style.border = '1px solid #1976d2';
        input2.style.zIndex = 1000;
        input2.style.display = 'none';
        document.body.appendChild(input2);

        // Tóm tắt cho câu 2 (ẩn ban đầu)
        const summary2 = this.add.text(this.scale.width/2, 330,
            'Hùng Vương là danh hiệu chung cho các vị vua trị vì nước Văn Lang – nhà nước đầu tiên của người Việt cổ. Theo truyền thuyết, Lạc Long Quân và Âu Cơ sinh ra 100 người con, người con trưởng lên núi và trở thành vua Hùng. Thời kỳ Hùng Vương kéo dài từ khoảng 2879 TCN đến 258 TCN, gồm 18 đời vua Hùng.',
            {
                font: '20px Arial',
                fill: '#ffe066',
                align: 'center',
                wordWrap: { width: 700 },
                lineSpacing: 8
            }
        ).setOrigin(0.5).setVisible(false);

        // Lắng nghe trả lời câu 1
        input1.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const value = input1.value.trim().toLowerCase();
                if (value === 'văn lang' || value === 'van lang') {
                    input1.style.background = '#4caf50';
                    input1.style.color = '#fff';
                    summary1.setVisible(true);
                    img1.setVisible(true);
                    img2.setVisible(true);
                    nextBtn.setVisible(true);
                    input1.disabled = true;
                } else {
                    input1.style.background = '#d7263d';
                    input1.style.color = '#fff';
                    summary1.setVisible(false);
                    img1.setVisible(false);
                    img2.setVisible(false);
                    nextBtn.setVisible(false);
                }
            } else {
                input1.style.background = '';
                input1.style.color = '';
            }
        });

        // Sự kiện nút tiếp theo
        nextBtn.on('pointerdown', () => {
            q1.setVisible(false);
            input1.style.display = 'none';
            summary1.setVisible(false);
            img1.setVisible(false);
            img2.setVisible(false);
            nextBtn.setVisible(false);
            q2.setVisible(true);
            input2.style.display = '';
            input2.focus();
        });

        // Lắng nghe trả lời câu 2
        input2.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const value = input2.value.trim().toLowerCase();
                // Chấp nhận cả đáp án có khoảng trắng đầu/cuối, không phân biệt hoa thường, và cả trường hợp có dấu cách giữa các từ
                if (
                    value === 'hùng vương' ||
                    value === 'hung vuong' ||
                    value === 'trang vuong' ||
                    value === 'trang vương' ||
                    value.replace(/\s+/g, ' ').trim() === 'hùng vương' // Thêm điều kiện cho " Hùng Vương "
                ) {
                    input2.style.background = '#4caf50';
                    input2.style.color = '#fff';
                    summary2.setVisible(true);
                    videoEl.style.display = '';
                    videoEl.currentTime = 0;
                    videoEl.play();
                } else {
                    input2.style.background = '#d7263d';
                    input2.style.color = '#fff';
                    summary2.setVisible(false);
                    videoEl.style.display = 'none';
                }
            } else {
                input2.style.background = '';
                input2.style.color = '';
                summary2.setVisible(false);
                videoEl.style.display = 'none';
            }
        });

        // Thêm video (ẩn ban đầu)
        const videoEl = document.createElement('video');
        videoEl.src = '/video/hungvuong.mp4';
        videoEl.controls = true;
        videoEl.autoplay = true; // Tự động phát khi hiển thị
        videoEl.muted = false; // Đảm bảo autoplay hoạt động trên trình duyệt hiện đại
        videoEl.style.position = 'absolute';
        videoEl.style.left = (this.game.canvas.getBoundingClientRect().left + this.scale.width/2 - 290) + 'px';
        videoEl.style.top = (this.game.canvas.getBoundingClientRect().top + 380) + 'px';
        videoEl.style.width = '480px';
        videoEl.style.height = '270px';
        videoEl.style.borderRadius = '12px';
        videoEl.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)';
        videoEl.style.zIndex = 1000;
        videoEl.style.display = 'none';
        document.body.appendChild(videoEl);

        // Xử lý khi scene shutdown thì xóa input và video
        this.events.on('shutdown', () => { input1.remove(); input2.remove(); videoEl.remove(); });
        this.events.on('destroy', () => { input1.remove(); input2.remove(); videoEl.remove(); });
    }

    update() {
        // Cập nhật nếu cần thiết
    }
}