import Phaser from 'phaser';

export class QuadraticFunction extends Phaser.Scene {
    constructor() {
        super({ key: 'QuadraticFunction' });
    }

    preload() {
        this.load.image('background', '/assets/background.jpg');
    }

    create() {
        // Thêm background
        this.bg = this.add.image(0, 0, 'background')
            .setOrigin(0)
            .setDisplaySize(this.scale.width, this.scale.height);

        // Tiêu đề bài học
        this.add.text(this.scale.width/2, 100, 'HÀM SỐ BẬC HAI', {
            font: 'bold 36px Arial',
            color: '#1976d2',
            align: 'center',
            stroke: '#fff',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Label hướng dẫn nhập công thức
        this.add.text(this.scale.width/2, 140, 'Nhập công thức hàm số bậc hai:', {
            font: '20px Arial', color: '#000', align: 'center'
        }).setOrigin(0.5);

        // Ô nhập LaTeX bằng HTML DOM Element
        this.latexInput = this.add.dom(this.scale.width/2, 200, 'input', 'width:420px; height:38px; font-size:22px; padding:6px; border-radius:8px; border:1px solid #1976d2;', '');
        this.latexInput.node.placeholder = 'Nhập công thức dạng y = ax^2 + bx + c';

        // (Bạn có thể thêm sự kiện xử lý nhập liệu ở đây nếu muốn)

        // Nút quay lại với border radius và hover
        const btnWidth = 140;
        const btnHeight = 44;
        const btnX = 60;
        const btnY = this.scale.height - 60;
        const btnRadius = 8;

        // Vẽ nút bằng graphics để bo góc
        const backBtnGfx = this.add.graphics();
        backBtnGfx.fillStyle(0x1976d2, 1);
        backBtnGfx.fillRoundedRect(btnX, btnY - btnHeight/2, btnWidth, btnHeight, btnRadius);
        backBtnGfx.lineStyle(2, 0xffffff, 1);
        backBtnGfx.strokeRoundedRect(btnX, btnY - btnHeight/2, btnWidth, btnHeight, btnRadius);
        backBtnGfx.setInteractive(new Phaser.Geom.Rectangle(btnX, btnY - btnHeight/2, btnWidth, btnHeight), Phaser.Geom.Rectangle.Contains);
        backBtnGfx.setDepth(1);

        const backText = this.add.text(btnX + 16, btnY, '< Quay lại', {
            font: 'bold 22px Arial',
            color: '#fff',
            align: 'center'
        }).setOrigin(0, 0.5).setDepth(2);

        // Hiệu ứng hover
        backBtnGfx.on('pointerover', () => {
            backBtnGfx.clear();
            backBtnGfx.fillStyle(0xff9999, 1);
            backBtnGfx.fillRoundedRect(btnX, btnY - btnHeight/2, btnWidth, btnHeight, btnRadius);
            backBtnGfx.lineStyle(2, 0xffffff, 1);
            backBtnGfx.strokeRoundedRect(btnX, btnY - btnHeight/2, btnWidth, btnHeight, btnRadius);
            this.tweens.add({
                targets: [backText],
                scaleX: 1.06,
                scaleY: 1.06,
                duration: 100
            });
        });
        backBtnGfx.on('pointerout', () => {
            backBtnGfx.clear();
            backBtnGfx.fillStyle(0x1976d2, 1);
            backBtnGfx.fillRoundedRect(btnX, btnY - btnHeight/2, btnWidth, btnHeight, btnRadius);
            backBtnGfx.lineStyle(2, 0xffffff, 1);
            backBtnGfx.strokeRoundedRect(btnX, btnY - btnHeight/2, btnWidth, btnHeight, btnRadius);
            this.tweens.add({
                targets: [backText],
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
        });
        backBtnGfx.on('pointerdown', () => {
            this.cameras.main.fade(400, 0, 0, 0);
            this.time.delayedCall(400, () => {
                this.scene.start('Grade9');
            });
        });

        // Khung vẽ đồ thị
        this.chartBg = this.add.rectangle(this.scale.width/2, 420, 500, 320, 0xf8f8ff, 0.98)
            .setStrokeStyle(2, 0x1976d2)
            .setOrigin(0.5);
        this.add.text(this.scale.width/2, 250, 'Biểu đồ hàm số', { font: 'bold 22px Arial', color: '#000' }).setOrigin(0.5);

        // Lắng nghe sự kiện nhập công thức
        this.latexInput.node.addEventListener('change', () => this.drawChart());
        this.latexInput.node.addEventListener('keyup', () => this.drawChart());
    }

    // Hàm vẽ đồ thị hàm số bậc hai dạng y = ax^2 + bx + c
    drawChart() {
        if (this.chartGraphics) this.chartGraphics.destroy();
        if (this.axisLabels) this.axisLabels.forEach(lbl => lbl.destroy());
        this.axisLabels = [];
        const input = this.latexInput.node.value.trim();
        // Phân tích công thức dạng y = ax^2 + bx + c
        const match = input.match(/^y\s*=\s*([+-]?\d*\.?\d*)x\^2\s*([+-]\s*\d*\.?\d*)x?\s*([+-]\s*\d+\.?\d*)?$/i);
        if (!match) {
            this.chartGraphics = this.add.text(this.scale.width/2, 420, 'Chỉ hỗ trợ vẽ hàm số dạng y = ax^2 + bx + c', { font: '20px Arial', color: '#f00' }).setOrigin(0.5);
            return;
        }
        let a = parseFloat(match[1]);
        if (isNaN(a)) a = 1;
        let b = 0;
        if (match[2]) b = parseFloat(match[2].replace(/\s/g, ''));
        let c = 0;
        if (match[3]) c = parseFloat(match[3].replace(/\s/g, ''));
        // Vẽ trục và đồ thị
        this.chartGraphics = this.add.graphics();
        const cx = this.scale.width/2, cy = 420, w = 400, h = 240;
        // Trục Ox
        this.chartGraphics.lineStyle(2, 0x888888);
        this.chartGraphics.strokeLineShape(new Phaser.Geom.Line(cx - w/2, cy, cx + w/2, cy));
        // Trục Oy
        this.chartGraphics.strokeLineShape(new Phaser.Geom.Line(cx, cy - h/2, cx, cy + h/2));
        // Gốc tọa độ
        this.chartGraphics.fillStyle(0x1976d2, 1);
        this.chartGraphics.fillCircle(cx, cy, 4);
        // Mũi tên trục Ox
        this.chartGraphics.fillTriangle(cx + w/2, cy, cx + w/2 - 12, cy - 6, cx + w/2 - 12, cy + 6);
        // Mũi tên trục Oy
        this.chartGraphics.fillTriangle(cx, cy - h/2, cx - 6, cy - h/2 + 12, cx + 6, cy - h/2 + 12);
        // Vẽ vạch chia và số trên trục Ox
        for (let i = -10; i <= 10; i += 2) {
            const x = cx + i * (w/20);
            this.chartGraphics.lineStyle(1, 0x888888);
            this.chartGraphics.strokeLineShape(new Phaser.Geom.Line(x, cy - 5, x, cy + 5));
            if (i !== 0) {
                this.axisLabels.push(this.add.text(x, cy + 10, i.toString(), { font: '16px Arial', color: '#1976d2' }).setOrigin(0.5, 0));
            }
        }
        // Vẽ vạch chia và số trên trục Oy
        for (let j = -6; j <= 6; j += 2) {
            const y = cy - j * (h/12);
            this.chartGraphics.lineStyle(1, 0x888888);
            this.chartGraphics.strokeLineShape(new Phaser.Geom.Line(cx - 5, y, cx + 5, y));
            if (j !== 0) {
                this.axisLabels.push(this.add.text(cx - 12, y, j.toString(), { font: '16px Arial', color: '#1976d2' }).setOrigin(1, 0.5));
            }
        }
        // Vẽ đồ thị hàm số bậc hai
        this.chartGraphics.lineStyle(3, 0x1976d2);
        let prev = null;
        for (let i = -200; i <= 200; i++) {
            let x = i * 0.05; // x chạy từ -10 đến 10
            let y = a * x * x + b * x + c;
            if (y < -6 || y > 6) {
                prev = null;
                continue;
            }
            let px = cx + x * (w/20);
            let py = cy - y * (h/12);
            if (prev) {
                this.chartGraphics.strokeLineShape(new Phaser.Geom.Line(prev.px, prev.py, px, py));
            }
            prev = { px, py };
        }
        // Vẽ nhãn trục
        this.axisLabels.push(this.add.text(cx + w/2 + 18, cy - 10, 'x', { font: '18px Arial', color: '#1976d2' }).setOrigin(0, 0.5));
        this.axisLabels.push(this.add.text(cx + 10, cy - h/2 - 18, 'y', { font: '18px Arial', color: '#1976d2' }).setOrigin(0, 1));
    }
}
