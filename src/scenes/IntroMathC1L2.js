import Phaser from 'phaser';

export class IntroMathC1L2 extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroMathC1L2' });
    }

    preload() {
        // Đảm bảo load background đúng cách
        this.load.image('background', 'assets/background.jpg');
    }

    create() {
        // Thêm background giống IntroMathC1L1
        this.bg = this.add.image(512, 384, 'background').setDisplaySize(1024, 768);
        // Danh sách 7 hằng đẳng thức đáng nhớ
        this.identities = [
            {
                expr: '(a + b)^2',
                result: 'a^2 + 2ab + b^2',
                explain: '(a + b)^2 = a^2 + 2ab + b^2'
            },
            {
                expr: '(a - b)^2',
                result: 'a^2 - 2ab + b^2',
                explain: '(a - b)^2 = a^2 - 2ab + b^2'
            },
            {
                expr: '(a - b)(a + b)',
                result: 'a^2 - b^2',
                explain: '(a - b)(a + b) = a^2 - b^2'
            },
            {
                expr: '(a + b)^3',
                result: 'a^3 + 3a^2b + 3ab^2 + b^3',
                explain: '(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3'
            },
            {
                expr: '(a - b)^3',
                result: 'a^3 - 3a^2b + 3ab^2 - b^3',
                explain: '(a - b)^3 = a^3 - 3a^2b + 3ab^2 - b^3'
            },
            {
                expr: 'a^3 + b^3',
                result: '(a + b)(a^2 - ab + b^2)',
                explain: 'a^3 + b^3 = (a + b)(a^2 - ab + b^2)'
            },
            {
                expr: 'a^3 - b^3',
                result: '(a - b)(a^2 + ab + b^2)',
                explain: 'a^3 - b^3 = (a - b)(a^2 + ab + b^2)'
            }
        ];

        // Hiển thị khung và 7 hằng đẳng thức ở giữa trang (đưa xuống dưới 1 chút)
        const boxWidth = 700;
        const boxHeight = 7 * 38 + 40;
        const boxX = (1024 - boxWidth) / 2;
        const boxY = 200; // tăng từ 120 lên 180 để xuống dưới
        // Vẽ khung
        const graphics = this.add.graphics();
        graphics.lineStyle(4, 0x1976d2, 1);
        graphics.fillStyle(0xf0f8ff, 0.95);
        graphics.fillRoundedRect(boxX, boxY, boxWidth, boxHeight, 18);
        graphics.strokeRoundedRect(boxX, boxY, boxWidth, boxHeight, 18);
        // Tiêu đề
        this.add.text(512, boxY - 40, '7 HẰNG ĐẲNG THỨC ĐÁNG NHỚ', { font: 'bold 32px Arial', color: '#000', fontStyle: 'bold' }).setOrigin(0.5);
        // Hiển thị 7 hằng đẳng thức ở giữa khung
        this.identities.forEach((id, idx) => {
            this.add.text(512, boxY + 24 + idx * 38, `${idx + 1}. ${id.explain}`, { font: '22px Arial', color: '#222' }).setOrigin(0.5);
        });
        // Nút Củng cố kiến thức
        this.practiceBtn = this.add.text(512, boxY + boxHeight + 40, 'Củng cố kiến thức', {
            font: 'bold 26px Arial',
            color: '#fff',
            backgroundColor: '#4CAF50',
            padding: 16,
            borderRadius: 10
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => {
            this.practiceBtn.setStyle({ backgroundColor: '#43a047', color: '#ffe066' });
            this.tweens.add({ targets: this.practiceBtn, scale: 1.08, duration: 100 });
        })
        .on('pointerout', () => {
            this.practiceBtn.setStyle({ backgroundColor: '#4CAF50', color: '#fff' });
            this.tweens.add({ targets: this.practiceBtn, scale: 1, duration: 100 });
        })
        .on('pointerdown', () => {
            this.startGame();
        });
    }

    startGame() {
        // Xóa các text cũ nhưng giữ lại background
        this.children.removeAll();
        this.bg = this.add.image(512, 384, 'background').setDisplaySize(1024, 768);
        // Vẽ lại đồng hồ đếm thời gian (chỉ xuất hiện khi vào game)
        this.timerTextBg = this.add.graphics();
        this.timerTextBg.fillStyle(0xffe066, 0.95);
        this.timerTextBg.fillRoundedRect(740, 40, 180, 48, 18);
        this.timerTextBg.lineStyle(4, 0xff3333, 1);
        this.timerTextBg.strokeRoundedRect(740, 40, 180, 48, 18);
        this.timerText = this.add.text(830, 64, '', {
            font: 'bold 28px Arial',
            color: '#d7263d',
            fontStyle: 'bold',
            align: 'center',
            shadow: { offsetX: 2, offsetY: 2, color: '#fff', blur: 4, fill: true }
        }).setOrigin(0.5);
        this.current = 0;
        this.timer = null;
        this.timeLeft = 10;
        this.timerText.setVisible(true);
        this.nextQuestion();
    }

    nextQuestion() {
        if (this.currentText) this.currentText.destroy();
        if (this.answerBtns) this.answerBtns.forEach(btn => btn.destroy());
        if (this.explainText) this.explainText.destroy();
        if (this.timer) this.timer.remove();
        this.timeLeft = 10;
        this.updateTimerText();
        if (this.current === 7) {
            // Xóa toàn bộ đáp án và câu hỏi còn lại
            if (this.currentText) this.currentText.destroy();
            if (this.answerBtns) this.answerBtns.forEach(btn => { btn.destroy(); });
            // Xóa layout đáp án (nền đáp án)
            if (this.answerBtnBgs) this.answerBtnBgs.forEach(bg => bg.destroy());
            // Ẩn đồng hồ
            this.timerText.setVisible(false);
            this.timerTextBg.clear();
            // Hiển thị thông báo hoàn thành nổi bật, căn giữa
            this.explainText = this.add.text(512, 400, `🎉 Hoàn thành trò chơi!`, {
                font: 'bold 32px Arial',
                color: '#fff',
                backgroundColor: '#43a047',
                padding: { left: 24, right: 24, top: 18, bottom: 18 },
                align: 'center',
                fontStyle: 'bold',
                borderRadius: 16,
                shadow: { offsetX: 2, offsetY: 2, color: '#222', blur: 6, fill: true },
                lineSpacing: 10
            }).setOrigin(0.5);
            return;
        }

        // Lấy câu hỏi ngẫu nhiên chưa hỏi
        if (!this.usedIdxs) this.usedIdxs = [];
        let idx;
        do {
            idx = Phaser.Math.Between(0, 6);
        } while (this.usedIdxs.includes(idx));
        this.usedIdxs.push(idx);
        const q = this.identities[idx];
        this.current++;

        // Sinh đáp án sai
        let wrongs = this.identities.filter((id, i) => i !== idx).map(id => id.result);
        Phaser.Utils.Array.Shuffle(wrongs);
        let choices = [q.result, wrongs[0], wrongs[1]];
        Phaser.Utils.Array.Shuffle(choices);

        // Hiển thị câu hỏi
        this.currentText = this.add.text(180, 140, `Câu ${this.current}: Biểu thức nào là kết quả của ${q.expr} ?`, {
            font: 'bold 26px Arial', color: '#222', backgroundColor: '#fffbe6', padding: 10
        });

        // Hiển thị đáp án (layout đẹp hơn, căn giữa, bo góc, spacing đều)
        const answerBoxWidth = 520;
        const answerBoxHeight = 60;
        const answerBoxYStart = 260;
        const answerBoxSpacing = 30;
        this.answerBtnBgs = [];
        this.answerBtns = choices.map((ans, i) => {
            let btnBg = this.add.graphics();
            this.answerBtnBgs.push(btnBg);
            let y = answerBoxYStart + i * (answerBoxHeight + answerBoxSpacing);
            btnBg.fillStyle(0x1976d2, 1);
            btnBg.fillRoundedRect(252, y, answerBoxWidth, answerBoxHeight, 16);
            btnBg.lineStyle(2, 0x0a5, 0.7);
            btnBg.strokeRoundedRect(252, y, answerBoxWidth, answerBoxHeight, 16);
            let btn = this.add.text(512, y + answerBoxHeight/2, ans, {
                font: 'bold 24px Arial',
                color: '#fff',
                align: 'center',
                wordWrap: { width: answerBoxWidth - 40 }
            }).setOrigin(0.5);
            btn.setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                btnBg.clear();
                btnBg.fillStyle(0x1565c0, 1);
                btnBg.fillRoundedRect(252, y, answerBoxWidth, answerBoxHeight, 16);
                btnBg.lineStyle(2, 0xffe066, 1);
                btnBg.strokeRoundedRect(252, y, answerBoxWidth, answerBoxHeight, 16);
                btn.setColor('#ffe066');
                this.tweens.add({ targets: btn, scale: 1.08, duration: 100 });
            })
            .on('pointerout', () => {
                btnBg.clear();
                btnBg.fillStyle(0x1976d2, 1);
                btnBg.fillRoundedRect(252, y, answerBoxWidth, answerBoxHeight, 16);
                btnBg.lineStyle(2, 0x0a5, 0.7);
                btnBg.strokeRoundedRect(252, y, answerBoxWidth, answerBoxHeight, 16);
                btn.setColor('#fff');
                this.tweens.add({ targets: btn, scale: 1, duration: 100 });
            })
            .on('pointerdown', () => this.checkAnswer(ans, q));
            // Để disable dễ dàng
            btn.disableBg = () => btnBg.clear();
            return btn;
        });
        // Bắt đầu countdown
        this.timer = this.time.addEvent({
            delay: 1000,
            repeat: 9,
            callback: () => {
                this.timeLeft--;
                this.updateTimerText();
                if (this.timeLeft === 0) {
                    this.timer.remove();
                    this.showTimeUp(q);
                }
            }
        });
    }

    updateTimerText() {
        this.timerText.setText('⏰ ' + this.timeLeft + ' giây');
        if (this.timeLeft <= 3) {
            this.timerText.setColor('#fff');
            this.timerTextBg.clear();
            this.timerTextBg.fillStyle(0xff3333, 1);
            this.timerTextBg.fillRoundedRect(740, 40, 180, 48, 18);
            this.timerTextBg.lineStyle(4, 0xffe066, 1);
            this.timerTextBg.strokeRoundedRect(740, 40, 180, 48, 18);
            this.tweens.add({ targets: this.timerText, scale: 1.3, yoyo: true, duration: 200, repeat: 1 });
        } else {
            this.timerText.setColor('#d7263d');
            this.timerTextBg.clear();
            this.timerTextBg.fillStyle(0xffe066, 0.95);
            this.timerTextBg.fillRoundedRect(740, 40, 180, 48, 18);
            this.timerTextBg.lineStyle(4, 0xff3333, 1);
            this.timerTextBg.strokeRoundedRect(740, 40, 180, 48, 18);
            this.timerText.setScale(1);
        }
    }

    checkAnswer(ans, q) {
        if (this.timer) this.timer.remove();
        this.answerBtns.forEach(btn => btn.disableInteractive());
        // Tính vị trí dưới đáp án
        const answerBoxYStart = 260;
        const answerBoxHeight = 60;
        const answerBoxSpacing = 30;
        const y = answerBoxYStart + 3 * (answerBoxHeight + answerBoxSpacing) + 20;
        if (ans === q.result) {
            this.explainText = this.add.text(512, y, '✔️ Chính xác! Tiếp tục...', {
                font: 'bold 26px Arial',
                color: '#fff',
                backgroundColor: '#43a047',
                padding: { left: 18, right: 18, top: 8, bottom: 8 },
                align: 'center',
                fontStyle: 'bold',
                borderRadius: 10,
                shadow: { offsetX: 2, offsetY: 2, color: '#222', blur: 6, fill: true }
            }).setOrigin(0.5);
            this.time.delayedCall(900, () => {
                this.explainText.destroy();
                this.nextQuestion();
            });
        } else {
            this.explainText = this.add.text(512, y, `❌ Sai rồi! ${q.explain}`, {
                font: 'bold 26px Arial',
                color: '#fff',
                backgroundColor: '#d7263d',
                padding: { left: 18, right: 18, top: 8, bottom: 8 },
                align: 'center',
                fontStyle: 'bold',
                borderRadius: 10,
                shadow: { offsetX: 2, offsetY: 2, color: '#222', blur: 6, fill: true }
            }).setOrigin(0.5);
            this.time.delayedCall(1200, () => {
                this.explainText.destroy();
                this.nextQuestion();
            });
        }
    }

    showTimeUp(q) {
        this.answerBtns.forEach(btn => btn.disableInteractive());
        // Hiển thị thông báo hết thời gian nổi bật dưới đáp án
        const answerBoxYStart = 260;
        const answerBoxHeight = 60;
        const answerBoxSpacing = 30;
        const y = answerBoxYStart + 3 * (answerBoxHeight + answerBoxSpacing) + 20;
        this.explainText = this.add.text(512, y, `⏰ Hết thời gian! Đáp án đúng: ${q.result}`, {
            font: 'bold 26px Arial',
            color: '#fff',
            backgroundColor: '#ff6600',
            padding: { left: 18, right: 18, top: 8, bottom: 8 },
            align: 'center',
            fontStyle: 'bold',
            borderRadius: 10,
            shadow: { offsetX: 2, offsetY: 2, color: '#222', blur: 6, fill: true }
        }).setOrigin(0.5);
        this.time.delayedCall(1200, () => {
            this.explainText.destroy();
            this.nextQuestion();
        });
    }
}