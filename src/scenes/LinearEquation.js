import Phaser from 'phaser';

export class LinearEquation extends Phaser.Scene {
    constructor() {
        super({ key: 'LinearEquation' });
    }

    create() {
        this.add.text(512, 80, 'Ôn tập hàm số bậc nhất', {
            font: 'bold 32px Arial', color: '#ffffff', align: 'center'
        }).setOrigin(0.5);
        this.add.text(512, 140, 'Nhập công thức hàm số bậc nhất:', {
            font: '20px Arial', color: '#000000', align: 'center'
        }).setOrigin(0.5);

        // Tạo một ô nhập LaTeX bằng HTML DOM Element
        this.latexInput = this.add.dom(512, 200, 'input', 'width:400px; height:36px; font-size:22px; padding:6px; border-radius:8px; border:1px solid #1976d2;', '');
        this.latexInput.node.placeholder = 'Nhập công thức LaTeX ở đây...';

        // Tạo một vùng canvas để vẽ biểu đồ
        this.chartBg = this.add.rectangle(512, 420, 500, 320, 0xf8f8ff, 0.98).setStrokeStyle(2, 0x1976d2).setOrigin(0.5);
        this.add.text(512, 250, 'Biểu đồ hàm số', { font: 'bold 22px Arial', color: '#000000' }).setOrigin(0.5);

        // Lắng nghe sự kiện nhập công thức
        this.latexInput.node.addEventListener('change', () => this.drawChart());
        this.latexInput.node.addEventListener('keyup', () => this.drawChart());
    }

    // Hàm vẽ biểu đồ đơn giản cho hàm số bậc nhất dạng y = ax + b
    drawChart() {
        if (this.chartGraphics) this.chartGraphics.destroy();
        if (this.axisLabels) this.axisLabels.forEach(lbl => lbl.destroy());
        this.axisLabels = [];
        const input = this.latexInput.node.value.trim();
        // Phân tích công thức dạng y = ax + b
        const match = input.match(/^y\s*=\s*([+-]?\d*\.?\d*)x\s*([+-]\s*\d+\.?\d*)?$/i);
        if (!match) {
            this.chartGraphics = this.add.text(512, 420, 'Chỉ hỗ trợ vẽ hàm số dạng y = ax + b', { font: '20px Arial', color: '#f00' }).setOrigin(0.5);
            return;
        }
        let a = parseFloat(match[1]);
        if (isNaN(a)) a = 1;
        let b = 0;
        if (match[2]) b = parseFloat(match[2].replace(/\s/g, ''));
        // Vẽ trục và đồ thị
        this.chartGraphics = this.add.graphics();
        const cx = 512, cy = 420, w = 400, h = 240;
        // Trục Ox
        this.chartGraphics.lineStyle(2, 0x888888);
        this.chartGraphics.strokeLineShape(new Phaser.Geom.Line(cx - w/2, cy, cx + w/2, cy));
        // Trục Oy
        this.chartGraphics.strokeLineShape(new Phaser.Geom.Line(cx, cy - h/2, cx, cy + h/2));
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
        // Vẽ hàm số: chỉ vẽ đoạn nằm trong khung
        this.chartGraphics.lineStyle(3, 0x1976d2);
        // Tìm các điểm cắt biên khung (x trong [-10,10], y trong [-6,6])
        let points = [];
        // Xét các biên x = -10, x = 10
        for (let x of [-10, 10]) {
            let y = a * x + b;
            if (y >= -6 && y <= 6) points.push({ x, y });
        }
        // Xét các biên y = -6, y = 6
        for (let y of [-6, 6]) {
            let x = (y - b) / a;
            if (x >= -10 && x <= 10) points.push({ x, y });
        }
        // Nếu có ít nhất 2 điểm nằm trong khung thì vẽ đoạn thẳng nối 2 điểm đó
        if (points.length >= 2) {
            // Loại bỏ trùng lặp
            points = points.filter((p, idx, arr) => arr.findIndex(q => Math.abs(q.x - p.x) < 1e-6 && Math.abs(q.y - p.y) < 1e-6) === idx);
            // Sắp xếp theo x tăng dần
            points.sort((p1, p2) => p1.x - p2.x);
            const px1 = cx + points[0].x * (w/20);
            const py1 = cy - points[0].y * (h/12);
            const px2 = cx + points[1].x * (w/20);
            const py2 = cy - points[1].y * (h/12);
            this.chartGraphics.strokeLineShape(new Phaser.Geom.Line(px1, py1, px2, py2));
        }
        // Vẽ nhãn trục
        this.axisLabels.push(this.add.text(cx + w/2 + 18, cy - 10, 'x', { font: '18px Arial', color: '#1976d2' }).setOrigin(0, 0.5));
        this.axisLabels.push(this.add.text(cx + 10, cy - h/2 - 18, 'y', { font: '18px Arial', color: '#1976d2' }).setOrigin(0, 1));
    }
}
