import Phaser from 'phaser';

export class IntroMathC1L3 extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroMathC1L3' });
    }

    preload() {
        this.load.image('background', 'assets/background.jpg');

    }

    create() {
        this.bg = this.add.image(512, 384, 'background').setDisplaySize(1024, 768);
        // Tiêu đề
        this.add.text(512, 150, 'Liên hệ giữa phép nhân và phép khai phương', {
            font: 'bold 32px Arial', color: '#1976d2', fontStyle: 'bold', align: 'center'
        }).setOrigin(0.5);
        // Khái niệm
        const concept =
            'Nếu a ≥ 0, b ≥ 0 thì:\n' +
            '√(a × b) = √a × √b\n' +
            'Quy tắc này giúp ta tách biểu thức dưới dấu căn thành tích các căn bậc hai nhỏ hơn.';
        const boxWidth = 700, boxHeight = 160, boxX = 162, boxY = 210;
        const graphics = this.add.graphics();
        graphics.lineStyle(4, 0x1976d2, 1);
        graphics.fillStyle(0xf0f8ff, 0.97);
        graphics.fillRoundedRect(boxX, boxY, boxWidth, boxHeight, 18);
        graphics.strokeRoundedRect(boxX, boxY, boxWidth, boxHeight, 18);
        this.add.text(512, boxY + 30, 'Khái niệm', { font: 'bold 26px Arial', color: '#1976d2' }).setOrigin(0.5);
        this.add.text(512, boxY + 90, concept, {
            font: '22px Arial', color: '#222', align: 'center', wordWrap: { width: 660 }
        }).setOrigin(0.5);
        // Nút củng cố kiến thức
        this.practiceBtn = this.add.text(512, boxY + boxHeight + 80, 'Củng cố kiến thức', {
            font: 'bold 26px Arial', color: '#fff', backgroundColor: '#4CAF50', padding: 16, borderRadius: 10
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
            this.startScrambleGame();
        });

        // Mini-game Expression Scramble
        this.startScrambleGame = () => {
            this.children.removeAll();
            this.bg = this.add.image(512, 384, 'background').setDisplaySize(1024, 768);
            this.timeLeft = 30;
            // Danh sách 5 câu hỏi (mỗi câu là 1 mảng các phần tử)
            this.questions = [
                ['√(4 × 9)', '=', '√4', '×', '√9'],
                ['√(16 × 25)', '=', '√16', '×', '√25'],
                ['√(9 × √4)', '=', '√9', '×', '√√4'],
                ['√(36 × 49)', '=', '√36', '×', '√49'],
                ['√(8 × 2)', '=', '√8', '×', '√2']
            ];
            this.currentQuestion = 0;
            this.showScrambleQuestion();
        };

        this.showScrambleQuestion = function() {
            this.children.removeAll();
            this.bg = this.add.image(512, 384, 'background').setDisplaySize(1024, 768);
            this.timeLeft = 30;
            // Tiêu đề mini game (in đậm, tô đen)
            this.add.text(512, 120, `Sắp xếp thành biểu thức đúng (${this.currentQuestion+1}/5)`, {
                font: 'bold 30px Arial', color: '#fff', backgroundColor: '#222', padding: { left: 18, right: 18, top: 8, bottom: 8 }, fontStyle: 'bold', align: 'center'
            }).setOrigin(0.5);
            // Bộ đếm thời gian kiểu IntroMathC1L2
            this.timerTextBg = this.add.graphics();
            this.timerTextBg.fillStyle(0xffe066, 0.95);
            this.timerTextBg.fillRoundedRect(740, 40, 180, 48, 18);
            this.timerTextBg.lineStyle(4, 0xff3333, 1);
            this.timerTextBg.strokeRoundedRect(740, 40, 180, 48, 18);
            this.timerText = this.add.text(830, 64, '', {
                font: 'bold 28px Arial', color: '#d7263d', fontStyle: 'bold', align: 'center',
                shadow: { offsetX: 2, offsetY: 2, color: '#fff', blur: 4, fill: true }
            }).setOrigin(0.5);
            this.updateTimerText();
            this.timer = this.time.addEvent({
                delay: 1000,
                loop: true,
                callback: () => {
                    this.timeLeft--;
                    this.updateTimerText();
                    if (this.timeLeft <= 0) {
                        this.endGame('Hết thời gian!');
                    }
                }
            });
            // Khu vực mục tiêu (5 ô trống)
            this.targetSlots = [];
            const slotWidth = 100, slotSpacing = 10, startX = 298; // Dời qua trái 50px
            for (let i = 0; i < 5; i++) {
                const slot = this.add.rectangle(startX + i * (slotWidth + slotSpacing), 260, slotWidth, 60, 0xcccccc)
                    .setStrokeStyle(2, 0x000000);
                this.targetSlots.push({ slot, content: null });
            }
            // Tạo các thành phần biểu thức
            this.expressionParts = [];
            this.correctOrder = this.questions[this.currentQuestion];
            const parts = Phaser.Utils.Array.Shuffle([...this.correctOrder]);
            parts.forEach((part, index) => {
                const x = Phaser.Math.Between(100, 924);
                const y = Phaser.Math.Between(300, 668);
                const partObj = this.add.text(x, y, part, {
                    fontSize: '24px', color: '#fff', backgroundColor: '#0066cc', padding: { x: 10, y: 5 }
                }).setOrigin(0.5).setInteractive({ useHandCursor: true });
                partObj.setData('originalX', x);
                partObj.setData('originalY', y);
                partObj.setData('part', part);
                // Kéo thả
                this.input.setDraggable(partObj);
                partObj.on('dragstart', () => {
                    partObj.setScale(1.1);
                    partObj.setStyle({ backgroundColor: '#003366' });
                });
                partObj.on('drag', (pointer, dragX, dragY) => {
                    partObj.setPosition(dragX, dragY);
                });
                partObj.on('dragend', () => {
                    partObj.setScale(1);
                    partObj.setStyle({ backgroundColor: '#0066cc' });
                    this.handleDrop(partObj);
                });
                this.expressionParts.push(partObj);
            });
            // Nút kiểm tra
            this.checkBtn = this.add.text(512, 600, 'Kiểm tra', {
                fontSize: '24px', color: '#fff', backgroundColor: '#4CAF50', padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive()
            .on('pointerover', () => this.checkBtn.setStyle({ backgroundColor: '#43a047' }))
            .on('pointerout', () => this.checkBtn.setStyle({ backgroundColor: '#4CAF50' }))
            .on('pointerdown', () => this.checkExpression());
            // Thông báo đúng/sai
            this.resultText = null;
        };

        this.updateTimerText = function() {
            if (!this.timerText) return;
            this.timerText.setText('⏰ ' + this.timeLeft + ' giây');
            if (this.timeLeft <= 5) {
                this.timerText.setColor('#fff');
                this.timerTextBg.clear();
                this.timerTextBg.fillStyle(0xff3333, 1);
                this.timerTextBg.fillRoundedRect(740, 40, 180, 48, 18);
                this.timerTextBg.lineStyle(4, 0xffe066, 1);
                this.timerTextBg.strokeRoundedRect(740, 40, 180, 48, 18);
                this.tweens.add({ targets: this.timerText, scale: 1.2, yoyo: true, duration: 200, repeat: 1 });
            } else {
                this.timerText.setColor('#d7263d');
                this.timerTextBg.clear();
                this.timerTextBg.fillStyle(0xffe066, 0.95);
                this.timerTextBg.fillRoundedRect(740, 40, 180, 48, 18);
                this.timerTextBg.lineStyle(4, 0xff3333, 1);
                this.timerTextBg.strokeRoundedRect(740, 40, 180, 48, 18);
                this.timerText.setScale(1);
            }
        };

        this.handleDrop = function(partObj) {
            let placed = false;
            this.targetSlots.forEach((slot, index) => {
                if (!placed && !slot.content) {
                    const bounds = slot.slot.getBounds();
                    if (Phaser.Geom.Rectangle.ContainsPoint(bounds, { x: partObj.x, y: partObj.y })) {
                        partObj.setPosition(bounds.centerX, bounds.centerY);
                        slot.content = partObj;
                        placed = true;
                    }
                }
            });
            if (!placed) {
                partObj.setPosition(partObj.getData('originalX'), partObj.getData('originalY'));
            }
        };

        this.checkExpression = function() {
            if (this.resultText) this.resultText.destroy();
            // Lấy vị trí dấu =
            let equalIdx = -1;
            for (let i = 0; i < this.targetSlots.length; i++) {
                const slot = this.targetSlots[i];
                if (!slot.content) {
                    this.showWrongAndNext();
                    return;
                }
                if (slot.content.getData('part') === '=') {
                    equalIdx = i;
                }
            }
            if (equalIdx === -1 || equalIdx === 0 || equalIdx === this.targetSlots.length - 1) {
                this.showWrongAndNext();
                return;
            }
            // Lấy hai vế
            let left = '', right = '';
            for (let i = 0; i < equalIdx; i++) {
                left += this.targetSlots[i].content.getData('part');
            }
            for (let i = equalIdx + 1; i < this.targetSlots.length; i++) {
                right += this.targetSlots[i].content.getData('part');
            }
            left = left.replace(/\s/g, '');
            right = right.replace(/\s/g, '');
            // Đánh giá hai vế, kiểm tra cả hai chiều
            let isCorrect = false;
            try {
                const leftVal = evalExpr(left);
                const rightVal = evalExpr(right);
                if (typeof leftVal === 'number' && typeof rightVal === 'number' && !isNaN(leftVal) && !isNaN(rightVal)) {
                    if (Math.abs(leftVal - rightVal) < 1e-6) {
                        isCorrect = true;
                    }
                }
            } catch {
                isCorrect = false;
            }
            if (!isCorrect) {
                // Thử đảo vế
                try {
                    const leftVal = evalExpr(right);
                    const rightVal = evalExpr(left);
                    if (typeof leftVal === 'number' && typeof rightVal === 'number' && !isNaN(leftVal) && !isNaN(rightVal)) {
                        if (Math.abs(leftVal - rightVal) < 1e-6) {
                            isCorrect = true;
                        }
                    }
                } catch {
                    // ignore
                }
            }
            if (isCorrect) {
                this.resultText = this.add.text(512, 500, '✔️ Đúng rồi! Biểu thức chính xác.', {
                    font: 'bold 26px Arial', color: '#fff', backgroundColor: '#43a047',
                    padding: { left: 18, right: 18, top: 8, bottom: 8 }, align: 'center', fontStyle: 'bold', borderRadius: 10,
                    shadow: { offsetX: 2, offsetY: 2, color: '#222', blur: 6, fill: true }
                }).setOrigin(0.5);
                this.time.delayedCall(1200, () => {
                    if (this.currentQuestion < this.questions.length - 1) {
                        this.currentQuestion++;
                        this.showScrambleQuestion();
                    } else {
                        this.endGame('Hoàn thành tất cả câu hỏi!');
                    }
                });
            } else {
                this.showWrongAndNext();
            }
        };
        // Hàm hiển thị sai và tự động next
        this.showWrongAndNext = function() {
            this.resultText = this.add.text(512, 500, '❌ Sai rồi!', {
                font: 'bold 26px Arial', color: '#fff', backgroundColor: '#d7263d',
                padding: { left: 18, right: 18, top: 8, bottom: 8 }, align: 'center', fontStyle: 'bold', borderRadius: 10,
                shadow: { offsetX: 2, offsetY: 2, color: '#222', blur: 6, fill: true }
            }).setOrigin(0.5);
            this.tweens.add({
                targets: this.targetSlots.map(slot => slot.slot),
                x: '+=10', duration: 50, repeat: 5, yoyo: true
            });
            this.time.delayedCall(1200, () => {
                if (this.resultText) this.resultText.destroy();
                if (this.currentQuestion < this.questions.length - 1) {
                    this.currentQuestion++;
                    this.showScrambleQuestion();
                } else {
                    this.endGame('Hoàn thành tất cả câu hỏi!');
                }
            });
        };

        // Hàm đánh giá giá trị biểu thức toán học đơn giản
        function evalExpr(expr) {
            // Ưu tiên thay thế √√ trước để tránh nhầm với √
            expr = expr.replace(/√√(\d+)/g, (m, n) => Math.sqrt(Math.sqrt(Number(n))));
            expr = expr.replace(/√\(([^)]+)\)/g, (m, n) => Math.sqrt(eval(n.replace(/×/g, '*'))));
            expr = expr.replace(/√(\d+)/g, (m, n) => Math.sqrt(Number(n)));
            expr = expr.replace(/×/g, '*');
            return eval(expr);
        }

        this.endGame = function(message) {
            if (this.timer) this.timer.remove();
            if (this.resultText) this.resultText.destroy();
            this.expressionParts.forEach(part => part.disableInteractive());
            this.checkBtn.disableInteractive();
            this.add.text(512, 400, `${message}`, {
                font: 'bold 32px Arial', color: '#fff', backgroundColor: '#43a047',
                padding: { left: 24, right: 24, top: 18, bottom: 18 }, align: 'center', fontStyle: 'bold', borderRadius: 16,
                shadow: { offsetX: 2, offsetY: 2, color: '#222', blur: 6, fill: true }, lineSpacing: 10
            }).setOrigin(0.5);
            // Tự động chuyển về trang Grade9 sau 2 giây
            this.time.delayedCall(2000, () => {
                if (this.scene && this.scene.manager) {
                    this.scene.start('Grade9');
                }
            });
        };
    }
}